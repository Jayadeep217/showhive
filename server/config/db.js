const mongoose = require("mongoose");
const { formatLocalTimestamp } = require("../utils/date.utils.js");

async function dbConnection() {
  try {
    console.log(`${formatLocalTimestamp()} | 🔃 Connecting to DB...`);
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
    console.log(`${formatLocalTimestamp()} | ✅ db connection successful`);
  } catch (error) {
    const err = new Error("❌ db connection error!\n" + error.message);
    err.original = error;
    throw err;
  }
}

module.exports = { dbConnection };
