const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductsBySeller,
  getProductById,
} = require("../controllers/productController");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", addProduct);

router.get("/all", getAllProducts);

router.get("/seller", getProductsBySeller);

router.get("/:id", getProductById);

module.exports = router;
