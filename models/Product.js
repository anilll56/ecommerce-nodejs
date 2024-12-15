const mongoose = require("mongoose");

const SellerProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stock: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: 10,
  },
  price: { type: Number, required: true },
  colors: { type: [String], required: true },
  productImage: { type: String, required: true },
  productDescription: { type: String },
  productCategory: {
    type: String,
    required: true,
    enum: ["electronics", "clothing", "furniture", "books", "other"],
  },
  productRating: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", SellerProductSchema);

module.exports = Product;
