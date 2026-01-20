const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
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
} = require("../controllers/reportController");

/* =========================
   CITIZEN ROUTES
========================= */

// Create a new report (Citizen)
router.post(
  "/create",
  auth,
  upload.array("images", 10),
  createReport
);

// Get all reports (Admin / Citizen)
router.get("/", auth, getReports);

// Get my complaints (Citizen)
router.get("/my-reports", auth, getMyComplaints);

/* =========================
   ADMIN ROUTES
========================= */

// Approve a report
router.put("/approve/:id", auth, approveReport);

// Reject a report
router.put("/reject/:id", auth, rejectReport);

/* =========================
   COMMON ROUTES
========================= */

// Like / Dislike a report
router.put("/react/:id", auth, reactReport);

// Update status (Assigned → In Progress → Completed)
router.put("/:id/status", auth, updateStatus);

// Delete a report
router.delete("/:id", auth, deleteReport);

/* =========================
   VOLUNTEER ROUTES
========================= */

// Get nearby complaints (GPS based)
router.get("/volunteer/nearby", auth, getNearbyComplaints);

// Accept a complaint (lock assignment)
router.post("/volunteer/accept/:id", auth, acceptComplaint);

// Reject a complaint (mark as rejected)
router.post("/volunteer/reject/:id", auth, rejectComplaint);

// Update status (Assigned → In Progress → Completed)
router.put("/update-status/:id", auth, updateStatus);

// Get my assigned complaints (Volunteer)
router.get("/my-assigned", auth, getMyAssignedComplaints);

module.exports = router;
