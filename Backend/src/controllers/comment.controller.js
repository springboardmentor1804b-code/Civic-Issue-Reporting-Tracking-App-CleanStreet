const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const content = req.body?.content ?? req.body?.comment ?? req.body?.text;
    if (!content) return res.status(400).json({ msg: "Missing comment" });

    const comment = new Comment({
      userId: req.user.id,
      complaintId: req.params.id,
      content
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to add comment" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ complaintId: req.params.id })
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName name email");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: err.message || "Failed to fetch comments" });
  }
};
