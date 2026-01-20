const User = require("../models/userModel");

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    //  Only Admin allowed
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE user role
exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { role } = req.body;

    if (!["User", "Volunteer"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


