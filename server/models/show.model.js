const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    bookedSeats: { type: Array, default: [] },
    ticketPrice: { type: Number, required: true },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movie",
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theater",
      required: true,
    },
  },
  { timestamps: true },
);

const Show = mongoose.model("show", showSchema);

module.exports = Show;
