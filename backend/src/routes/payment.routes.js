const express = require('express');
const { processPaymentController, verifyPaymentController } = require('../controllers/payment.controller.js');
const authMiddleware = require('../middlewares/authMiddlware.js');
const router = express.Router();

router.post(
    "/payment-process",
    authMiddleware,
    paymentController.processPaymentController
  );
  router.post(
    "/payment-verify",
    authMiddleware,
    paymentController.verifyPaymentController
  );





module.exports = router;