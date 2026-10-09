const express = require('express');
const router = express.Router();
const {
  checkSlotAvailability,
  getCalendarSlots,
  getSlotStats,
  getAllSlots,
  getSlotBookings,
  setSlotCapacity,
  bulkSetSlotCapacity,
  deleteSlot
} = require('../controllers/slotController');
const { adminProtect } = require('../middleware/adminAuth');

router.get('/availability', checkSlotAvailability);
router.get('/calendar', getCalendarSlots);
router.get('/stats', adminProtect, getSlotStats);
router.get('/:id/bookings', adminProtect, getSlotBookings);
router.post('/bulk', adminProtect, bulkSetSlotCapacity);
router.delete('/:id', adminProtect, deleteSlot);
router.get('/', adminProtect, getAllSlots);
router.post('/', adminProtect, setSlotCapacity);

module.exports = router;
