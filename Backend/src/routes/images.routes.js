const express = require("express");
const upload = require("../middleware/upload.middleware");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/upload", auth, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    res.json({
      message: "Image uploaded successfully",
      url: `/uploads/images/${req.file.filename}`,
      filename: req.file.filename,
      fileSize: req.file.size,
      fileType: req.file.mimetype
    });
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to upload image" });
  }
});

router.post("/upload-multiple", auth, upload.array("files", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "No files uploaded" });
    }
    
    const files = req.files.map(file => ({
      url: `/uploads/images/${file.filename}`,
      filename: file.filename,
      fileSize: file.size,
      fileType: file.mimetype
    }));
    
    const urls = files.map(f => f.url);
    
    res.json({
      message: "Images uploaded successfully",
      urls,
      count: files.length,
      files
    });
  } catch (err) {
    res.status(400).json({ msg: err.message || "Failed to upload images" });
  }
});

module.exports = router;
