const Theater = require("../models/theater.model.js");

const createTheater = async (req, res) => {
  try {
    const newTheater = new Theater(req.body);
    await newTheater.save();
    res.status(201).json({
      status: "success",
      message: "Theater created successfully",
      theater: newTheater,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error creating theater",
      error: error.message,
    });
  }
};

const getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.status(200).json({
      status: "success",
      message: "Theaters retrieved successfully",
      theaters: theaters,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error retrieving theaters",
      error: error.message,
    });
  }
};

const getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater) {
      return res.status(404).json({
        status: "error",
        message: "Theater not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Theater retrieved successfully",
      theater: theater,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error retrieving theater",
      error: error.message,
    });
  }
};

const updateTheater = async (req, res) => {
  try {
    const updatedTheater = await Theater.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" },
    );
    if (!updatedTheater) {
      return res.status(404).json({
        status: "error",
        message: "Theater not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Theater updated successfully",
      theater: updatedTheater,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating theater",
      error: error.message,
    });
  }
};

const deleteTheater = async (req, res) => {
  try {
    const deletedTheater = await Theater.findByIdAndDelete(req.params.id);
    if (!deletedTheater) {
      return res.status(404).json({
        status: "error",
        message: "Theater not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Theater deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting theater",
      error: error.message,
    });
  }
};

module.exports = {
  createTheater,
  getAllTheaters,
  getTheaterById,
  updateTheater,
  deleteTheater,
};
