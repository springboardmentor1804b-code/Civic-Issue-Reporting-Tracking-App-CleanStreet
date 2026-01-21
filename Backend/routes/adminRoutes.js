const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin-only routes
router.get("/users", authMiddleware, getAllUsers);
router.patch("/users/:id/role", authMiddleware, updateUserRole);

module.exports = router;
