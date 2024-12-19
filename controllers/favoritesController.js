const Favorite = require("../models/Favorites");
const mongoose = require("mongoose");

const getFavorites = async (req, res) => {
  const userId = req.user.userId;
  try {
    const favorites = await Favorite.find({
      user: userId,
    }).populate("product");

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addFavorite = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ message: "Kullanıcı kimliği bulunamadı." });
  }
  try {
    const newFavorite = new Favorite({
      user: userId,
      product: productId,
    });

    const favorite = await newFavorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    console.error("Error saving favorite:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const removeFavorite = async (req, res) => {
  const userId = req.user.userId;
  let productId = req.params.productId;

  // Trim any extra whitespace or newline characters from productId
  productId = productId.trim();

  // Check if the productId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Favorite removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
