const express = require("express");

const mongoose = require("mongoose");

const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const Complaint = require("../models/Complaint");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid complaint id" });
    }

    const complaint = await Complaint.findById(req.params.id).populate(
      "user_id",
      "firstName lastName name email"
    );
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ msg: err.message || "Failed to fetch complaint" });
  }
});

router.post("/submit", auth, upload.single("photo"), async (req, res) => {
  try {
    const issueType = req.body?.issueType ?? req.body?.type;

    let priority = req.body?.priority;
    if (priority === "Urgent") priority = "High";

    const location_coords = (req.body?.latitude != null && req.body?.longitude != null)
      ? { lat: req.body.latitude, lng: req.body.longitude }
      : undefined;

    const photo = req.file ? `/uploads/complaints/${req.file.filename}` : undefined;

    const complaint = await Complaint.create({
      ...req.body,
      issueType,
      priority,
      location_coords,
      photo,
      user_id: req.user.id
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to submit complaint" });
  }
});

module.exports = router;
