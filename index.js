require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(require('cors')());

app.use('/', routes);
connectDB();

module.exports = app;
