const Report = require("../models/Report");
const ActivityLog = require("../models/ActivityLog");

/* ================= CREATE REPORT ================= */
const createReport = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only users can report issues",
      });
    }

    req.body.userId = req.user.id;

    const imageUrls =
      req.files?.map(
        (file) => `http://localhost:5000/uploads/${file.filename}`
      ) || [];

    const report = await Report.create({
      ...req.body,
      images: imageUrls,
    });

    // 📝 Activity Log
    await ActivityLog.create({
      actionType: "CREATE_REPORT",
      description: `Created complaint (${report.title})`,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      reportId: report._id,
      relatedUser: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      report,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Report creation failed",
    });
  }
};

/* ================= GET ALL REPORTS ================= */
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate(
      "userId",
      "username avatar"
    );
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= APPROVE REPORT (ADMIN) ================= */
const approveReport = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json("Unauthorized");
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!report) {
      return res.status(404).json("Report not found");
    }

    // 📝 Activity Log
    await ActivityLog.create({
      actionType: "APPROVE_REPORT",
      description: `Approved complaint (${report.title})`,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      reportId: report._id,
    });

    res.json("Approved");
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
};

/* ================= REJECT REPORT (ADMIN) ================= */
const rejectReport = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json("Unauthorized");
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    if (!report) {
      return res.status(404).json("Report not found");
    }

    // 📝 Activity Log
    await ActivityLog.create({
      actionType: "REJECT_REPORT",
      description: `Rejected complaint (${report.title})`,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      reportId: report._id,
    });

    res.json("Rejected");
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
};

/* ================= LIKE / DISLIKE ================= */
const reactReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body;

    const report = await Report.findById(req.params.id).populate(
      "userId",
      "username avatar"
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (type === "like") {
      if (report.likedBy.includes(userId)) {
        return res.status(400).json({ message: "Already liked" });
      }

      report.likedBy.push(userId);
      report.likes += 1;

      if (report.dislikedBy.includes(userId)) {
        report.dislikedBy.pull(userId);
        report.dislikes -= 1;
      }
    }

    if (type === "dislike") {
      if (report.dislikedBy.includes(userId)) {
        return res.status(400).json({ message: "Already disliked" });
      }

      report.dislikedBy.push(userId);
      report.dislikes += 1;

      if (report.likedBy.includes(userId)) {
        report.likedBy.pull(userId);
        report.likes -= 1;
      }
    }

    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reaction failed" });
  }
};

/* ================= UPDATE STATUS (VOLUNTEER ONLY) ================= */
const updateStatus = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // 📝 Activity Log
    await ActivityLog.create({
      actionType: "STATUS_UPDATE",
      description: `Updated complaint (${report.title}) status to ${status}`,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      reportId: report._id,
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE REPORT ================= */
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (
      req.user.role !== "admin" &&
      report.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await report.deleteOne();

    // 📝 Activity Log
    await ActivityLog.create({
      actionType: "DELETE_REPORT",
      description: `Deleted complaint (${report.title})`,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      reportId: report._id,
    });

    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  createReport,
  getReports,
  approveReport,
  rejectReport,
  reactReport,
  updateStatus,
  deleteReport,
};
