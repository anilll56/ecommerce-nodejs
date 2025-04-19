const Basket = require('../models/Basket');
const Product = require('../models/Product');

const getBasketItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const basketItems = await Basket.find({ user_id: userId }).populate(
      'products.product'
    );

    if (basketItems.length === 0) {
      return res
        .status(200)
        .json({ message: 'Your basket is empty', basket: [] });
    }
    res.status(200).json(basketItems);
  } catch (error) {
    console.error('Error fetching basket items:', error.stack);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const addItemToBasket = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ message: 'Kullanıcı kimliği bulunamadı.' });
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
    console.error('Error adding item to basket:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
const calculateTotalPrice = async (products) => {
  let totalPrice = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (product) {
      totalPrice += product.price * item.quantity;
    } else {
      console.warn(`Ürün bulunamadı: ${item.product}`);
    }
  }

  return totalPrice.toFixed(2);
};

const removeItemFromBasket = async (req, res) => {
  const { productId } = req.params;

  console.log(productId);
  try {
    const basket = await Basket.findOne({ user_id: req.user.userId });

    console.log(basket);
    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }

    basket.products = basket.products.filter(
      (item) => item.product.toString() !== productId
    );

    basket.totalPrice = await calculateTotalPrice(basket.products);

    await basket.save();
    res.status(200).json({ message: 'Item removed from basket', basket });
  } catch (error) {
    console.error('Error removing item from basket:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

const updateBasketItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const basket = await Basket.findOne({ user_id: req.user.userId });

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }

    const productIndex = basket.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in basket' });
    }

    basket.products[productIndex].quantity = quantity;

    basket.totalPrice = await calculateTotalPrice(basket.products);

    await basket.save();
    res.status(200).json(basket);
  } catch (error) {
    console.error('Error updating basket:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  getBasketItems,
  addItemToBasket,
  removeItemFromBasket,
  updateBasketItem,
};
