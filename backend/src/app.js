const express = require("express")
const app = express();
const userRoutes = require("./routes/user.route")
const propertyRoutes = require("./routes/property.route")
const bookingRoutes = require("./routes/booking.route")
const paymentRoutes = require("./routes/payment.routes")
const adminRoutes = require("./routes/admin.route.js")
const reviewRoutes = require("./routes/review.route.js")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const errorHandler = require("./middlewares/errorHandler")

const cors = require("cors")
app.use(cors({
    origin:true,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan("tiny"))
app.use("/api/auth", userRoutes)
app.use("/api/property", propertyRoutes)
app.use("/api/booking", bookingRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/review", reviewRoutes)

app.use(errorHandler)


module.exports = app;