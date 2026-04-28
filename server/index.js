require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { formattedDateTime } = require("./utils/date.utils.js");
const { dbConnection } = require("./config/db");
const userRoutes = require("./routes/user.routes.js");
const movieRoutes = require("./routes/movie.routes.js");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/movies", movieRoutes);

// Server Initialization
function serverPortInitialization(port) {
  const server = app.listen(port);

  server.on("listening", () => {
    console.log(`${formatLocalTimestamp()} ✅ server listening on -> ${port}`);
  });

  server.on("error", (error) => {
    console.error("❌ port error!\n", error);
    process.exit(1);
  });
}

async function startServer() {
  try {
    await dbConnection();
    serverPortInitialization(process.env.SERVER_PORT);
  } catch (error) {
    console.error("❌ Server startup error:", error);
  }
}

startServer();
