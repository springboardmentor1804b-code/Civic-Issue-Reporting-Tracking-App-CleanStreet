const express = require("express");
const router = express.Router();
const { createComplaint } = require("../controllers/complaintController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/submit", auth, upload.single("photo"), createComplaint);

module.exports = router;