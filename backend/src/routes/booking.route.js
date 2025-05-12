const express = require('express');
const { createBookingController, viewBookingController, cancelBookingController , getAllBookingsController } = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/authMiddlware');
const router = express.Router();




router.post(
    "/create",
    authMiddleware,
    createBookingController
  );

  router.get(
    "/user-bookings/:userId",
    authMiddleware,
    viewBookingController
  );
  router.put(
    "/cancel/:id",
    authMiddleware,
    cancelBookingController
  );
  router.get("/get-all-booking", authMiddleware, getAllBookingsController)


module.exports = router;