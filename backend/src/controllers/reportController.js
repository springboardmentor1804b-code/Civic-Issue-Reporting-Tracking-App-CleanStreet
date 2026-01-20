const Report = require("../models/Report");
const User = require("../models/User");
const { reverseGeocode } = require("../utils/geocode");

/* ================= CREATE REPORT (CITIZEN ONLY) ================= */
const createReport = async (req, res) => {
  try {
    if (req.user.role !== "citizen") {
      return res.status(403).json({
        success: false,
        message: "Only citizens can report issues",
      });
    }

    const imageUrls =
      req.files?.map(
        (file) => `http://localhost:5000/uploads/${file.filename}`
      ) || [];

    // Read latitude and longitude from req.body
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    // Use reverse geocoding to derive city and state from coordinates
    const { city, state } = await reverseGeocode(latitude, longitude);

    const report = await Report.create({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      locationGeo: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      city: city,
      state: state,
      securityLevel: req.body.securityLevel,
      images: imageUrls,
      status: "pending",
      acceptedBy: null,
    });

    res.json({
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
    const reports = await Report.find()
      .populate("userId", "username avatar")
      .populate("acceptedBy", "fullName");

    // Format response for frontend-friendly structure
    const formattedReports = reports.map(report => ({
      _id: report._id,
      title: report.title,
      description: report.description,
      category: report.category,
      location: report.location,
      state: report.state,
      status: report.status,
      securityLevel: report.securityLevel,
      images: report.images,
      likes: report.likes,
      dislikes: report.dislikes,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      // Citizen details (who reported)
      citizen: {
        username: report.userId?.username,
        avatar: report.userId?.avatar,
      },
      // Volunteer details (if assigned)
      volunteer: report.acceptedBy ? {
        name: report.acceptedBy.fullName,
      } : null,
    }));

    res.json(formattedReports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET MY REPORTS (CITIZEN) ================= */
const getMyReports = async (req, res) => {
  try {
    if (req.user.role !== "citizen") {
      return res.status(403).json({ message: "Access denied" });
    }

    const reports = await Report.find({ userId: req.user.id })
      .populate("acceptedBy", "username email avatar");

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET MY COMPLAINTS (CITIZEN) ================= */
const getMyComplaints = async (req, res) => {
  try {
    console.log("getMyComplaints called for user:", req.user.id);
    const reports = await Report.find({ userId: req.user.id })
      .populate("acceptedBy", "username email");
    console.log("Found reports:", reports.length);
    res.json(reports);
  } catch (err) {
    console.log("Error in getMyComplaints:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET MY ASSIGNED COMPLAINTS (VOLUNTEER) ================= */
const getMyAssignedComplaints = async (req, res) => {
  try {
    console.log("getMyAssignedComplaints called for user:", req.user.id);
    const complaints = await Report.find({
      acceptedBy: req.user.id,
    }).populate("userId", "username avatar");
    console.log("Found assigned complaints:", complaints.length);
    res.json(complaints);
  } catch (err) {
    console.log("Error in getMyAssignedComplaints:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE STATUS (VOLUNTEER) ================= */
const updateStatus = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    if (!["in_progress", "resolved"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed statuses: in_progress, resolved",
      });
    }

    const report = await Report.findOne({
      _id: req.params.id,
      acceptedBy: req.user.id,
    });

    if (!report) {
      return res.status(403).json({
        message: "You are not assigned to this report",
      });
    }

    report.status = status;
    await report.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      report,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET NEARBY COMPLAINTS (VOLUNTEER) ================= */
const getNearbyComplaints = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const volunteer = await User.findById(req.user.id);

    if (!volunteer.state) {
      return res.status(400).json({
        message: "Volunteer state not set. Please update your profile with location.",
      });
    }

    // Find complaints where state matches volunteer's state and status is pending, accepted, in_progress, or resolved
    const complaints = await Report.find({
      state: volunteer.state,
      status: { $in: ["pending", "accepted", "in_progress", "resolved"] },
    }).populate("userId", "username avatar");

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



/* ================= ACCEPT COMPLAINT (VOLUNTEER) ================= */
const acceptComplaint = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ ATOMIC ASSIGNMENT - PREVENTS RACE CONDITIONS
    const report = await Report.findOneAndUpdate(
      {
        _id: req.params.id,
        acceptedBy: null,
        status: "pending",
      },
      {
        acceptedBy: req.user.id,
        status: "accepted",
      },
      { new: true }
    ).populate("userId", "username avatar");

    if (!report) {
      return res.status(400).json({
        message: "This complaint is already assigned to another volunteer",
      });
    }

    res.json({
      success: true,
      message: "Complaint accepted successfully",
      report,
    });
  } catch (err) {
    console.error("ACCEPT COMPLAINT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REJECT COMPLAINT (VOLUNTEER) ================= */
const rejectComplaint = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ ATOMIC REJECTION - PREVENTS RACE CONDITIONS
    const report = await Report.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "pending",
        acceptedBy: null,
      },
      {
        status: "rejected",
      },
      { new: true }
    ).populate("userId", "username avatar");

    if (!report) {
      return res.status(400).json({
        message: "Complaint not found or already processed",
      });
    }

    res.json({
      success: true,
      message: "Complaint rejected successfully",
      report,
    });
  } catch (err) {
    console.error("REJECT COMPLAINT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= APPROVE REPORT (ADMIN) ================= */
const approveReport = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "Approved";
    await report.save();
 
    res.json({ message: "Report approved successfully", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REJECT REPORT (ADMIN) ================= */
const rejectReport = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "Rejected";
    await report.save();

    res.json({ message: "Report rejected successfully", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REACT TO REPORT (LIKE/DISLIKE) ================= */
const reactReport = async (req, res) => {
  try {
    const { reaction } = req.body; // "like" or "dislike"
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const userId = req.user.id;

    // Remove existing reactions
    report.likedBy = report.likedBy.filter(id => id.toString() !== userId);
    report.dislikedBy = report.dislikedBy.filter(id => id.toString() !== userId);

    if (reaction === "like") {
      report.likedBy.push(userId);
    } else if (reaction === "dislike") {
      report.dislikedBy.push(userId);
    }

    report.likes = report.likedBy.length;
    report.dislikes = report.dislikedBy.length;

    await report.save();

    res.json({ message: "Reaction updated", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  createReport,
  getReports,
  getMyReports,
  approveReport,
  rejectReport,
  reactReport,
  updateStatus,
  deleteReport,
  getNearbyComplaints,
  getMyComplaints,
  acceptComplaint,
  rejectComplaint,
  getMyAssignedComplaints,
};
