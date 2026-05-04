const Show = require("../models/show.model.js");

const createShow = async (req, res) => {
  try {
    const newShow = new Show(req.body);
    await newShow.save();
    res.status(201).json({
      status: "success",
      message: "Show created successfully",
      show: newShow,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error creating show",
      error: error.message,
    });
  }
};

const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find();
    res.status(200).json({
      status: "success",
      message: "Shows retrieved successfully",
      shows: shows,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error retrieving shows",
      error: error.message,
    });
  }
};

const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({
        status: "error",
        message: "Show not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Show retrieved successfully",
      show: show,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error retrieving show",
      error: error.message,
    });
  }
};

const updateShow = async (req, res) => {
  try {
    const updatedShow = await Show.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    if (!updatedShow) {
      return res.status(404).json({
        status: "error",
        message: "Show not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Show updated successfully",
      show: updatedShow,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating show",
      error: error.message,
    });
  }
};

const deleteShow = async (req, res) => {
  try {
    const deletedShow = await Show.findByIdAndDelete(req.params.id);
    if (!deletedShow) {
      return res.status(404).json({
        status: "error",
        message: "Show not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Show deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting show",
      error: error.message,
    });
  }
};

module.exports = {
  createShow,
  getAllShows,
  getShowById,
  updateShow,
  deleteShow,
};
