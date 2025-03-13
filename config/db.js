const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("Test ortamında olduğumuz için MongoDB'ye bağlanmadık.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Error in connecting MongoDB", err.message);
  }
};

module.exports = connectDB;
