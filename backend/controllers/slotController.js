const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

const DEFAULT_CAPACITY = 3;

// Helper to determine status string
const calculateSlotStatus = (bookedCount, maxCapacity, isBlocked = false) => {
  if (isBlocked) {
    return 'Blocked';
  } else if (bookedCount >= maxCapacity) {
    return 'Fully Booked';
  } else if (bookedCount === maxCapacity - 1 && maxCapacity > 1) {
    return 'Limited';
  } else {
    return 'Available';
  }
};

// @desc    Check slot availability for a specific event type and date
// @route   GET /api/slots/availability
// @access  Public
exports.checkSlotAvailability = async (req, res) => {
  try {
    const { eventType, date } = req.query;

    if (!eventType || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both eventType and date (YYYY-MM-DD)'
      });
    }

    // 1. Check if an explicit Slot configuration exists
    let slot = await Slot.findOne({ eventType, date });

    // 2. Count active/confirmed bookings in MongoDB for real-time verification
    const activeBookingCount = await Booking.countDocuments({
      eventType,
      eventDate: date,
      status: { $in: ['Confirmed', 'Pending'] }
    });

    const maxCapacity = slot ? slot.maxCapacity : DEFAULT_CAPACITY;
    const isBlocked = slot ? Boolean(slot.isBlocked) : false;
    const notes = slot ? (slot.notes || '') : '';
    const bookedCount = Math.max(activeBookingCount, slot ? slot.bookedCount : 0);
    const remainingSlots = isBlocked ? 0 : Math.max(0, maxCapacity - bookedCount);
    const status = calculateSlotStatus(bookedCount, maxCapacity, isBlocked);
    const isAvailable = !isBlocked && remainingSlots > 0;

    // Keep slot document in sync if exists, or create on demand
    if (slot) {
      if (slot.bookedCount !== bookedCount || slot.status !== status) {
        slot.bookedCount = bookedCount;
        slot.status = status;
        await slot.save();
      }
    } else {
      slot = await Slot.create({
        eventType,
        date,
        maxCapacity,
        bookedCount,
        status,
        isBlocked: false,
        notes: ''
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        eventType,
        date,
        maxCapacity,
        bookedCount,
        remainingSlots,
        status,
        isBlocked,
        notes,
        isAvailable
      }
    });
  } catch (error) {
    console.error('Check slot availability error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check slot availability'
    });
  }
};

// @desc    Get slots for a date range / month for calendar rendering
// @route   GET /api/slots/calendar
// @access  Public
exports.getCalendarSlots = async (req, res) => {
  try {
    const { eventType, month } = req.query; // month e.g. "2026-10"

    const query = {};
    if (eventType && eventType !== 'All') query.eventType = eventType;
    if (month) {
      query.date = { $regex: `^${month}` };
    }

    const slots = await Slot.find(query).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: slots.length,
      slots
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve calendar slots'
    });
  }
};

// @desc    Get aggregated stats for slots (Admin)
// @route   GET /api/slots/stats
// @access  Private (Admin)
exports.getSlotStats = async (req, res) => {
  try {
    const totalSlots = await Slot.countDocuments();
    const availableSlots = await Slot.countDocuments({ status: 'Available' });
    const limitedSlots = await Slot.countDocuments({ status: 'Limited' });
    const fullyBookedSlots = await Slot.countDocuments({ status: 'Fully Booked' });
    const blockedSlots = await Slot.countDocuments({ isBlocked: true });

    const slotAgg = await Slot.aggregate([
      {
        $group: {
          _id: null,
          totalBooked: { $sum: '$bookedCount' },
          totalCapacity: { $sum: '$maxCapacity' }
        }
      }
    ]);

    const totalBooked = slotAgg[0]?.totalBooked || 0;
    const totalCapacity = slotAgg[0]?.totalCapacity || 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalSlots,
        availableSlots,
        limitedSlots,
        fullyBookedSlots,
        blockedSlots,
        totalBooked,
        totalCapacity
      }
    });
  } catch (error) {
    console.error('Failed to get slot stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve slot metrics'
    });
  }
};

// @desc    Get all slots (Admin) with flexible filtering
// @route   GET /api/slots
// @access  Private (Admin)
exports.getAllSlots = async (req, res) => {
  try {
    const { eventType, status, search, startDate, endDate } = req.query;
    let query = {};
    if (eventType && eventType !== 'All') query.eventType = eventType;
    if (status && status !== 'All') {
      if (status === 'Blocked') {
        query.isBlocked = true;
      } else {
        query.status = status;
      }
    }
    if (search) {
      query.$or = [
        { date: { $regex: search, $options: 'i' } },
        { eventType: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const slots = await Slot.find(query).sort({ date: 1, eventType: 1 });

    return res.status(200).json({
      success: true,
      count: slots.length,
      slots
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch slots'
    });
  }
};

// @desc    Get bookings connected to a slot (Admin)
// @route   GET /api/slots/:id/bookings
// @access  Private (Admin)
exports.getSlotBookings = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    const bookings = await Booking.find({
      eventType: slot.eventType,
      eventDate: slot.date,
      status: { $in: ['Confirmed', 'Pending', 'Completed', 'Cancelled'] }
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      slot,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load bookings for slot'
    });
  }
};

// @desc    Create or update single slot capacity (Admin)
// @route   POST /api/slots
// @access  Private (Admin)
exports.setSlotCapacity = async (req, res) => {
  try {
    const { eventType, date, maxCapacity, isBlocked, notes } = req.body;

    if (!eventType || !date || maxCapacity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide eventType, date and maxCapacity'
      });
    }

    const capacityNum = parseInt(maxCapacity, 10);
    if (isNaN(capacityNum) || capacityNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'maxCapacity must be at least 1'
      });
    }

    // Count existing active bookings
    const bookedCount = await Booking.countDocuments({
      eventType,
      eventDate: date,
      status: { $in: ['Confirmed', 'Pending'] }
    });

    const blockedVal = Boolean(isBlocked);
    const status = calculateSlotStatus(bookedCount, capacityNum, blockedVal);

    let slot = await Slot.findOne({ eventType, date });

    if (slot) {
      slot.maxCapacity = capacityNum;
      slot.bookedCount = bookedCount;
      slot.isBlocked = blockedVal;
      if (notes !== undefined) slot.notes = notes;
      slot.status = status;
      await slot.save();
    } else {
      slot = await Slot.create({
        eventType,
        date,
        maxCapacity: capacityNum,
        bookedCount,
        isBlocked: blockedVal,
        notes: notes || '',
        status
      });
    }

    return res.status(200).json({
      success: true,
      message: `Slot configured successfully for ${eventType} on ${date}`,
      slot
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to configure slot'
    });
  }
};

// @desc    Bulk configure slots across a date range (Admin)
// @route   POST /api/slots/bulk
// @access  Private (Admin)
exports.bulkSetSlotCapacity = async (req, res) => {
  try {
    const { startDate, endDate, eventTypes = [], maxCapacity = 3, isBlocked = false, notes = '' } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both startDate and endDate (YYYY-MM-DD)'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'startDate cannot be after endDate'
      });
    }

    const capNum = Math.max(1, parseInt(maxCapacity, 10) || 3);
    const blockedVal = Boolean(isBlocked);

    // List of event types to update
    const targetEventTypes = Array.isArray(eventTypes) && eventTypes.length > 0
      ? eventTypes
      : [
          'Wedding',
          'Birthday Party',
          'Engagement',
          'Anniversary',
          'Corporate Events',
          'Religious Events',
          'Baby Shower',
          'Graduation',
          'Reception',
          'Other Special Events'
        ];

    let modifiedCount = 0;
    const cur = new Date(start);

    // Limit maximum range to 90 days to prevent runaway loops
    let daysCount = 0;
    while (cur <= end && daysCount < 90) {
      const yyyy = cur.getFullYear();
      const mm = String(cur.getMonth() + 1).padStart(2, '0');
      const dd = String(cur.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      for (const evType of targetEventTypes) {
        const bookedCount = await Booking.countDocuments({
          eventType: evType,
          eventDate: dateStr,
          status: { $in: ['Confirmed', 'Pending'] }
        });

        const status = calculateSlotStatus(bookedCount, capNum, blockedVal);

        await Slot.findOneAndUpdate(
          { eventType: evType, date: dateStr },
          {
            eventType: evType,
            date: dateStr,
            maxCapacity: capNum,
            bookedCount,
            isBlocked: blockedVal,
            notes: notes || 'Bulk configured',
            status
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        modifiedCount++;
      }

      cur.setDate(cur.getDate() + 1);
      daysCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Bulk rule successfully applied to ${modifiedCount} slot entries across ${daysCount} days!`,
      modifiedCount,
      daysCount
    });
  } catch (error) {
    console.error('Bulk slot config error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to bulk configure slots'
    });
  }
};

// @desc    Delete or reset a slot rule (Admin)
// @route   DELETE /api/slots/:id
// @access  Private (Admin)
exports.deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot record not found'
      });
    }

    const activeCount = await Booking.countDocuments({
      eventType: slot.eventType,
      eventDate: slot.date,
      status: { $in: ['Confirmed', 'Pending'] }
    });

    if (activeCount > 0) {
      // Revert to standard default
      slot.maxCapacity = DEFAULT_CAPACITY;
      slot.isBlocked = false;
      slot.notes = '';
      slot.bookedCount = activeCount;
      slot.status = calculateSlotStatus(activeCount, DEFAULT_CAPACITY, false);
      await slot.save();

      return res.status(200).json({
        success: true,
        message: 'Slot has active bookings. Reset to standard default capacity (3) and unblocked.',
        slot
      });
    }

    await Slot.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Slot configuration removed successfully. Date restored to system defaults.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete slot configuration'
    });
  }
};
