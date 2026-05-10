const express = require("express");
const movieRouter = express.Router();
const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controllers/movie.controller.js");

const { authorize, requireRole } = require("../middlewares/auth.middleware.js");

movieRouter.get("/all", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/create", authorize, requireRole("admin"), createMovie);
movieRouter.put("/update/:id", authorize, requireRole("admin"), updateMovie);
movieRouter.delete("/delete/:id", authorize, requireRole("admin"), deleteMovie);

module.exports = movieRouter;
