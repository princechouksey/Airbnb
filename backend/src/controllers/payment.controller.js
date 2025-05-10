const paymentInstance = require("../services/payment.services");
const CustomError = require("../utils/customError")
const Booking = require("../models/booking.model.js")
const crypto = require("crypto")
const {bookingConfirmationTemplate} = require("../utils/emailTemplate.js")
const sendEmail = require("../utils/email.js")

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

    const booking = await Booking.findOne({ razorpayOrderId })
      .populate("user_id", "email username")
      .populate("property", "location");
    if (!booking) return next(new CustomError("Booking not found", 400));

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature)
      return next(new CustomError("Invalid signature", 400));
    booking.status = "Completed";
    booking.paymentDetails = {
      payment_id: razorpayPaymentId,
      signature: razorpaySignature,
      order_id: razorpayOrderId,
    };
    await booking.save();

    const emailTemplate = bookingConfirmationTemplate(
      req.user.username,
      booking.property.location,
      booking.status,
      booking.totalPrice
    );
    const email = await sendEmail(
      "princechouksey179@gmail.com",
      "Booking Confirmation",
      emailTemplate
    );
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: booking,
    });
  } 
  catch (error) {
    next(new CustomError(error.message, 500));
  }
};


module.exports = {
    processPaymentController,
    verifyPaymentController,
}