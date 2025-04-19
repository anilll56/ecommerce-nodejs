const sendEmail = require('../mail/nodemailer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const User = require('../models/User');
const Basket = require('../models/Basket');

const createOrder = async (req, res) => {
  try {
    const { customer_id, seller_id, products } = req.body;

    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        totalPrice += product.price * item.quantity;
      } else {
        return res
          .status(400)
          .json({ message: `Product with ID ${item.product} not found` });
      }
    }

    const newOrder = new Order({
      customer_id,
      seller_id,
      products,
      totalPrice,
      status: 'Pending',
      orderDate: new Date(),
    });

    const savedOrder = await newOrder.save();

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

const createOrdersFromBasket = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const basket = await Basket.findOne({ user_id }).populate(
      'products.product'
    );

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }

    const orders = [];

    for (const item of basket.products) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({ message: 'Product not found in basket' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}`,
        });
      }

      try {
        const newOrder = new Order({
          customer_id: user_id,
          seller_id: product.seller_id,
          products: [{ product: item.product, quantity: item.quantity }],
          totalPrice: product.price * item.quantity,
          status: 'Pending',
          orderDate: new Date(),
        });

        const user = await User.findById(user_id);

        sendEmail(
          user,
          'Siparişinizi aldık ve işleme koymaya başladık. Aşağıda sipariş detaylarınızı bulabilirsiniz:',
          product
        );

        const savedOrder = await newOrder.save();
        orders.push(savedOrder);

        product.stock -= item.quantity;
        await product.save();
      } catch (error) {
        console.error(
          `Error creating order for product ${item.product}:`,
          error
        );
        return res.status(500).json({
          message: 'Error creating order, see logs for details',
          error: error.message,
        });
      }
    }

    await Basket.deleteOne({ _id: basket._id });

    res.status(201).json({
      message: 'Orders created from basket',
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating orders from basket',
      error: error.message || error,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid customer ID format' });
    }

    const orders = await Order.find({
      customer_id: req.user.userId,
    }).populate('products.product');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

const getOrdersBySeller = async (req, res) => {
  try {
    const orders = await Order.find({ seller_id: req.user.userId }).populate(
      'products.product'
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const _id = req.params.id;
    const newStatus = req.body.status;
    console.log('Order ID:', _id, 'New Status:', newStatus);

    if (!newStatus) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await Order.findById(_id);
    if (newStatus === 'Shipped') {
      const user = await User.findById(order.customer_id);
      const product = await Order.findById(_id).populate('products.product');

      sendEmail(
        user,
        'Siparişiniz kargoya verildi:',
        product.products[0].product
      );
    }
    if (order) {
      order.status = newStatus;
      await order.save();
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};

// const getShippedOrders = async (req, res) => {
//   try {
//     const customerId = req.user.userId;

//     if (!mongoose.Types.ObjectId.isValid(customerId)) {
//       return res.status(400).json({ message: "Invalid customer ID format" });
//     }

//     const shippedOrders = await Order.find({
//       customer_id: customerId,
//       status: "Shipped",
//     }).populate("products.product");

//     if (shippedOrders.length === 0) {
//       return res.status(404).json({ message: "No shipped orders found" });
//     }

//     res.status(200).json(shippedOrders);
//   } catch (error) {
//     console.error("Error fetching shipped orders:", error.message);
//     res.status(500).json({ message: "Error fetching shipped orders", error });
//   }
// };

module.exports = {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getOrdersBySeller,
  updateOrderStatus,
  createOrdersFromBasket,
};
