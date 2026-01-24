const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/signup", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.json({ msg: "Logged out" });
});

module.exports = router;
