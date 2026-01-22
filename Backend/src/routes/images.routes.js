const express = require("express");

const router = express.Router();

router.post("/upload", (req, res) => {
  res.status(501).json({
    msg: "Image upload not implemented on backend (missing multer/storage integration)"
  });
});

router.post("/upload-multiple", (req, res) => {
  res.status(501).json({
    msg: "Multiple image upload not implemented on backend (missing multer/storage integration)"
  });
});

module.exports = router;
