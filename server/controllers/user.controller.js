const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userExists = await User.findOne({ email });

    const password = await bcrypt.hash(req.body.password, 10);

    if (userExists) {
      res.send({
        status: "error",
        message: `User already exists with email: ${email} !!`,
      });
      return;
    }

    const newUser = await User.create({ name, email, password });
    res.send({
      status: "success",
      message: "User registered successfully!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.send({
        status: "error",
        message: `No user found with email: ${email}. Please register!`,
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.send({
        status: "error",
        message: "Invalid password!",
      });
      return;
    }

    res.send({
      status: "success",
      message: "User logged in successfully!",
      data: user,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = { registerUser, loginUser };
