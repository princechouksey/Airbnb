const User = require("../models/user.model");

const getAllUserController = async (req, res, next) => {
  try {
    const users = User.find();
    if (!users) return next(new CustomError("No users found", 400));
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new CustomError("User id is required", 400));
    const user = await User.findByIdAndDelete(id);
    if (!user) return next(new CustomError("User not found", 400));
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

const getAllBookingsController = async (req, res, next) => {
  try {
    const booking = await Booking.find();
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
const deleteBookingController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new CustomError("Booking id is required", 400));
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return next(new CustomError("Booking not found", 400));
    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
const getAllPropertiesController = async (req, res, next) => {
  try {
    const properties = await Property.find();
    if (!properties) return next(new CustomError("No properties found", 400));
    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: properties,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
const deletePropertyController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new CustomError("Property id is required", 400));
    const property = await Property.findByIdAndDelete(id);
    if (!property) return next(new CustomError("Property not found", 400));
    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports = {
  getAllUserController,
  deleteUserController,
  getAllBookingsController,
  deleteBookingController,
  getAllPropertiesController,
  deletePropertyController,
};
