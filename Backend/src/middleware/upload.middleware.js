const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Create multiple upload directories
const complaintsDir = path.join(process.cwd(), "uploads", "complaints");
const profileDir = path.join(process.cwd(), "uploads", "profile");
const imagesDir = path.join(process.cwd(), "uploads", "images");

fs.mkdirSync(complaintsDir, { recursive: true });
fs.mkdirSync(profileDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on the route/context
    const uploadPath = req.baseUrl.includes("/profile") 
      ? profileDir 
      : req.baseUrl.includes("/images")
      ? imagesDir
      : complaintsDir;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

module.exports = multer({ storage });
