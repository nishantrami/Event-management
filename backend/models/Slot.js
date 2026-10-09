const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    trim: true
  },
  maxCapacity: {
    type: Number,
    required: true,
    default: 3
  },
  bookedCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Limited', 'Fully Booked', 'Blocked'],
    default: 'Available'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to ensure uniqueness per eventType and date
slotSchema.index({ eventType: 1, date: 1 }, { unique: true });

// Auto-compute status before save
slotSchema.pre('save', function (next) {
  if (this.isBlocked) {
    this.status = 'Blocked';
  } else if (this.bookedCount >= this.maxCapacity) {
    this.status = 'Fully Booked';
  } else if (this.bookedCount === this.maxCapacity - 1 && this.maxCapacity > 1) {
    this.status = 'Limited';
  } else {
    this.status = 'Available';
  }
  next();
});

module.exports = mongoose.model('Slot', slotSchema);
