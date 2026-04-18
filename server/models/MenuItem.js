const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
  name:   { type: String, required: true },
  price:  { type: Number, required: true },
  isVeg:  { type: Boolean, default: true },
  tag:    { type: String, default: '' },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);