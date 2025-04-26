const express = require("express")
const app = express();
const userRoutes = require("./routes/user.route")
const propertyRoutes = require("./routes/property.route")
const bookingRoutes = require("./routes/booking.route")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const errorHandler = require("./middlewares/errorHandler")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan("tiny"))
app.use("/api/auth", userRoutes)
app.use("/api/property", propertyRoutes)
app.use("/api/booking", bookingRoutes)

app.use(errorHandler)


module.exports = app;