require("dotenv").config();
const express = require("express");
const { dbConnection } = require("./config/db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

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
