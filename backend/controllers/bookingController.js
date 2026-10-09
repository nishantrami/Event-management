const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const User = require('../models/User');

const DEFAULT_CAPACITY = 3;

// Helper to update Slot after status changes
const syncSlotStatus = async (eventType, eventDate) => {
  const activeCount = await Booking.countDocuments({
    eventType,
    eventDate,
    status: { $in: ['Confirmed', 'Pending'] }
  });

  let slot = await Slot.findOne({ eventType, date: eventDate });
  const maxCapacity = slot ? slot.maxCapacity : DEFAULT_CAPACITY;

  let status = 'Available';
  if (activeCount >= maxCapacity) {
    status = 'Fully Booked';
  } else if (activeCount === maxCapacity - 1 && maxCapacity > 1) {
    status = 'Limited';
  }

  if (slot) {
    slot.bookedCount = activeCount;
    slot.status = status;
    await slot.save();
  } else {
    slot = await Slot.create({
      eventType,
      date: eventDate,
      maxCapacity,
      bookedCount: activeCount,
      status
    });
  }
  return slot;
};

// @desc    Create a new booking with rigorous slot availability check
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res) => {
  try {
    const {
      eventType,
      eventDate,
      package: selectedPackage,
      services = [],
      preOrders = [],
      guestCount = 100,
      subtotal,
      discount = 0,
      taxes = 0,
      totalAmount,
      customer,
      specialRequests
    } = req.body;

    // 1. Validation
    if (!eventType || !eventDate || !selectedPackage || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information (event type, date, package, total amount)'
      });
    }

    // 2. Double Booking & Slot Capacity Check (SERVER-SIDE ENFORCEMENT)
    const existingSlot = await Slot.findOne({ eventType, date: eventDate });
    if (existingSlot && existingSlot.isBlocked) {
      return res.status(400).json({
        success: false,
        message: existingSlot.notes 
          ? `Date unavailable: ${existingSlot.notes}` 
          : 'Sorry, this date is currently blocked and unavailable for booking.'
      });
    }

    const activeBookingCount = await Booking.countDocuments({
      eventType,
      eventDate,
      status: { $in: ['Confirmed', 'Pending'] }
    });

    const maxCapacity = existingSlot ? existingSlot.maxCapacity : DEFAULT_CAPACITY;

    if (activeBookingCount >= maxCapacity) {
      // Synchronize slot status just in case
      if (existingSlot && existingSlot.status !== 'Fully Booked') {
        existingSlot.status = 'Fully Booked';
        existingSlot.bookedCount = activeBookingCount;
        await existingSlot.save();
      }
      return res.status(400).json({
        success: false,
        message: 'Sorry, this date is fully booked.'
      });
    }

    // 3. User verification
    const userId = req.user ? req.user.id : req.body.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required to complete booking'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found'
      });
    }

    // 4. Create the booking
    const booking = await Booking.create({
      userId,
      customer: {
        name: customer?.name || user.name,
        email: customer?.email || user.email,
        phone: customer?.phone || user.phone,
        address: customer?.address || ''
      },
      eventType,
      eventDate,
      package: {
        name: selectedPackage.name,
        price: selectedPackage.price,
        description: selectedPackage.description || '',
        features: selectedPackage.features || []
      },
      services: services.map(s => ({
        serviceId: s.serviceId || s._id,
        name: s.name,
        category: s.category,
        price: s.price,
        pricingUnit: s.pricingUnit || 'fixed',
        quantity: s.quantity || (s.pricingUnit === 'per_guest' ? guestCount : 1),
        total: s.total || s.price
      })),
      preOrders: preOrders.map(p => ({
        preOrderId: p.preOrderId || p._id,
        name: p.name,
        price: p.price,
        quantity: p.quantity || 1,
        total: p.total || (p.price * (p.quantity || 1))
      })),
      guestCount: Number(guestCount) || 100,
      subtotal: Number(subtotal),
      discount: Number(discount) || 0,
      taxes: Number(taxes) || 0,
      totalAmount: Number(totalAmount),
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: 'Online Payment (Verified Demo)',
      specialRequests: specialRequests || ''
    });

    // 5. Update slot count & status in MongoDB
    const updatedSlot = await syncSlotStatus(eventType, eventDate);

    return res.status(201).json({
      success: true,
      message: 'Booking successfully confirmed!',
      booking,
      slot: {
        eventType,
        date: eventDate,
        bookedCount: updatedSlot.bookedCount,
        maxCapacity: updatedSlot.maxCapacity,
        status: updatedSlot.status
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private (Customer)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch your bookings'
    });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Customer / Admin)
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure customer can only view their own booking unless admin
    if (req.user && booking.userId.toString() !== req.user.id.toString() && !req.admin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this booking record'
      });
    }

    return res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking'
    });
  }
};

// @desc    Get all bookings (Admin) with filter & search
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, eventType, date, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (eventType && eventType !== 'All') {
      query.eventType = eventType;
    }
    if (date) {
      query.eventDate = date;
    }
    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
        { eventType: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // If restoring a cancelled booking to Confirmed, check capacity
    if (booking.status === 'Cancelled' && (status === 'Confirmed' || status === 'Pending')) {
      const activeCount = await Booking.countDocuments({
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        status: { $in: ['Confirmed', 'Pending'] }
      });
      const slot = await Slot.findOne({ eventType: booking.eventType, date: booking.eventDate });
      const maxCap = slot ? slot.maxCapacity : DEFAULT_CAPACITY;
      if (activeCount >= maxCap) {
        return res.status(400).json({
          success: false,
          message: 'Cannot reactivate booking: This date is already at maximum capacity.'
        });
      }
    }

    booking.status = status;
    await booking.save();

    // Re-sync slot count
    await syncSlotStatus(booking.eventType, booking.eventDate);

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update booking status'
    });
  }
};

// @desc    Delete booking (Admin)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const { eventType, eventDate } = booking;
    await Booking.findByIdAndDelete(req.params.id);

    // Sync slot capacity
    await syncSlotStatus(eventType, eventDate);

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete booking'
    });
  }
};
