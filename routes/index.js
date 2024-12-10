const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const productRoutes = require("./product");
const orderRoutes = require("./order");
const commentRoutes = require("./comment");
const basketRoutes = require("./basket");
const favoritesRoutes = require("./favorites");

router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/order", orderRoutes);
router.use("/comment", commentRoutes);
router.use("/basket", basketRoutes);
router.use("/favorites", favoritesRoutes);

module.exports = router;
