const Movie = require("../models/movie.model");

const createMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res
      .status(201)
      .json({
        status: "success",
        message: "Movie created successfully",
        movie: newMovie,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error creating movie",
        error: error.message,
      });
  }
};

const getAllMovies = async (req, res) => {};

const getMovieById = async (req, res) => {};

const updateMovie = async (req, res) => {};

const deleteMovie = async (req, res) => {};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
