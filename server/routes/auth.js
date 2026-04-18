const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cook = require('../models/Cook');
const authMiddleware = require('../middleware/auth');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, bio, pincode, phone } = req.body;
    const existing = await Cook.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const cook = await Cook.create({ name, email, password: hashed, bio, pincode, phone });
    const token = jwt.sign({ id: cook._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, cook: { id: cook._id, name: cook.name, pincode: cook.pincode } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cook = await Cook.findOne({ email });
    if (!cook) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, cook.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: cook._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, cook: { id: cook._id, name: cook.name, pincode: cook.pincode } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle open/closed
router.patch('/toggle', authMiddleware, async (req, res) => {
  try {
    const cook = await Cook.findById(req.cookId);
    cook.isOpen = !cook.isOpen;
    await cook.save();
    res.json({ isOpen: cook.isOpen });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;