const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Buyer = require('../models/Buyer');
const buyerAuthMiddleware = require('../middleware/buyerAuth');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, pincode } = req.body;
    
    const existing = await Buyer.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const buyer = await Buyer.create({ name, email, password: hashed, phone, pincode });

    const token = jwt.sign(
      { id: buyer._id, role: 'buyer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: buyer._id, name: buyer.name, role: 'buyer' }
    });
  } catch (err) {
    console.log('BUYER SIGNUP ERROR:', err.message); // 👈 this will show in terminal
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const buyer = await Buyer.findOne({ email });
    if (!buyer) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, buyer.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: buyer._id, role: 'buyer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: buyer._id, name: buyer.name, role: 'buyer' }
    });
  } catch (err) {
    console.log('BUYER LOGIN ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get('/profile', buyerAuthMiddleware, async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.buyerId).select('-password');
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/profile', buyerAuthMiddleware, async (req, res) => {
  try {
    const { name, phone, pincode } = req.body;
    const buyer = await Buyer.findByIdAndUpdate(
      req.buyerId,
      { name, phone, pincode },
      { new: true }
    ).select('-password');
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;