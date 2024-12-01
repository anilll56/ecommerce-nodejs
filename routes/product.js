const express = require("express");
const {
  addProduct,
  getAllProducts,
} = require("../controllers/productController");
const router = express.Router();

router.post("/add", addProduct);

router.get("/all", getAllProducts);

module.exports = router;
