const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authorize } = require("../middlewares/auth.middleware.js");

const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userExists = await User.findOne({ email });

    const password = await bcrypt.hash(req.body.password, 10);

    if (userExists) {
      res.status(400).json({
        status: "error",
        message: `User already exists with email: ${email} !!`,
      });
      return;
    }

    const newUser = await User.create({ name, email, password });
    res.status(201).json({
      status: "success",
      message: "User registered successfully!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error registering user",
      error: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        status: "error",
        message: `No user found with email: ${email}. Please register!`,
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({
        status: "error",
        message: "Invalid password!",
      });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie("jwt_token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully!",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error logging in user",
      error: error.message
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found!",
      });
      return;
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
      error: error.message
    });
  }
};

module.exports = { registerUser, loginUser, getUser };
