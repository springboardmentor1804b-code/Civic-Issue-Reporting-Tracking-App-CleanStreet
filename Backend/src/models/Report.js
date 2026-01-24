const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    // USER WHO REPORTED
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // VOLUNTEER ASSIGNED (ONLY ONE)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },

    location: { type: String, required: true },
    latitude: Number,
    longitude: Number,

    images: {
      type: [String],
      default: [],
    },

    securityLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Rejected"],
      default: "Pending",
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
