const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  createReport,
  getReports,
  approveReport,
  rejectReport,
  reactReport,
  updateStatus,
  deleteReport
} = require("../controllers/reportController");

router.post("/create", auth, upload.array("images", 10), createReport);

router.get("/", auth, getReports);

router.put("/approve/:id", auth, approveReport);
router.put("/reject/:id", auth, rejectReport);

router.put("/react/:id", auth, reactReport);

router.put("/update-status/:id", auth, updateStatus);

// ⭐ ADD THIS
router.delete("/:id", auth, deleteReport);

module.exports = router;
