const express = require("express");
const router = express.Router();
const { voteComplaint } = require("../controllers/vote.controller");
const auth = require("../middleware/auth.middleware");

router.post("/:id", auth, voteComplaint);
module.exports = router;
