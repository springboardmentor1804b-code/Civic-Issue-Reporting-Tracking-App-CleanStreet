const mongoose = require("mongoose");

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const issueSchema = new mongoose.Schema(
  {
    issueTitle: {
      type: String,
      required: true,
    },
    issueType: {
      type: String,
      required: true,
      enum: [
        "Garbage",
        "Road Damage",
        "Water Leakage",
        "Streetlight Issue",
        "Drainage Problem",
        "Other",
      ],
    },
    priorityLevel: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High", "Critical"],
    },
    address: {
      type: String,
      default: "",
    },
    landmark: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number], 
    required: true,
  },
},
    images: [
      {
        type: String, 
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    offeredTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    },
    volunteerResponse: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
    },
    rejectedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],


    // Likes - array of user IDs who liked
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Dislikes - array of user IDs who disliked
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Comments
    comments: [commentSchema],
  },
  { timestamps: true }
);

//REQUIRED for nearest-volunteer query
issueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Issue", issueSchema);
