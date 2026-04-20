const router = require('express').Router();
const Cook = require('../models/Cook');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');

// Browse by pincode
router.get('/', async (req, res) => {
  try {
    const { pincode } = req.query;
    const cooks = await Cook.find({ pincode }).select('-password');
    const cooksWithMenu = await Promise.all(
      cooks.map(async (cook) => {
        const menu = await MenuItem.find({ cookId: cook._id });
        return { ...cook.toObject(), menu };
      })
    );
    res.json(cooksWithMenu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single cook profile
router.get('/:id', async (req, res) => {
  try {
    const cook = await Cook.findById(req.params.id).select('-password');
    if (!cook) return res.status(404).json({ message: 'Cook not found' });
    const menu = await MenuItem.find({ cookId: cook._id });
    const reviews = await Review.find({ cookId: cook._id }).sort({ createdAt: -1 });
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;
    res.json({ ...cook.toObject(), menu, reviews, avgRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add review
router.post('/:id/review', async (req, res) => {
  try {
    const { reviewerName, rating, comment } = req.body;
    const review = await Review.create({
      cookId: req.params.id,
      reviewerName,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;