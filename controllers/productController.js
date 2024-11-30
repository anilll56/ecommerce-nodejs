const Order = require("../models/Order");
const Product = require("../models/Product");

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

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

module.exports = {
  createOrder,
  getAllProducts,
};
