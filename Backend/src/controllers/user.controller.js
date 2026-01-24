
const User = require("../models/User");
const Complaint = require("../models/Complaint");

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password");
  res.json({ message: "Profile updated", user });
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const imageUrl = `/uploads/profile/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { profileImage: imageUrl }, 
      { new: true }
    ).select("-password");
    
    res.json({ 
      message: "Profile image uploaded", 
      imageUrl,
      user 
    });
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to upload image" });
  }
};

exports.myComplaints = async (req, res) => {
  const complaints = await Complaint.find({ user_id: req.user.id });
  res.json({ data: complaints });
};
