const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // =========================
    // AUTH DETAILS
    // =========================
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =========================
    // PROFILE DETAILS
    // =========================
    fullName: String,
    phone: String,

    // Human-readable location (shown in UI)
    location: {
      type: String,
      trim: true,
    },

    // 🔥 IMPORTANT FOR VOLUNTEER MATCHING (GeoJSON Point)
    locationGeo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
        default: null,
      },
    },

    // City for location info
    city: {
      type: String,
      trim: true,
    },

    // State for filtering complaints
    state: {
      type: String,
      trim: true,
    },

    gender: String,
    bio: String,

    // =========================
    // USER ROLE
    // =========================
    role: {
      type: String,
      enum: ["citizen", "admin", "volunteer"],
      default: "citizen",
    },

    // =========================
    // PROFILE IMAGE
    // =========================
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// =========================
// 🔐 PASSWORD HASHING HANDLED IN CONTROLLER
// =========================

// =========================
// 🔐 PASSWORD CHECK METHOD
// =========================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ locationGeo: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
