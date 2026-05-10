const Booking = require("../models/booking.model.js");
const Show = require("../models/show.model.js");

const createBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.userId;

    const show = await Show.findById(showId);
    if (!show) {
      return res
        .status(404)
        .json({ status: "error", message: "Show not found" });
    }

    const conflict = seats.some((seat) => show.bookedSeats.includes(seat));
    if (conflict) {
      return res
        .status(400)
        .json({ status: "error", message: "Some seats are already booked" });
    }

    const totalAmount = seats.length * show.ticketPrice;
    const booking = new Booking({
      user: userId,
      show: showId,
      seats,
      totalAmount,
    });
    await booking.save();

    show.bookedSeats.push(...seats);
    await show.save();

    const populated = await booking.populate({
      path: "show",
      populate: [{ path: "movie" }, { path: "theater" }],
    });

    res
      .status(201)
      .json({
        status: "success",
        message: "Booking confirmed",
        booking: populated,
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
