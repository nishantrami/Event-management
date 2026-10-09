const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Food & Catering',
      'Mandap & Stage',
      'Flower Decoration',
      'Photography',
      'Music & Entertainment',
      'Lighting',
      'Furniture & Seating',
      'Makeup & Beauty'
    ]
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  pricingUnit: {
    type: String,
    enum: ['per_guest', 'fixed', 'per_item', 'per_hour'],
    default: 'fixed'
  },
  image: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
