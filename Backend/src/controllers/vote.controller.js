const Vote = require("../models/Vote");

exports.voteComplaint = async (req, res) => {
  const { voteType } = req.body;
  const existingVote = await Vote.findOne({
    userId: req.user.id,
    complaintId: req.params.id
  });

  if (existingVote) return res.status(400).json({ msg: "Already voted" });

  const vote = new Vote({
    userId: req.user.id,
    complaintId: req.params.id,
    voteType
  });
  await vote.save();
  res.json({ msg: "Vote recorded" });
};
