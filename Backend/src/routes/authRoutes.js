const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware"); 
const bcrypt = require("bcryptjs");
const User = require("../models/User");

console.log("Auth Routes Loaded");

router.post("/register", register);
router.post("/login", login);

router.post("/profile/avatar", upload.single("avatar"), async (req, res) => {
  console.log("Avatar upload API HIT");

  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    if (!req.body.userId)
      return res.status(400).json({ message: "User ID missing" });

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { avatar: imageUrl },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      avatar: user.avatar,
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
  }
});


/* ================= CHANGE PASSWORD ================= */
router.post("/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.json({
        success: false,
        message: "Old password is incorrect",
      });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.put("/profile/update", async (req, res) => {
  try {
    const { userId, fullName, phone, location, bio, username, email } = req.body;

    if (!userId)
      return res.status(400).json({ message: "User ID missing" });

    const updateData = {
      ...(username && { username }),
      ...(email && { email }),
      ...(fullName && { fullName }),
      ...(phone && { phone }),
      ...(location && { location }),
      ...(bio && { bio })
    };

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      message: "Profile Updated Successfully",
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Profile Update Failed" });
  }
});


router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
