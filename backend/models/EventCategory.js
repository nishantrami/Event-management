const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  tagline: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Calendar'
  },
  image: {
    type: String,
    required: true
  },
  startingPrice: {
    type: Number,
    required: true
  },
  popular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EventCategory', eventCategorySchema);
