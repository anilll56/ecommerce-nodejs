const mongoose = require("mongoose");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");

const sendEmail = require("../nodeMail/nodemailer");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
    sendEmail();
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;
