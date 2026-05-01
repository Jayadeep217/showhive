const express = require("express");
const theaterRouter = express.Router();
const {
  createTheater,
  getAllTheaters,
  getTheaterById,
  updateTheater,
  deleteTheater,
} = require("../controllers/theater.controller.js");

const { authorize } = require("../middlewares/auth.middleware.js");

theaterRouter.get("/all", getAllTheaters);
theaterRouter.get("/:id", getTheaterById);
theaterRouter.post("/create", createTheater);
theaterRouter.put("/update/:id", updateTheater);
theaterRouter.delete("/delete/:id", deleteTheater);

module.exports = theaterRouter;
