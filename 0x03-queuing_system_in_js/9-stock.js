#!/usr/bin/env node

const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

// Initialize Express app
const app = express();
const port = 1245;

// Connect to Redis server
const client = redis.createClient();

// Promisify Redis functions
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// In-memory product list
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

// Data access function to get item by id
function getItemById(id) {
  return listProducts.find((item) => item.itemId === id);
}

// Route to get all products
app.get('/list_products', (req, res) => {
  const products = listProducts.map((product) => ({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
  }));
  res.json(products);
});

// Route to get specific product details
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  // Get reserved stock from Redis
  const reservedStock = await getAsync(`item.${itemId}`);
  const currentQuantity = product.initialAvailableQuantity - (reservedStock ? parseInt(reservedStock, 10) : 0);

  res.json({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
    currentQuantity,
  });
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getAsync(`item.${itemId}`);
  const currentReservedStock = reservedStock ? parseInt(reservedStock, 10) : 0;

  if (currentReservedStock >= product.initialAvailableQuantity) {
    return res.status(400).json({ status: 'Not enough stock available', itemId: product.itemId });
  }

  // Reserve one more item
  await setAsync(`item.${itemId}`, currentReservedStock + 1);
  res.json({ status: 'Reservation confirmed', itemId: product.itemId });
});

// Server listening
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
