const express = require("express");
const router = express.Router();
const {
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/adminComplaintController");
const authMiddleware = require("../middleware/authMiddleware");
const { exportComplaints } = require("../controllers/adminComplaintController");


router.get("/complaints", authMiddleware, getAllComplaints);
router.get("/complaints/export", authMiddleware, exportComplaints);

router.patch(
  "/complaints/:id/status",
  authMiddleware,
  updateComplaintStatus
);

module.exports = router;
