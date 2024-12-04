const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

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
      status: "Pending",
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
    res.status(500).json({ message: "Error creating order", error });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID format" });
    }

    const orders = await Order.find({
      customer_id: req.user.userId,
    }).populate("products.product");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

const getOrdersBySeller = async (req, res) => {
  try {
    const orders = await Order.find({ seller_id: req.user.userId }).populate(
      "products.product"
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const newStatus = req.body.status;

    if (!newStatus) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findById(orderId);
    if (order) {
      order.status = newStatus;
      await order.save();
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getOrdersBySeller,
  updateOrderStatus,
};
