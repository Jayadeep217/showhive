require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./config/db");
const userRoutes = require("./routes/user.route.js");


const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
}));
app.use("/api/auth", userRoutes);



function serverPortInitialization(port) {
  const server = app.listen(port);

  server.on("listening", () => {
    console.log(`✅ server listening on -> ${port}`);
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
