const mongoose = require("mongoose");

const SellerProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  colors: { type: [String], required: true },
  productImage: { type: String, required: true },
  stock: { type: Number, required: true },
  productDescription: { type: String },
  productCategory: { type: String },
});

const Product = mongoose.model("Product", SellerProductSchema);

module.exports = Product;
