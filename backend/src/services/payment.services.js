const Razorpay = require("razorpay");
console.log('env---->', process.env.RAZORPAY_KEY_ID)
console.log('env---->', process.env.RAZORPAY_KEY_SECRET);

 const paymentInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,

 })
 module.exports = paymentInstance;