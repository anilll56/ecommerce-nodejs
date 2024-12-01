const express = require("express");
const {
  createOrder,
  getOrderById,
  getCustomerOrders,
} = require("../controllers/orderController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", auth, createOrder);
router.get("/:id", auth, getOrderById);
router.post("/customer", auth, getCustomerOrders);

module.exports = router;
