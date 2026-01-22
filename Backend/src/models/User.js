
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  location: String,
  website: String,
  bio: String,
  profileImage: String,
  role: { type: String, default: "user" }
});

module.exports = mongoose.model("User", userSchema);
