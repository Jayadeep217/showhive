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

const { authorize, requireRole } = require("../middlewares/auth.middleware.js");

showRouter.get("/all", getAllShows);
showRouter.get("/theater/:theaterId", getShowsByTheater);
showRouter.post("/allTheatersbyMovie", getAllTheatersByMovie);
showRouter.post(
  "/create",
  authorize,
  requireRole("partner", "admin"),
  createShow,
);
showRouter.put(
  "/update/:id",
  authorize,
  requireRole("partner", "admin"),
  updateShow,
);
showRouter.delete(
  "/delete/:id",
  authorize,
  requireRole("partner", "admin"),
  deleteShow,
);
showRouter.get("/:id", getShowById);

module.exports = showRouter;
