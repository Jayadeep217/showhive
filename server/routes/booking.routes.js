const express = require("express");
const bookingRouter = express.Router();
const {
  createBooking,
  getUserBookings,
} = require("../controllers/booking.controller.js");
const {
  createOrder,
  verifyPayment,
} = require("../controllers/payment.controller.js");
const { authorize } = require("../middlewares/auth.middleware.js");

bookingRouter.post("/create", authorize, createBooking);
bookingRouter.get("/user", authorize, getUserBookings);
bookingRouter.post("/create-order", authorize, createOrder);
bookingRouter.post("/verify-payment", authorize, verifyPayment);

module.exports = bookingRouter;
