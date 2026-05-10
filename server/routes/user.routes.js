const express = require("express");
const userRouter = express.Router();
const {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  updatePassword,
} = require("../controllers/user.controller.js");
const { authorize } = require("../middlewares/auth.middleware.js");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/user", authorize, getUser);
userRouter.put("/password", authorize, updatePassword);

module.exports = userRouter;
