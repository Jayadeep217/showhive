const express = require("express");
const bookingRouter = express.Router();
const { createBooking, getUserBookings } = require("../controllers/booking.controller.js");
const { authorize } = require("../middlewares/auth.middleware.js");

bookingRouter.post("/create", authorize, createBooking);
bookingRouter.get("/user", authorize, getUserBookings);

module.exports = bookingRouter;
