
const Issue = require("../models/issueModel");
const AdminActivity = require("../models/adminActivityModel");

// GET all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const complaints = await Issue.find()
      .populate("reportedBy", "name")
      .populate("assignedTo", "name")
      .select("description address category status assignedTo reportedBy createdAt")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

//  UPDATE complaint status (Resolve / In Progress / Pending)
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

    // LOG ADMIN ACTIVITY (IMPORTANT PART)
    await AdminActivity.create({
      admin: req.user.userId,
      action: `Changed complaint status to ${status}`,
      targetType: "Complaint",
      targetId: complaint._id,
      details: complaint.description,
    });

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

