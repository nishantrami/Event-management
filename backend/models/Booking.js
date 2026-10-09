const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      return `EVT-${Date.now().toString().slice(-4)}${randomDigits}`;
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: '' }
  },
  eventType: {
    type: String,
    required: true
  },
  eventDate: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  package: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    features: [{ type: String }]
  },
  services: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    pricingUnit: { type: String, default: 'fixed' },
    quantity: { type: Number, default: 1 },
    total: { type: Number, required: true }
  }],
  preOrders: [{
    preOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'PreOrder' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true }
  }],
  guestCount: {
    type: Number,
    default: 100,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Partially Paid'],
    default: 'Paid'
  },
  paymentMethod: {
    type: String,
    default: 'Online Payment (Verified Demo)'
  },
  specialRequests: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
