const express = require("express");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoritesController");

const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, getFavorites);
router.post("/add", auth, addFavorite);
router.delete("/remove/:productId", auth, removeFavorite);

module.exports = router;
