const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Basic', 'Standard', 'Premium'],
    unique: true
  },
  title: {
    type: String,
    default: function() {
      return `${this.name} Package`;
    }
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  features: [{
    type: String,
    required: true
  }],
  popular: {
    type: Boolean,
    default: false
  },
  badge: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Package', packageSchema);
