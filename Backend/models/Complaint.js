const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  issueType: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  description: { type: String, required: true },
  address: { type: String, required: true },
  landmark: { type: String },
  photo: { type: String },
  location_coords: { lat: Number, lng: Number },
  assigned_to: { type: String, default: "Municipal Authority" },
  status: {
    type: String,
    enum: ["received", "in_review", "resolved"],
    default: "received"
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);