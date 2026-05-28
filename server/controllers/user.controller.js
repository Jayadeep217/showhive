const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomInt } = require("crypto");
const { sendPasswordOTP } = require("../utils/email.utils.js");

const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: `User already exists with email: ${email} !!`,
      });
    }

    const password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({ name, email, password });

    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({
      status: "success",
      message: "User registered successfully!",
      data: userObj,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error registering user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `No user found with email: ${email}. Please register!`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password!",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.cookie("jwt_token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      status: "success",
      message: "User logged in successfully!",
      data: userObj,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error logging in user",
      error: error.message,
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("jwt_token");
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully." });
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -otp -otpExpiry",
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User data retrieved successfully!",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error retrieving user data",
      error: error.message,
    });
  }
};

const requestOtp = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found!" });
    }

    const otp = randomInt(100000, 1000000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendPasswordOTP(user, otp);

    res
      .status(200)
      .json({ status: "success", message: "OTP sent to your email." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Failed to send OTP. Check your email configuration.",
      error: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, otp } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found!" });
    }

    if (
      !user.otp ||
      !user.otpExpiry ||
      user.otp !== otp ||
      new Date() > user.otpExpiry
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired OTP." });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res
        .status(400)
        .json({ status: "error", message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.clearCookie("jwt_token");
    res
      .status(200)
      .json({ status: "success", message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating password",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 });
    res.status(200).json({ status: "success", users });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "partner", "admin"].includes(role)) {
      return res.status(400).json({ status: "error", message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password -otp -otpExpiry");
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    res.status(200).json({ status: "success", message: "Role updated", user });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating role",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  requestOtp,
  updatePassword,
  getAllUsers,
  updateUserRole,
};
