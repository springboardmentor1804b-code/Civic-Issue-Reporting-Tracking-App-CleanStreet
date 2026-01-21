const express = require("express");
const router = express.Router();
const { getRecentActivities } = require("../controllers/adminActivityController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/activities", authMiddleware, getRecentActivities);

module.exports = router;
