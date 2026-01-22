
const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { profile, updateProfile, myComplaints } = require("../controllers/user.controller");

router.get("/profile", auth, profile);
router.put("/profile", auth, updateProfile);
router.get("/complaints", auth, myComplaints);

module.exports = router;
