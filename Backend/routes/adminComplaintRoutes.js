const express = require("express");
const router = express.Router();
const {
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/adminComplaintController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/complaints", authMiddleware, getAllComplaints);
router.patch(
  "/complaints/:id/status",
  authMiddleware,
  updateComplaintStatus
);

module.exports = router;
