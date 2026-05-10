const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    res.cookie("jwt_token", token, { httpOnly: true });

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
    const user = await User.findById(req.userId).select("-password");

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

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found!" });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res
        .status(400)
        .json({ status: "error", message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updatePassword,
};
