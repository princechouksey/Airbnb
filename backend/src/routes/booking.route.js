const express = require('express');
const { createBookingController, viewBookingController, cancelBookingController } = require('../controllers/booking.controller');
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
    "/:id",
    authMiddleware,
    cancelBookingController
  );


module.exports = router;