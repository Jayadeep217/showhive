const express = require("express");
const showRouter = express.Router();
const {
  createShow,
  getAllShows,
  getShowById,
  updateShow,
  deleteShow,
} = require("../controllers/show.controller.js");

const { authorize } = require("../middlewares/auth.middleware.js");

showRouter.get("/all", getAllShows);
showRouter.get("/:id", getShowById);
showRouter.post("/create", createShow);
showRouter.put("/update/:id", updateShow);
showRouter.delete("/delete/:id", deleteShow);

module.exports = showRouter;
