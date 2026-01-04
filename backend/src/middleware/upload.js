const multer = require("multer");
const path = require("path");

// Storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|avif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());

  if (ext) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

// Upload Config
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per image
  },
  fileFilter,
});

module.exports = upload;
