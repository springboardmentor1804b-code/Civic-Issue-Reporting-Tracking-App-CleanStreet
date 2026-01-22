
const Issue = require("../models/issueModel");
const AdminActivity = require("../models/adminActivityModel");
const PDFDocument = require("pdfkit");
const { Document, Packer, Paragraph } = require("docx");

/**
 * GET all complaints (Admin only, Filter aware)
 * Filters: status, issueType
 */
exports.getAllComplaints = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { status, issueType } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (issueType) filter.issueType = issueType;

    const complaints = await Issue.find(filter)
      .populate("reportedBy", "name")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error("Get complaints error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * UPDATE complaint status (Admin only)
 */
exports.updateComplaintStatus = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { status } = req.body;
    const complaint = await Issue.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();

    // Log admin activity
    await AdminActivity.create({
      admin: req.user.userId,
      action: `Changed complaint status to ${status}`,
      targetType: "Complaint",
      targetId: complaint._id,
      details: complaint.description,
    });

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * EXPORT complaints (PDF / Word) – Filter aware
 */
exports.exportComplaints = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { format, status, issueType } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (issueType) filter.issueType = issueType;

    const complaints = await Issue.find(filter)
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    // -------- PDF EXPORT --------
    if (format === "pdf") {
      const doc = new PDFDocument({ margin: 40 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=complaints.pdf"
      );

      doc.pipe(res);

      doc.fontSize(18).text("Civic Complaints Report", { align: "center" });
      doc.moveDown();

      complaints.forEach((c, i) => {
        doc
          .fontSize(12)
          .text(`${i + 1}. ${c.issueTitle || "No Title"}`)
          .text(`Type: ${c.issueType}`)
          .text(`Status: ${c.status}`)
          .text(`Address: ${c.address || "Not specified"}`)
          .text(`Reported By: ${c.reportedBy?.name || "-"}`)
          .text(`Assigned To: ${c.assignedTo?.name || "Unassigned"}`)
          .moveDown();
      });

      doc.end();
      return;
    }

    // -------- WORD EXPORT --------
    if (format === "word") {
      const doc = new Document({
        sections: [
          {
            children: complaints.map(
              (c, i) =>
                new Paragraph(
                  `${i + 1}. ${c.issueTitle || "No Title"} | ${c.issueType} | ${c.status} | ${c.address || "Not specified"}`
                )
            ),
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=complaints.docx"
      );
      res.send(buffer);
      return;
    }

    res.status(400).json({ error: "Invalid export format" });
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Export failed" });
  }
};
