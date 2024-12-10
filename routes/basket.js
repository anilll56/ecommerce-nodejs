const express = require("express");
const {
  getBasketItems,
  addItemToBasket,
  removeItemFromBasket,
  updateBasketItem,
} = require("../controllers/basketController");

const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, getBasketItems);
router.post("/add", auth, addItemToBasket);
router.delete("/remove/:productId", auth, removeItemFromBasket);
router.put("/update", auth, updateBasketItem);

module.exports = router;
