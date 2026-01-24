const express = require("express");
const router = express.Router();
const { addComment, getComments } = require("../controllers/comment.controller");
const auth = require("../middleware/auth.middleware");

router.post("/:id", auth, addComment);
router.get("/:id", getComments);

module.exports = router;
