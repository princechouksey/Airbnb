const Booking = require("../models/booking.model");
const Property = require("../models/property.model");
const CustomError = require("../utils/customError");
const paymentInstance = require("../services/payment.services");
const {bookingConfirmationTemplate }= require("../utils/emailTemplate.js");
const sendEmail = require("../utils/email.js");
const User = require("../models/user.model.js");


const createBookingController = async (req, res, next) => {
  try {
    const { property_id, checkin_date, checkout_date, totalPrice } = req.body;

    const property = await Property.findById(property_id);
    if (!property) return next(new CustomError("Property not found", 400));

    if (!property_id && !checkin_date && !checkout_date && !totalPrice)
      return next(new CustomError("All fields are required", 400));
// console.log('property--->', property);
    

    const booking = await Booking.create({
      property: property_id,
      user_id: req.user._id,
      checkin_date,
      checkout_date,
      totalPrice,
      status: "Pending",
    });
     // Add the propertyId to the properties array of the user who created it
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new CustomError("User not found", 404));
    }
     user.bookings.push(booking._id)
     await user.save();


    const options = {
      amount: totalPrice * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${booking._id}`,
      payment_capture: 1,
    };
    const razorpayOrder = await paymentInstance.orders.create(options);
    // console.log('razorpayOrder--->', razorpayOrder);
    
    booking.razorpayOrderId = razorpayOrder.id;
    await booking.save();

    const bookingTemplate = bookingConfirmationTemplate(
      req.user.name,
      property.location,
      checkin_date,
      checkout_date,
      razorpayOrder
    );
    await sendEmail(
      "princechouksey137@gmail.com",
      "Booking Confirmation",
      bookingTemplate
    );

    res.status(200).json({
      success: true,
      data: booking,
      amount: totalPrice,
    });
  } catch (err) {
    next(new CustomError(err.message, 500));
  }
};

const viewBookingController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!userId) return next(new CustomError("User id is required", 400));
    const bookings = await Booking.find({ user_id: userId }).populate(
      "user_id",
      "username email"
    );
    if (!bookings) return next(new CustomError("No bookings found", 400));

    res.status(200).json({
      message: "Bookings fetched successfully",
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

const cancelBookingController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new CustomError("Booking id is required", 400));
    const booking = await Booking.findById(id);
    if (!booking) return next(new CustomError("Booking not found", 400));
    if (booking.status === "Cancelled")
      return next(new CustomError("Booking already cancelled", 400));
    if (booking.user_id.toString() !== req.user._id.toString())
      return next(new CustomError("Unauthorized user", 401));

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      success: true,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
const getAllBookingsController = async (req, res, next) => {
  try {
    const booking = await Booking.find()
  .populate('user_id', 'username email') // populate user details
  .populate('property', 'title location'); 
    if (!booking) return next(new CustomError("No bookings found", 400));
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: booking,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
module.exports = { createBookingController, viewBookingController , cancelBookingController, getAllBookingsController };
