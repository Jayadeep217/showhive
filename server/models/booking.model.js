const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "show",
      required: true,
    },
    seats: { type: [String], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
