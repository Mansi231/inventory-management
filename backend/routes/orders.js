const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerName, items } = req.body;

    if (!customerName || !items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Customer name and at least one item are required.' });
    }

    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found.` });
      }

      if (!product.isActive) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: `Product "${product.name}" is currently inactive.` });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`,
        });
      }

      // Deduct stock atomically
      product.stock -= item.quantity;
      await product.save({ session });

      // Backend calculates price — never trusts client
      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;

      resolvedItems.push({ productId: product._id, quantity: item.quantity, price: product.price });
    }

    const [order] = await Order.create([{ customerName, items: resolvedItems, totalAmount }], { session });

    await session.commitTransaction();
    session.endSession();

    const populated = await order.populate('items.productId', 'name sku category');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
});

// PUT /api/orders/:id/status — admin only
router.put('/:id/status', verifyToken, requireRole('admin'), async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.status === status) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: `Order is already ${status}.` });
    }

    // Restore stock when cancelling
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { session }
        );
      }
    }

    order.status = status;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await order.populate('items.productId', 'name sku category');
    res.json({ success: true, data: populated });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
});

module.exports = router;
