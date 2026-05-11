const Booking = require("../models/booking.model.js");
const Show = require("../models/show.model.js");
const User = require("../models/user.model.js");
const { sendBookingConfirmation } = require("../utils/email.utils.js");

const createBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.userId;

    // Atomically claim the seats — fails if any seat is already taken
    const show = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $not: { $elemMatch: { $in: seats } } } },
      { $push: { bookedSeats: { $each: seats } } },
      { returnDocument: "after" },
    );
    if (!show) {
      // Either show doesn't exist or seats were already booked
      const exists = await Show.exists({ _id: showId });
      return res.status(exists ? 400 : 404).json({
        status: "error",
        message: exists ? "Some seats are already booked" : "Show not found",
      });
    }

    const totalAmount = seats.length * show.ticketPrice;
    const booking = new Booking({
      user: userId,
      show: showId,
      seats,
      totalAmount,
    });
    await booking.save();

    const populated = await booking.populate({
      path: "show",
      populate: [{ path: "movie" }, { path: "theater" }],
    });

    res.status(201).json({
      status: "success",
      message: "Booking confirmed",
      booking: populated,
    });

    // Send confirmation email — non-blocking, failure doesn't affect the booking
    User.findById(userId)
      .select("name email")
      .then((user) => {
        if (user)
          sendBookingConfirmation(user, booking, populated.show).catch((err) =>
            console.error("Booking email error:", err.message),
          );
      });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error creating booking",
      error: error.message,
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "show",
        populate: [{ path: "movie" }, { path: "theater" }],
      });
    res.status(200).json({ status: "success", bookings });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error retrieving bookings",
      error: error.message,
    });
  }
};

module.exports = { createBooking, getUserBookings };
