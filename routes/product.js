const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductsBySeller,
} = require("../controllers/productController");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", addProduct);

router.get("/all", getAllProducts);

router.get("/seller", auth, getProductsBySeller);

module.exports = router;
