const express = require("express")
const router = express.Router();
const userController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/authMiddlware")

router.post("/register", userController.registerUserController)
router.post("/login", userController.loginUserController)
router.post("/logout",authMiddleware, userController.logoutUserController)
router.get("/profile",authMiddleware, userController.currentUserController)
router.post("/reset-password/:token", userController.resetPasswordController);
router.post("/forgot-password", userController.resetUserPasswordController)
router.put("/update", authMiddleware, userController.updateUserProfileController)


module.exports = router