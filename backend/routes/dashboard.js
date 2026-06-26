const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const verifyToken = require('../middleware/auth');

// GET /api/dashboard/summary — any authenticated user
router.get('/summary', verifyToken, async (req, res, next) => {
  try {
    const [totalProducts, totalOrders, pendingOrders, lowStockProducts] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Product.countDocuments({ $expr: { $lte: ['$stock', '$reorderLevel'] } }),
    ]);

    res.json({
      success: true,
      data: { totalProducts, totalOrders, pendingOrders, lowStockProducts },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
