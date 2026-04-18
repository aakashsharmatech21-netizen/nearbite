const router = require('express').Router();
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');

// Add item
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, price, isVeg, tag } = req.body;
    const item = await MenuItem.create({ cookId: req.cookId, name, price, isVeg, tag });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get cook's own items
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await MenuItem.find({ cookId: req.cookId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete item
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await MenuItem.findOneAndDelete({ _id: req.params.id, cookId: req.cookId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment click
router.post('/:id/click', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Trending - top 3
router.get('/trending', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ clicks: -1 }).limit(3).populate('cookId', 'name pincode phone');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;