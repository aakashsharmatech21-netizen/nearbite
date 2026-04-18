const mongoose = require('mongoose');

const cookSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio:      { type: String, default: '' },
  pincode:  { type: String, required: true },
  phone:    { type: String, required: true },
  isOpen:   { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Cook', cookSchema);