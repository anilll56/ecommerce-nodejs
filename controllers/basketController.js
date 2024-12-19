const Basket = require("../models/Basket");
const Product = require("../models/Product");

const getBasketItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const basketItems = await Basket.find({ user_id: userId }).populate(
      "products.product"
    );

    if (basketItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No basket items found for this user." });
    }

    res.status(200).json(basketItems);
  } catch (error) {
    console.error("Error fetching basket items:", error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const addItemToBasket = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Kullanıcı kimliği bulunamadı." });
  }

  try {
    let basket = await Basket.findOne({ user_id: userId });

    if (basket) {
      const productIndex = basket.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex > -1) {
        basket.products[productIndex].quantity += quantity;
      } else {
        basket.products.push({ product: productId, quantity });
      }
    } else {
      basket = new Basket({
        user_id: userId,
        products: [{ product: productId, quantity }],
        totalPrice: 0,
      });
    }

    basket.totalPrice = await calculateTotalPrice(basket.products);

    await basket.save();
    res.status(201).json(basket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const calculateTotalPrice = async (products) => {
  let totalPrice = 0;
  const productIds = products.map((item) => item.product);
  const productDetails = await Product.find({ _id: { $in: productIds } });
  for (const item of products) {
    const product = productDetails.find(
      (p) => p._id.toString() === item.product.toString()
    );
    if (product) {
      totalPrice += product.price * item.quantity;
    }
  }

  return totalPrice;
};

const removeItemFromBasket = async (req, res) => {
  const { productId } = req.params;
  try {
    await Basket.findOneAndDelete({ userId: req.user.id, productId });
    res.status(200).json({ message: "Item removed from basket" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const updateBasketItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let basketItem = await Basket.findOne({ userId: req.user.id, productId });

    if (basketItem) {
      basketItem.quantity = quantity;
      await basketItem.save();
      res.status(200).json(basketItem);
    } else {
      res.status(404).json({ message: "Item not found in basket" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  getBasketItems,
  addItemToBasket,
  removeItemFromBasket,
  updateBasketItem,
};
