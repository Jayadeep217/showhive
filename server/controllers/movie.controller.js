const Movie = require("../models/movie.model");

const createMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json({
      status: "success",
      message: "Movie created successfully",
      movie: newMovie,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error creating movie",
      error: error.message,
    });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({
      status: "success",
      message: "Movies retrieved successfully",
      movies: movies,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error retrieving movies",
      error: error.message,
    });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Movie retrieved successfully",
      movie: movie,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error retrieving movie",
      error: error.message,
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" },
    );
    if (!updatedMovie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Movie updated successfully",
      movie: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating movie",
      error: error.message,
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting movie",
      error: error.message,
    });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
