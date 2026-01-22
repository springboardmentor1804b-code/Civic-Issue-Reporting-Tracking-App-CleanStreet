const express = require("express");

const mongoose = require("mongoose");

const auth = require("../middleware/auth.middleware");
const Complaint = require("../models/Complaint");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { status, priority, issueType, user_id } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (issueType) filter.issueType = issueType;
    if (user_id) filter.user_id = user_id;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ msg: err.message || "Failed to fetch complaints" });
  }
});

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

router.post("/", auth, async (req, res) => {
  try {
    const issueType = req.body?.issueType ?? req.body?.type;
    const location_coords = req.body?.location_coords ?? (req.body?.latitude != null && req.body?.longitude != null
      ? { lat: req.body.latitude, lng: req.body.longitude }
      : undefined);

    let priority = req.body?.priority;
    if (priority === "Urgent") priority = "High";

    const payload = {
      ...req.body,
      issueType,
      priority,
      location_coords,
      user_id: req.user.id
    };

    delete payload.type;
    delete payload.latitude;
    delete payload.longitude;

    const complaint = await Complaint.create(payload);
    res.status(201).json(complaint);
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to create complaint" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });
    if (String(complaint.user_id) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const updated = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to update complaint" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });
    if (String(complaint.user_id) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to delete complaint" });
  }
});

router.post("/:id/comments", auth, async (req, res) => {
  try {
    const content = req.body?.content ?? req.body?.comment;
    if (!content) return res.status(400).json({ msg: "Missing comment" });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    const comment = await Comment.create({
      userId: req.user.id,
      complaintId: req.params.id,
      content
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to add comment" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ complaintId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: err.message || "Failed to fetch comments" });
  }
});

router.post("/:id/like", auth, async (req, res) => {
  try {
    const existing = await Vote.findOne({ userId: req.user.id, complaintId: req.params.id });
    if (existing) return res.status(400).json({ msg: "Already voted" });

    await Vote.create({ userId: req.user.id, complaintId: req.params.id, voteType: "upvote" });
    res.json({ msg: "Vote recorded" });
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to vote" });
  }
});

router.post("/:id/dislike", auth, async (req, res) => {
  try {
    const existing = await Vote.findOne({ userId: req.user.id, complaintId: req.params.id });
    if (existing) return res.status(400).json({ msg: "Already voted" });

    await Vote.create({ userId: req.user.id, complaintId: req.params.id, voteType: "downvote" });
    res.json({ msg: "Vote recorded" });
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to vote" });
  }
});

module.exports = router;
