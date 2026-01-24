const Report = require("../models/Report");
const ActivityLog = require("../models/ActivityLog");

/* ================= USER DASHBOARD ================= */
const getUserDashboard = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied" });
    }

    /* ===== GET USER REPORT IDS ===== */
    const userReports = await Report.find(
      { userId: req.user.id },
      "_id"
    );

    const reportIds = userReports.map((r) => r._id);

    /* ===== USER REPORT STATS ===== */
    const totalReports = reportIds.length;

    const pendingReports = await Report.countDocuments({
      userId: req.user.id,
      status: "Pending",
    });

    const approvedReports = await Report.countDocuments({
      userId: req.user.id,
      status: "Approved",
    });

    const completedReports = await Report.countDocuments({
      userId: req.user.id,
      status: "Completed",
    });

    /* ===== RECENT ACTIVITY (ADMIN + VOLUNTEER + USER) ===== */
    const recentActivity = await ActivityLog.find({
      reportId: { $in: reportIds },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("performedBy", "username role");

    res.json({
      success: true,
      user: {
        username: req.user.username,
      },
      stats: {
        totalReports,
        pendingReports,
        approvedReports,
        completedReports,
      },
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "User dashboard failed",
    });
  }
};

module.exports = {
  getUserDashboard,
};
