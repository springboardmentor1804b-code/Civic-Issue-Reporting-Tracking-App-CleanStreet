const AdminActivity = require("../models/adminActivityModel");

// GET recent admin activities
exports.getRecentActivities = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const activities = await AdminActivity.find()
      .populate("admin", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
