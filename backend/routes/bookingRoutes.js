const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { adminProtect } = require('../middleware/adminAuth');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', adminProtect, getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', adminProtect, updateBookingStatus);
router.delete('/:id', adminProtect, deleteBooking);

module.exports = router;
