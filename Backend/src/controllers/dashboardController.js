const ActivityLog = require("../models/ActivityLog");

/*
  GET /api/dashboard/recent-activity
*/
exports.getRecentActivity = async (req, res) => {
  try {
    const user = req.user;

    let query = {};

    // Admin sees all activity
    if (user.role === "admin") {
      query = {};
    } 
    // Normal user sees only related activity
    else {
      query = {
        $or: [
          { relatedUser: user._id },
          { reportOwner: user._id },
        ],
      };
    }

    const activities = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("performedBy", "username role");

    res.status(200).json({ activities });
  } catch (err) {
    console.error("Recent activity error:", err);
    res.status(500).json({ message: "Failed to fetch recent activity" });
  }
};
