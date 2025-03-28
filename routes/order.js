const express = require("express");
const { createOrder, getOrderById, getCustomerOrders, getOrdersBySeller, updateOrderStatus, createOrdersFromBasket } = require("../controllers/orderController");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

//router.post("/create", auth, createOrder);
router.post("/create", auth, createOrdersFromBasket);
router.get("/customer", auth, getCustomerOrders);
router.get("/seller", auth, getOrdersBySeller);
router.put("/update/:id", auth, updateOrderStatus);

// router.get("/:id", auth, getOrderById);

module.exports = router;
