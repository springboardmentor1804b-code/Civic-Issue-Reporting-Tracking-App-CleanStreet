const router = require("express").Router();
const { addComment, getComments } = require("../controllers/commentController");

router.post("/", addComment);
router.get("/:id", getComments);

module.exports = router;
