const router = require('express').Router();
const Cook = require('../models/Cook');
const MenuItem = require('../models/MenuItem');

// Browse cooks by pincode
router.get('/', async (req, res) => {
  try {
    const { pincode } = req.query;
    const filter = pincode ? { pincode } : {};
    const cooks = await Cook.find(filter).select('-password');
    
    // Attach menu items to each cook
    const result = await Promise.all(cooks.map(async (cook) => {
      const menu = await MenuItem.find({ cookId: cook._id });
      return { ...cook.toObject(), menu };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;