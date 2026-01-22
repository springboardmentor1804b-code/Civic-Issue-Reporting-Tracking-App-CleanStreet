
const User = require("../models/User");
const Complaint = require("../models/Complaint");

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json(user);
};

exports.myComplaints = async (req, res) => {
  const complaints = await Complaint.find({ user_id: req.user.id });
  res.json(complaints);
};
