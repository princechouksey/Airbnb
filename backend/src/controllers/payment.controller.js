const paymentInstance = require("../services/payment.services");
const CustomError = require("../utils/customError")
const Booking = require("../models/booking.model.js")
const crypto = require("crypto")
const {bookingConfirmationTemplate} = require("../utils/emailTemplate.js")
const sendEmail = require("../utils/email.js")
const Payment = require("../models/payment.model.js")

const processPaymentController = async (req, res, next) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || !currency)
      return next(new CustomError("All fields are required", 400));
    const options = {
      amount: amount * 100, // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };
    const razorpayOrder = await paymentInstance.orders.create(options);
    res.status(200).json({
      success: true,
      data: razorpayOrder,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
const verifyPaymentController = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature)
      return next(new CustomError("All fields are required", 400));

    // Find booking by razorpayOrderId
    const booking = await Booking.findOne({ razorpayOrderId })
      .populate("user_id", "username email ")
      .populate("property" ," title location")
      

    if (!booking) return next(new CustomError("Booking not found", 400));

    // Generate and verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature)
      return next(new CustomError("Invalid signature", 400));

    // Update booking status and details
    booking.status = "Completed";
    booking.paymentDetails = {
      payment_id: razorpayPaymentId,
      signature: razorpaySignature,
      order_id: razorpayOrderId,
    };
    await booking.save();

    // Create Payment document
    const payment = await Payment.create({
       user: {
        username: booking.user_id.username,  // Store username
        email: booking.user_id.email,        // Store email
      },
      property: {
        title : booking.property.title,
        location : booking.property.location,
      },
      booking: booking._id ,
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId,
      razorpaySignature: razorpaySignature,
      amount: booking.totalPrice,
      status: "success", 
    });

    // Send confirmation email

    const emailTemplate = bookingConfirmationTemplate(
      booking.user_id.username,
      booking.property.location,
      booking.status,
      booking.totalPrice
    );

    await sendEmail(
      booking.user_id.email,
      "Booking Confirmation",
      emailTemplate
    );

    res.status(200).json({
      success: true,
      message: "Payment verified and recorded successfully",
       data: {
        booking,
        payment,
      },
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};


const getAllPaymentsController = async (req, res, next) => {
  try {
    const payments = await Payment.find(); // ✅ Await here

    if (!payments || payments.length === 0)
      return next(new CustomError("No payment found", 404));

    res.status(200).json({
      data: payments,
      success: true,
      message: "Payments Fetched Successfully",
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
const deletePaymentController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return next(new CustomError("Payment not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
      data: deletedPayment,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports = {
    processPaymentController,
    verifyPaymentController,
    getAllPaymentsController,
    deletePaymentController 
}