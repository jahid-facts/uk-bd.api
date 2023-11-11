const express = require("express");
const {
  getUserById,
  registerUser,
  loginUser,
  verifyOTP,
  logoutUser,
  updateUser,
  getAllUser,
  resetPassword,
  resendOTP,
  resetPasswordPage,
  checkUserOTP,
  changeUserPassword,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");
const {
  studentController,
  studentAddController,
  studentDeleteController,
  studentEditController,
  studentUpdateController,
} = require("../controllers/studentController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);
router.post("/reset/password", resetPassword);
router.post("/reset-password-page", resetPasswordPage);
router.put("/change-password", changeUserPassword);
router.post("/check-otp", checkUserOTP);
router.post("/logout", authMiddleware, logoutUser);
router.put("/update/:id", updateUser);
router.get("/users", getAllUser);
router.get("/user/:id", getUserById);


router.get("/students", studentController);
router.post("/add", studentAddController);
router.delete("/delete/:id", studentDeleteController);
router.get("/edit/:id", studentEditController);
router.put("/update", studentUpdateController);

module.exports = router;
