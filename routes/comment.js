const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByProduct,
} = require("../controllers/commentController");
const { auth } = require("../middleware/authMiddleware");

router.post("/create", auth, createComment);
router.get("/:productId", getCommentsByProduct);

module.exports = router;
