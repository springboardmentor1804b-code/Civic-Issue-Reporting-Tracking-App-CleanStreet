const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },

    location: { type: String, required: true },
    latitude: Number,
    longitude: Number,

    // MULTIPLE IMAGES
    images: {
      type: [String],
      default: [],
    },

    // SECURITY LEVEL
    securityLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
   likes: { type: Number, default: 0 },
dislikes: { type: Number, default: 0 },
likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

status: {
  type: String,
  enum: ["Pending", "In Progress", "Completed"],
  default: "Pending"
},


    // OPTIONAL ANONYMOUS
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
