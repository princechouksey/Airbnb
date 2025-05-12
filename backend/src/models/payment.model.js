const  mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  user: {
    username: { type: String, required: true },
    email: { type: String, required: true },
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  property: {
   title: { type: String, required: true },
    location : { type: String, required: true },
  },

  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
    required: true,
  },
  razorpaySignature: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["card", "upi", "netbanking", "wallet", "emi", "other"],
    default: "other",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

 

module.exports = mongoose.model("Payment", paymentSchema);
