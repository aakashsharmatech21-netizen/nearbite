const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  cookId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
  reviewerName: { type: String, required: true },
  rating:       { type: Number, required: true, min: 1, max: 5 },
  comment:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);