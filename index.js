require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

const app = express();

app.use(express.json());
app.use(require("cors")());

connectDB();

app.use("/auth", authRoutes);
app.use("/product", productRoutes);

const PORT = process.env.PORT || 5858;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
