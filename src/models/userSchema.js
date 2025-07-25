const { Schema, model } = require("mongoose");
const UserSchema = new Schema({
  profilePic: {
    type: String,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  isUserLoggedIn: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("User", UserSchema);
