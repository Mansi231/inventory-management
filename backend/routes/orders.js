const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/roleCheck');

// GET /api/orders — any authenticated user
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('items.productId', 'name sku category')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders — any authenticated user (staff or admin)
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { customerName, items } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer name and at least one item are required.' });
    }

    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found.` });
      }

      if (!product.isActive) {
        return res.status(400).json({ success: false, message: `Product "${product.name}" is currently inactive.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`,
        });
      }

      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;
      resolvedItems.push({ productId: product._id, quantity: item.quantity, price: product.price });
    }

    // Deduct stock for each item
    for (const item of resolvedItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({ customerName, items: resolvedItems, totalAmount });
    const populated = await order.populate('items.productId', 'name sku category');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/status — admin only
router.put('/:id/status', verifyToken, requireRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.status === status) {
      return res.status(400).json({ success: false, message: `Order is already ${status}.` });
    }

    // Restore stock when cancelling
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
      }
    }

    order.status = status;
    await order.save();

    const populated = await order.populate('items.productId', 'name sku category');
    res.json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
