const express = require("express");
const showRouter = express.Router();
const {
  createShow,
  getAllShows,
  getShowById,
  getShowsByTheater,
  getAllTheatersByMovie,
  updateShow,
  deleteShow,
} = require("../controllers/show.controller.js");

const { authorize } = require("../middlewares/auth.middleware.js");

showRouter.get("/all", getAllShows);
showRouter.get("/theater/:theaterId", getShowsByTheater);
showRouter.post("/allTheatersbyMovie", getAllTheatersByMovie);
showRouter.post("/create", createShow);
showRouter.put("/update/:id", updateShow);
showRouter.delete("/delete/:id", deleteShow);
showRouter.get("/:id", getShowById);

module.exports = showRouter;
