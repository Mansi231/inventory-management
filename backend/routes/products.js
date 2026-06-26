const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

// GET /api/products  — any authenticated user, supports ?search=&category=
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
});

// POST /api/products — admin only
router.post('/', verifyToken, requireRole('admin'), async (req, res, next) => {
  try {
    const { name, sku, category, price, stock, reorderLevel, isActive } = req.body;

    const existing = await Product.findOne({ sku: sku?.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A product with this SKU already exists.' });
    }

    const product = await Product.create({ name, sku, category, price, stock, reorderLevel, isActive });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', verifyToken, requireRole('admin'), async (req, res, next) => {
  try {
    const { name, sku, category, price, stock, reorderLevel, isActive } = req.body;

    if (sku) {
      const duplicate = await Product.findOne({
        sku: sku.toUpperCase(),
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Another product already uses this SKU.' });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, sku, category, price, stock, reorderLevel, isActive },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
