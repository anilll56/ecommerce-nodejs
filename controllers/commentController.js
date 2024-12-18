const Comment = require("../models/Comment");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const createComment = async (req, res) => {
  try {
    const { product, text, rate } = req.body;

    const comment = new Comment({
      user: req.user.userId,
      product,
      text,
      rate,
    });
    const savedComment = await comment.save();

    const productToUpdate = await Product.findById(product);
    if (!productToUpdate) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [totalComments, ratingAggregation] = await Promise.all([
      Comment.countDocuments({ product }),
      Comment.aggregate([
        { $match: { product } },
        { $group: { _id: null, total: { $sum: "$rate" } } },
      ]),
    ]);

    const totalRating = ratingAggregation[0]?.total || 0;
    const newAverageRating = totalComments > 0 ? totalRating / totalComments : 0;

    productToUpdate.productRating = newAverageRating;
    await productToUpdate.save();

    return res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCommentsByProduct = async (req, res) => {
  console.log(req.params.productId);
  try {
    const comments = await Comment.find({
      product: req.params.productId,
    }).populate("user", "name");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    comment.text = req.body.text;
    const updatedComment = await comment.save();
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await comment.remove();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByProduct,
  updateComment,
  deleteComment,
};
