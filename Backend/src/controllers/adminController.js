const User = require("../models/User");
const Report = require("../models/Report");
const ActivityLog = require("../models/ActivityLog");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

/* ======================================================
   SHARED DATA SOURCE (PDF + EXCEL + FUTURE USE)
====================================================== */
const fetchAdminDashboardData = async () => {
  const totalUsers = await User.countDocuments();
  const totalReports = await Report.countDocuments();
  const pending = await Report.countDocuments({ status: "Pending" });
  const resolved = await Report.countDocuments({ status: "Completed" });

  const reportsByCategory = await Report.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $project: { _id: 0, category: "$_id", count: 1 } },
  ]);

  return {
    totalUsers,
    totalReports,
    pending,
    resolved,
    reportsByCategory,
    generatedAt: new Date(),
  };
};

/* ======================================================
   ADMIN DASHBOARD STATS (API)
====================================================== */
const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ===== COUNTS =====
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const pending = await Report.countDocuments({ status: "Pending" });
    const resolved = await Report.countDocuments({ status: "Completed" });
    const rejected = await Report.countDocuments({ status: "Rejected" });

    // ===== USER ROLES =====
    const userRoles = await User.aggregate([
      { $group: { _id: "$role", value: { $sum: 1 } } },
      { $project: { _id: 0, label: "$_id", value: 1 } },
    ]);

    // ===== COMPLAINT TYPES =====
    const complaintTypes = await Report.aggregate([
      { $group: { _id: "$category", value: { $sum: 1 } } },
      { $project: { _id: 0, label: "$_id", value: 1 } },
    ]);

    // ===== LAST 7 DAYS COMPLAINTS =====
    const last7Days = await Report.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          label: { $toString: "$_id" },
          value: 1,
        },
      },
    ]);

    // ===== LAST 30 DAYS USER REGISTRATION =====
    const last30DaysUsers = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          label: { $toString: "$_id" },
          value: 1,
        },
      },
    ]);

    // ===== MONTHLY COMPLAINT TRENDS =====
    const monthlyComplaints = await Report.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().setMonth(new Date().getMonth() - 6)
            ),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          label: { $toString: "$_id.month" },
          value: 1,
        },
      },
    ]);

    res.json({
      success: true,

      cards: {
        totalUsers,
        totalReports,
        pending,
        resolved,
        rejected
      },

      charts: {
        complaintStatus: [
          { label: "Pending", value: pending },
          { label: "Resolved", value: resolved },
           { label: "Rejected", value: rejected }
        ],
        complaintTypes,
        userRoles,
        complaintsLast7Days: last7Days,
        usersLast30Days: last30DaysUsers,
        monthlyComplaints,
        top5ComplaintTypes: complaintTypes.slice(0, 5),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard analytics failed" });
  }
};


/* ======================================================
   USERS
====================================================== */
const getAllUsers = async (req, res) => {
  res.json(await User.find().select("-password"));
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
await ActivityLog.create({
  actionType: "DELETE_USER",
  description: `Admin deleted user ${user?.username}`,
  performedBy: req.user._id,
  performedByRole: "admin",
  relatedUser: user?._id,
});


  res.json({ success: true });
};

const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  const newRole = req.body.role;

  user.role = newRole;
  await user.save();

  await ActivityLog.create({
    actionType: "ROLE_CHANGE",
    description: `Admin changed role of ${user.username} to ${newRole}`,
    performedBy: req.user._id,
    performedByRole: "admin",
    relatedUser: user._id, // ✅ REQUIRED
  });

  res.json({ success: true });
};

/* ======================================================
   REPORTS
====================================================== */
const getAllReports = async (req, res) => {
  const reports = await Report.find()
    .populate("userId", "username")
    .populate("assignedTo", "username")
    .sort({ createdAt: -1 });

  res.json(reports);
};

const updateReportStatus = async (req, res) => {
  const report = await Report.findById(req.params.id);

  report.status = req.body.status;
  await report.save();

  await ActivityLog.create({
    actionType: "STATUS_UPDATE",
    description: `Admin updated complaint "${report.title}" to ${report.status}`,
    performedBy: req.user._id,
    performedByRole: "admin",
    relatedUser: report.userId, // ✅ THIS IS THE KEY
  });

  res.json({ success: true });
};

/* ======================================================
   VOLUNTEERS
====================================================== */
const getVolunteersByLocation = async (req, res) => {
  res.json(
    await User.find({ role: "volunteer", location: req.query.location })
  );
};

const assignVolunteer = async (req, res) => {
  const report = await Report.findById(req.params.id);
  report.assignedTo = req.body.volunteerId;
  report.status = "In Progress";
  await report.save();

await ActivityLog.create({
  actionType: "ASSIGN_VOLUNTEER",
  description: `Admin assigned volunteer to complaint "${report.title}"`,
  performedBy: req.user._id,
  performedByRole: "admin",
  relatedUser: report.userId, // ✅ REQUIRED
});

  res.json({ success: true });
};

/* ======================================================
   ACTIVITY
====================================================== */
const getAdminActivity = async (req, res) => {
  res.json(
    await ActivityLog.find({ performedByRole: "admin" })
      .populate("performedBy", "username")
      .sort({ createdAt: -1 })
  );
};

/* ======================================================
   PDF EXPORT
====================================================== */
const exportAdminPDF = async (req, res) => {
  try {
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    /* ================= HEADERS ================= */
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=admin-dashboard-report.pdf"
    );

    doc.pipe(res);

    /* ================= TITLE BAR ================= */
    doc.rect(0, 0, doc.page.width, 70).fill("#3b2f2f");
    doc
      .fillColor("#ffffff")
      .fontSize(22)
      .text("Admin Dashboard Report", 40, 25);

    doc.moveDown(2);

    /* ================= DATA FETCH ================= */
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const pending = await Report.countDocuments({ status: "Pending" });
    const resolved = await Report.countDocuments({ status: "Completed" });
    const rejected = await Report.countDocuments({ status: "Rejected" });

    const complaintsByCategory = await Report.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const monthlyComplaints = await Report.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().setMonth(new Date().getMonth() - 6)
            )
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    /* ================= SECTION HEADER ================= */
    const sectionHeader = (title) => {
      doc
        .moveDown(0.8)
        .rect(40, doc.y, doc.page.width - 80, 24)
        .fill("#f6ede3");

      doc
        .fillColor("#3b2f2f")
        .fontSize(14)
        .text(title, 50, doc.y + 6);

      doc.moveDown(1);
      doc.fillColor("#000").fontSize(11);
    };

    /* ================= DASHBOARD SUMMARY ================= */
    sectionHeader("Dashboard Summary");

    doc.text(`Total Users: ${totalUsers}`);
    doc.text(`Total Reports: ${totalReports}`);
    doc.text(`Pending Complaints: ${pending}`);
    doc.text(`Resolved Complaints: ${resolved}`);
    doc.text(`Rejected Complaints: ${rejected}`);

    /* ================= STATUS DISTRIBUTION ================= */
    sectionHeader("Complaint Status Distribution");

    doc.text(`Pending: ${pending}`);
    doc.text(`Resolved: ${resolved}`);
    doc.text(`Rejected: ${rejected}`);

    /* ================= CATEGORY ================= */
    sectionHeader("Complaints by Category");

    complaintsByCategory.forEach((item) => {
      doc.text(`• ${item._id}: ${item.count}`);
    });

    /* ================= MONTHLY TREND ================= */
    sectionHeader("Monthly Complaint Trends (Last 6 Months)");

    monthlyComplaints.forEach((item) => {
      doc.text(`• ${item._id.month}/${item._id.year}: ${item.count}`);
    });

    /* ================= TOP 5 ================= */
    sectionHeader("Top Complaint Types");

    complaintsByCategory
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .forEach((item) => {
        doc.text(`• ${item._id}: ${item.count}`);
      });

    /* ================= FOOTER ================= */
    doc.moveDown(1.5);
    doc
      .fontSize(9)
      .fillColor("#555")
      .text(`Generated on: ${new Date().toLocaleString()}`, {
        align: "right",
      });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "PDF generation failed" });
  }
};

/* ======================================================
   EXCEL EXPORT
====================================================== */
const exportAdminExcel = async (req, res) => {
  try {
    const data = await fetchAdminDashboardData();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Admin Dashboard");

    sheet.addRow(["Admin Dashboard Report"]);
    sheet.addRow([]);

    sheet.addRow(["Total Users", data.totalUsers]);
    sheet.addRow(["Total Reports", data.totalReports]);
    sheet.addRow(["Pending Complaints", data.pending]);
    sheet.addRow(["Resolved Complaints", data.resolved]);

    sheet.addRow([]);
    sheet.addRow(["Category", "Count"]);

    data.reportsByCategory.forEach((c) => {
      sheet.addRow([c.category, c.count]);
    });

    sheet.addRow([]);
    sheet.addRow(["Generated At", data.generatedAt.toLocaleString()]);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=admin-dashboard-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Excel export failed" });
  }
};

/* ======================================================
   FINAL EXPORT
====================================================== */
module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllReports,
  updateReportStatus,
  getVolunteersByLocation,
  assignVolunteer,
  getAdminActivity,
  exportAdminPDF,
  exportAdminExcel,
};
