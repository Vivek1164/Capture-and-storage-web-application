import express from "express";
const router = express.Router();
import {
  sendRegistrationOtp,
  verifyOtpAndSetPassword,
  loginUser,
  getProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

router.post("/send-otp", sendRegistrationOtp);
router.post("/verify-otp", verifyOtpAndSetPassword);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

export default router;
