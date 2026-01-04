const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String },
    phone: { type: String },
    location: { type: String },
    gender: { type: String },
    bio: { type: String },
    role: {type: String,default: "user"},
    avatar: {type: String,default: null}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
