const express = require("express")
const router = express.Router();
const userController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/authMiddlware")

router.post("/register", userController.registerUserController)
router.post("/login", userController.loginUserController)
router.post("/logout",authMiddleware, userController.logoutUserController)
router.get("/profile",authMiddleware, userController.currentUserController)

module.exports = router