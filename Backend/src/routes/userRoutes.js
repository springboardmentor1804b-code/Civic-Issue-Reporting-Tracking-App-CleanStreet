const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserDashboard } = require("../controllers/userController");

router.get("/dashboard", authMiddleware, getUserDashboard);

module.exports = router;
