const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
  voteType: { type: String, enum: ["upvote", "downvote"] }
});

module.exports = mongoose.model("Vote", VoteSchema);
