const mongoose = require("mongoose");
const dotenv = require("dotenv");

const URL =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/SkillStackerCluster";
console.log("Connecting to MongoDB at:", URL);

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  })
  .then((e) => console.log("✅ Connected to MongoDB"))
  .catch((er) => console.log("❌ MongoDB connection error:", err));
