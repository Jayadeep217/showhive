const express = require("express");
const movieRouter = express.Router();
const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controllers/movie.controller.js");

const { authorize } = require("../middlewares/auth.middleware.js");

movieRouter.get("/all", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/create", createMovie);
movieRouter.put("/update/:id", updateMovie);
movieRouter.delete("/delete/:id", deleteMovie);

module.exports = movieRouter;
