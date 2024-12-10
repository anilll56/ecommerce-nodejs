const Favorite = require("../models/Favorites");

const getFavorites = async (req, res) => {
  const { userId } = req.body;
  try {
    const favorites = await Favorite.find({
      user_id: userId,
    }).populate("product_id");

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addFavorite = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Kullanıcı kimliği bulunamadı." });
  }
  try {
    const newFavorite = new Favorite({
      user_id: userId,
      product_id: productId,
    });

    const favorite = await newFavorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      product: req.params.productId,
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
