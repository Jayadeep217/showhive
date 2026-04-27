const express = require("express");
const userRouter = express.Router();
const {
  loginUser,
  registerUser,
  getUser,
} = require("../controllers/user.controller.js");
const { authorize } = require("../middlewares/auth.middleware.js");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/getuser", authorize, getUser);

module.exports = userRouter;
