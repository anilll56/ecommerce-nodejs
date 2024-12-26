const express = require("express");
const {
  register,
  loginUser,
  userInfo,
  updateUser,
  getSellers,
  changePassword,
} = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.get("/user", auth, userInfo);
router.get("/update", auth, updateUser);
router.get("/sellers", getSellers);
router.post("/change-password", auth, changePassword);

module.exports = router;
