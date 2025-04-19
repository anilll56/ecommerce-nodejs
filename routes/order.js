const express = require('express');
const {
  getCustomerOrders,
  getOrdersBySeller,
  updateOrderStatus,
  createOrdersFromBasket,
} = require('../controllers/orderController');
const { auth } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', auth, createOrdersFromBasket);
router.get('/customer', auth, getCustomerOrders);
router.get('/seller', auth, getOrdersBySeller);
router.put('/update/:id', auth, updateOrderStatus);

module.exports = router;
