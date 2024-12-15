const Product = require("../models/Product");

const addProduct = async (req, res) => {
  try {
    const {
      name,
      seller_id,
      stock,
      price,
      colors,
      productImage,
      productDescription,
      productCategory,
    } = req.body;

    if (!name || !seller_id || !stock || !price || !colors || !productImage) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: name, seller_id, stock, price, colors, productImage",
      });
    }

    // if (stock <= 0 || price <= 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Stock and price must be greater than zero",
    //   });
    // }

    // if (
    //   !Array.isArray(colors) ||
    //   colors.length === 0 ||
    //   !colors.every((color) => typeof color === "string")
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Colors must be a non-empty array of strings",
    //   });
    // }

    const newProduct = await Product.create({
      name,
      seller_id,
      stock,
      price,
      colors,
      productImage,
      productDescription,
      productCategory,
    });

    res.status(201).json({
      success: true,
      message: "Product Added",
      sellerProduct: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, stock, price, colors, productImage } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, stock, price, colors, productImage },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

const getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const products = await Product.find({ seller_id: sellerId });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySeller,
};
