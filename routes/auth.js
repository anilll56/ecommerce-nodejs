const express = require("express");
const {
  register,
  loginUser,
  userInfo,
  updateUser,
} = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.get("/user", auth, userInfo);
router.get("/update", auth, updateUser);

module.exports = router;
