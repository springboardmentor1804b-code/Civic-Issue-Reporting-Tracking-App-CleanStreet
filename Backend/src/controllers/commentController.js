const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    console.log("COMMENT API HIT", req.body); // debug
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (err) {
    console.log("COMMENT ERROR", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      complaintId: req.params.id
    }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
