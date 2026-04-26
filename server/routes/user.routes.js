const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  getUser,
} = require("../controllers/user.controller.js");
const { authorize } = require("../middlewares/auth.middleware.js");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getuser", authorize, getUser);

module.exports = router;
