const express = require("express");

const auth = require("../middleware/auth.middleware");
const Complaint = require("../models/Complaint");
const User = require("../models/User");

const router = express.Router();

const requireAdmin = (req, res, next) => {
  const role = typeof req.user?.role === "string" ? req.user.role.toLowerCase() : "";
  if (role !== "admin") return res.status(403).json({ msg: "Admin only" });
  next();
};

// Admin dashboard payload (cards + table + map markers)
router.get("/admin-dashboard", auth, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      pendingCount,
      inProgressCount,
      resolvedCount,
      pendingLast7,
      inProgressLast7,
      resolvedLast7,
      activeCitizens,
      recentComplaints,
      markerComplaints
    ] = await Promise.all([
      Complaint.countDocuments({ status: "received" }),
      Complaint.countDocuments({ status: "in_review" }),
      Complaint.countDocuments({ status: "resolved" }),
      Complaint.countDocuments({ status: "received", createdAt: { $gte: last7Days } }),
      Complaint.countDocuments({ status: "in_review", createdAt: { $gte: last7Days } }),
      Complaint.countDocuments({ status: "resolved", createdAt: { $gte: last7Days } }),
      User.countDocuments({ role: { $ne: "admin" } }),
      Complaint.find({}).sort({ createdAt: -1 }).limit(5).populate("user_id", "firstName lastName name email").lean(),
      Complaint.find({ "location_coords.lat": { $ne: null }, "location_coords.lng": { $ne: null } })
        .select("title issueType status priority location_coords")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean()
    ]);

    const statusLabel = (status) => {
      if (status === "received") return "Pending";
      if (status === "in_review") return "In Progress";
      if (status === "resolved") return "Resolved";
      return status;
    };

    const priorityLabel = (p) => p || "Medium";

    const reportedIssues = recentComplaints.map((c, idx) => {
      const reporterName = c?.user_id?.firstName
        ? `${c.user_id.firstName || ""} ${c.user_id.lastName || ""}`.trim()
        : (c?.user_id?.name || c?.user_id?.email || "Citizen");

      return {
        id: c._id,
        srNo: `#${idx + 1}`,
        issueType: c.issueType,
        location: c.address,
        reporter: reporterName,
        date: c.createdAt,
        priority: priorityLabel(c.priority),
        status: statusLabel(c.status)
      };
    });

    const markers = markerComplaints.map((c) => ({
      id: c._id,
      lat: c.location_coords?.lat,
      lng: c.location_coords?.lng,
      status: statusLabel(c.status),
      priority: priorityLabel(c.priority),
      title: c.title,
      issueType: c.issueType
    }));

    res.json({
      header: {
        title: "CleanStreet Admin",
        subtitle: "Monitor and resolve civic issues in real-time"
      },
      cards: {
        pendingIssues: { value: pendingCount, changeLabel: `+${pendingLast7} this week` },
        inProgress: { value: inProgressCount, changeLabel: `${inProgressLast7} assigned (7d)` },
        resolved: { value: resolvedCount, changeLabel: `+${resolvedLast7} this week` },
        activeCitizens: { value: activeCitizens, changeLabel: null }
      },
      reportedIssues,
      mapView: {
        legend: [
          { status: "Pending", color: "red" },
          { status: "In Progress", color: "orange" },
          { status: "Resolved", color: "green" }
        ],
        markers
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message || "Failed to load admin dashboard" });
  }
});

router.get("/stats", async (req, res) => {
  const total = await Complaint.countDocuments();
  const received = await Complaint.countDocuments({ status: "received" });
  const in_review = await Complaint.countDocuments({ status: "in_review" });
  const resolved = await Complaint.countDocuments({ status: "resolved" });

  res.json({
    total,
    received,
    in_review,
    resolved
  });
});

router.get("/complaints-over-time", async (req, res) => {
  const results = await Complaint.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1
      }
    }
  ]);

  const data = results.map(r => ({
    date: `${r._id.year}-${String(r._id.month).padStart(2, "0")}-${String(r._id.day).padStart(2, "0")}`,
    count: r.count
  }));

  res.json(data);
});

module.exports = router;
