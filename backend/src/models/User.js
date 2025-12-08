const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String },
    gender:   { type: String, enum: ["Male", "Female", "Other"] },
    role:     { type: String, enum: ["user", "volunteer", "admin"], default: "user" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
