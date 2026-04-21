const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String },
  pincode:  { type: String },
  avatar:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Buyer', buyerSchema);