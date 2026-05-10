const express = require("express");
const theaterRouter = express.Router();
const {
  createTheater,
  getAllTheaters,
  getPartnerTheaters,
  getTheaterById,
  updateTheater,
  deleteTheater,
} = require("../controllers/theater.controller.js");

const { authorize, requireRole } = require("../middlewares/auth.middleware.js");

theaterRouter.get("/all", getAllTheaters);
theaterRouter.get("/partner/my", authorize, getPartnerTheaters);
theaterRouter.get("/:id", getTheaterById);
theaterRouter.post(
  "/create",
  authorize,
  requireRole("partner", "admin"),
  createTheater,
);
theaterRouter.put(
  "/update/:id",
  authorize,
  requireRole("partner", "admin"),
  updateTheater,
);
theaterRouter.delete(
  "/delete/:id",
  authorize,
  requireRole("partner", "admin"),
  deleteTheater,
);

module.exports = theaterRouter;
