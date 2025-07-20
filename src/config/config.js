const mongoose = require("mongoose");
const dotenv = require("dotenv");

const URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resume_builder";

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((e) => console.log("✅ Connected to MongoDB"))
  .catch((er) => console.log("❌ MongoDB connection error:", err));
