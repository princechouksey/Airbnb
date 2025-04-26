const express = require('express');
const { createBookingController } = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/authMiddlware');
const router = express.Router();




router.post(
    "/create",
    authMiddleware,
    createBookingController
  );


module.exports = router;