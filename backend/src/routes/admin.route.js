const express = require("express");
const {
  getAllUserController,
  deleteUserController,
  getAllBookingsController,
  deleteBookingController,
  getAllPropertiesController,
  deletePropertyController,
} = require("../controllers/admin.controller.js");
const adminMiddleware = require("../middlewares/adminMiddleware.js");
const router = express.Router();

router.get("/all-users", adminMiddleware, getAllUserController);
router.delete("/delete-user/:id", adminMiddleware, deleteUserController);
router.get("/all-booking", adminMiddleware, getAllBookingsController);
router.delete("/delete-booking/:id", adminMiddleware, deleteBookingController);
router.get("/all-properties", adminMiddleware, getAllPropertiesController);
router.delete(
  "/delete-property/:id",
  adminMiddleware,
  deletePropertyController
);

module.exports = router;
