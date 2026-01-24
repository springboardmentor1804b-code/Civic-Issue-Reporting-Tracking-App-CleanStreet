const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  getAllReports,
  deleteUser,
  exportAdminPDF,
  exportAdminExcel,
  updateUserRole,
  getVolunteersByLocation,
  assignVolunteer,
  updateReportStatus,
  getAdminActivity,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/* ================= DASHBOARD ================= */
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  getDashboardStats
);

/* ================= USERS ================= */
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

router.patch(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware("admin"),
  updateUserRole
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteUser
);

/* ================= REPORTS ================= */
router.get(
  "/reports",
  authMiddleware,
  roleMiddleware("admin"),
  getAllReports
);

router.patch(
  "/reports/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  updateReportStatus
);

router.patch(
  "/reports/:id/assign",
  authMiddleware,
  roleMiddleware("admin"),
  assignVolunteer
);

/* ================= VOLUNTEERS ================= */
router.get(
  "/volunteers",
  authMiddleware,
  roleMiddleware("admin"),
  getVolunteersByLocation
);

/* ================= ACTIVITY ================= */
router.get(
  "/activity",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminActivity
);

/* ================= EXPORTS ================= */
router.get(
  "/export/pdf",
  authMiddleware,
  roleMiddleware("admin"),
  exportAdminPDF
);

router.get(
  "/export/excel",
  authMiddleware,
  roleMiddleware("admin"),
  exportAdminExcel
);

module.exports = router;
