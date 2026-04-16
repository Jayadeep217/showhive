const mongoose = require("mongoose");

async function dbConnection() {
  try {
    console.log("🔃 Connecting to DB...");
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
    console.log("✅ db connection successful");
  } catch (error) {
    const err = new Error("❌ db connection error!\n" + error.message);
    err.original = error;
    throw err;
  }
}

module.exports = { dbConnection };
