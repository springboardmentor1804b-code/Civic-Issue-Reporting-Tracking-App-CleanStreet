const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    /* =========================
       REPORT CREATOR (CITIZEN)
    ========================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* =========================
       BASIC REPORT DETAILS
    ========================= */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    /* =========================
       HUMAN READABLE LOCATION
       (Shown in UI)
    ========================= */
    location: {
      type: String,
      required: false,
      trim: true,
    },

    /* =========================
       GEOLOCATION (GeoJSON Point)
       Used for geolocation-based volunteer matching
    ========================= */
    locationGeo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    /* =========================
       CITY (for location/city info)
    ========================= */
    city: {
      type: String,
      required: false,
      trim: true,
    },

    /* =========================
       STATE (for location/state info)
    ========================= */
    state: {
      type: String,
      required: false,
      trim: true,
    },

    /* =========================
       ASSIGNMENT LOGIC
    ========================= */
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "in_progress", "resolved"],
      default: "pending",
    },

    /* =========================
       IMAGES
    ========================= */
    images: {
      type: [String],
      default: [],
    },

    /* =========================
       SECURITY LEVEL
    ========================= */
    securityLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    /* =========================
       LIKES / DISLIKES
    ========================= */
    likes: {
      type: Number,
      default: 0,
    },

    dislikes: {
      type: Number,
      default: 0,
    },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    dislikedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* =========================
       OPTIONAL ANONYMOUS
    ========================= */
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add 2dsphere index for geolocation queries
ReportSchema.index({ locationGeo: "2dsphere" });

module.exports = mongoose.model("Report", ReportSchema);
