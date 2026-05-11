const crypto = require("crypto");
const Razorpay = require("razorpay");
const Booking = require("../models/booking.model.js");
const Show = require("../models/show.model.js");
const User = require("../models/user.model.js");
const { sendBookingConfirmation } = require("../utils/email.utils.js");

const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

const createOrder = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "showId and seats are required" });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res
        .status(404)
        .json({ status: "error", message: "Show not found" });
    }

    const conflict = seats.some((s) => show.bookedSeats.includes(s));
    if (conflict) {
      return res
        .status(400)
        .json({ status: "error", message: "Some seats are already booked" });
    }

    const amount = seats.length * show.ticketPrice * 100; // Razorpay expects paise

    const order = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { showId, seats: seats.join(","), userId: req.userId },
    });

    res.status(200).json({
      status: "success",
      orderId: order.id,
      amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create payment order" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      showId,
      seats,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !showId ||
      !seats
    ) {
      return res.status(400).json({
        status: "error",
        message: "Missing payment verification fields",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ status: "error", message: "Payment verification failed" });
    }

    // Atomically claim seats — same race-condition-safe pattern as createBooking
    const show = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $not: { $elemMatch: { $in: seats } } } },
      { $push: { bookedSeats: { $each: seats } } },
      { returnDocument: "after" },
    );

    if (!show) {
      const exists = await Show.exists({ _id: showId });
      return res.status(exists ? 400 : 404).json({
        status: "error",
        message: exists
          ? "Some seats were booked by someone else"
          : "Show not found",
      });
    }

    const totalAmount = seats.length * show.ticketPrice;
    const booking = await Booking.create({
      user: req.userId,
      show: showId,
      seats,
      totalAmount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    const populated = await booking.populate({
      path: "show",
      populate: [{ path: "movie" }, { path: "theater" }],
    });

    res.status(201).json({
      status: "success",
      message: "Booking confirmed",
      booking: populated,
    });

    User.findById(req.userId)
      .select("name email")
      .then((user) => {
        if (user) {
          sendBookingConfirmation(user, booking, populated.show).catch((err) =>
            console.error("Booking email error:", err.message),
          );
        }
      });
  } catch (error) {
    console.error("Verify payment error:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error confirming booking" });
  }
};

module.exports = { createOrder, verifyPayment };
