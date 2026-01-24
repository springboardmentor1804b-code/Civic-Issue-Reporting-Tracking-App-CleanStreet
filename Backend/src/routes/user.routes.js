
const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { profile, updateProfile, myComplaints, uploadProfileImage } = require("../controllers/user.controller");

router.get("/profile", auth, profile);
router.put("/profile", auth, updateProfile);
router.post("/profile/image", auth, upload.single("file"), uploadProfileImage);
router.get("/complaints", auth, myComplaints);

module.exports = router;
