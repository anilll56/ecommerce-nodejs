const express = require("express");
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    res.send("Get all products");
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    res.send(`Get product with ID: ${productId}`);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    res.send("Create a new product");
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;
  try {
    res.send(`Update product with ID: ${productId}`);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    res.send(`Delete product with ID: ${productId}`);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
