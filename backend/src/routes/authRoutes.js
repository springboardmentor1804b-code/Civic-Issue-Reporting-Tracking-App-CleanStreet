const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);

/* ================= AVATAR UPLOAD ================= */
router.post("/profile/avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { avatar: imageUrl },
      { new: true }
    );

    res.json({ success: true, avatar: user.avatar, user });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

/* ================= CHANGE PASSWORD ================= */
router.post("/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Old password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/profile/update", async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

/* ================= UPDATE LOCATION (VOLUNTEER) ================= */
const { updateVolunteerLocation } = require("../controllers/authController");
router.put("/update-location", auth, updateVolunteerLocation);

/* ================= CURRENT USER ================= */
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ success: true, user });
});

module.exports = router;
