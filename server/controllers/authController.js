import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/mailer.js";
import generateOtp from "../utils/generateOtp.js";
import bcrypt from "bcrypt";

// to make JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const sendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res
        .status(400)
        .json({ message: "User already registered and verified" });
    }

    if (user && !user.isVerified) {
      await User.deleteOne({ email });
      user = null;
    }

    user = new User({ email, isVerified: false });

    user.otp = generateOtp(6);
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail({
      to: email,
      subject: "Your Registration OTP for Media Capture and Storage App",
      html: `<p>Your OTP for registration is <b>${user.otp}</b>. It is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error in sendRegistrationToken:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// verify and the set password controller can be added here similarly

export const verifyOtpAndSetPassword = async (req, res) => {
  try {
    const { email, otp, password, name } = req.body;
    if (!email || !otp || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, OTP and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hashing should be done here
    user.password = hashedPassword;
    user.name = name;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    const token = createToken(user._id);

    res.status(200).json({
      message: "User verified and password set successfully",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Error in verifyOtpAndSetPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// login controller after verify the otp

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// profile access by the protect middleware

export const getProfile = async (req, res) => {
  res.json("hello profile");
};
