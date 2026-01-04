const Report = require("../models/Report");

/* ================= CREATE REPORT ================= */
const createReport = async (req, res) => {
  try {
    req.body.userId = req.user.id;
         if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only users can report issues"
      });
    }

    const imageUrls =
      req.files?.map(file =>
        `http://localhost:5000/uploads/${file.filename}`
      ) || [];

    const report = await Report.create({
      ...req.body,
      images: imageUrls
    });

    res.json({
      success: true,
      message: "Report created successfully",
      report
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Report creation failed"
    });
  }
};


/* ================= GET ALL REPORTS ================= */
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("userId", "username avatar");

    res.json(reports);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ================= APPROVE REPORT (ADMIN) ================= */
const approveReport = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json("Unauthorized");

  await Report.findByIdAndUpdate(req.params.id, { status: "Approved" });
  res.json("Approved");
};


/* ================= REJECT REPORT (ADMIN) ================= */
const rejectReport = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json("Unauthorized");

  await Report.findByIdAndUpdate(req.params.id, { status: "Rejected" });
  res.json("Rejected");
};


/* ================= LIKE / DISLIKE ================= */
const reactReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body;

    const report = await Report.findById(req.params.id)
      .populate("userId", "username avatar");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // 👍 LIKE
    if (type === "like") {
      if (report.likedBy.includes(userId)) {
        return res.status(400).json({ message: "Already liked" });
      }

      report.likedBy.push(userId);
      report.likes += 1;

      // remove dislike if exists
      if (report.dislikedBy.includes(userId)) {
        report.dislikedBy.pull(userId);
        report.dislikes -= 1;
      }
    }

    // 👎 DISLIKE
    if (type === "dislike") {
      if (report.dislikedBy.includes(userId)) {
        return res.status(400).json({ message: "Already disliked" });
      }

      report.dislikedBy.push(userId);
      report.dislikes += 1;

      // remove like if exists
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

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);

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

    // admin OR owner only
    if (
      req.user.role !== "admin" &&
      report.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await report.deleteOne();
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
  deleteReport
};
