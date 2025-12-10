const express = require("express");
const { getProfile, updateProfile, deleteProfile } = require("../controllers/profileController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.get("/", getProfile);
router.put("/update", updateProfile);
router.delete("/delete", deleteProfile);

module.exports = router;
