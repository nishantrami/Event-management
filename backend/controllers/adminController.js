const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Service = require('../models/Service');

const STATIC_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@eventpro.com';
const STATIC_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

// @desc    Admin static login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide admin email and password'
      });
    }

    if (email.trim().toLowerCase() !== STATIC_ADMIN_EMAIL.toLowerCase() || password !== STATIC_ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const token = jwt.sign(
      { email: STATIC_ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET || 'eventora_secret_2026',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      admin: {
        email: STATIC_ADMIN_EMAIL,
        name: 'Eventora Chief Executive',
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during admin login'
    });
  }
};

// @desc    Get Admin Dashboard Analytics & Stats
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Revenue from confirmed or completed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Today's date string YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Upcoming events count
    const upcomingEvents = await Booking.countDocuments({
      eventDate: { $gte: todayStr },
      status: { $in: ['Confirmed', 'Pending'] }
    });

    // Today's created bookings
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaysBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    // Slot metrics
    const fullyBookedSlotsCount = await Slot.countDocuments({ status: 'Fully Booked' });
    const availableSlotsCount = await Slot.countDocuments({ status: 'Available' });
    const limitedSlotsCount = await Slot.countDocuments({ status: 'Limited' });

    // Category Distribution
    const categoryDistribution = await Booking.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 }, totalRevenue: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } }
    ]);

    // Package Popularity
    const packagePopularity = await Booking.aggregate([
      { $group: { _id: '$package.name', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly trends (last 6-12 months)
    const monthlyStats = await Booking.aggregate([
      {
        $group: {
          _id: { $substr: ['$eventDate', 0, 7] }, // YYYY-MM
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email phone');

    return res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        totalBookings,
        totalRevenue,
        upcomingEvents,
        todaysBookings,
        fullyBookedSlots: fullyBookedSlotsCount,
        availableSlots: availableSlotsCount,
        limitedSlots: limitedSlotsCount
      },
      charts: {
        monthly: monthlyStats.map(item => ({
          month: item._id,
          bookings: item.bookings,
          revenue: item.revenue
        })),
        categoryDistribution: categoryDistribution.map(item => ({
          name: item._id || 'Custom',
          value: item.count,
          revenue: item.totalRevenue
        })),
        packagePopularity: packagePopularity.map(item => ({
          name: item._id || 'Standard',
          value: item.count,
          revenue: item.revenue
        }))
      },
      recentBookings
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin dashboard stats'
    });
  }
};

// @desc    Get Customers list with booking count and status
// @route   GET /api/customers
// @access  Private (Admin)
exports.getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const customers = await User.find(query).sort({ createdAt: -1 });

    // Populate booking statistics for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (user) => {
        const bookings = await Booking.find({ userId: user._id }).sort({ createdAt: -1 });
        const totalSpent = bookings.reduce((sum, b) => b.status !== 'Cancelled' ? sum + b.totalAmount : sum, 0);
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
          totalBookings: bookings.length,
          totalSpent,
          lastBooking: bookings.length > 0 ? bookings[0].eventDate : null,
          status: 'Active'
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: customersWithStats.length,
      customers: customersWithStats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load customers'
    });
  }
};

// @desc    Get single customer details + bookings
// @route   GET /api/customers/:id
// @access  Private (Admin)
exports.getCustomerDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const bookings = await Booking.find({ userId: user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      customer: user,
      bookings
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get customer details' });
  }
};

// @desc    Delete/Remove registered customer and clean up bookings & slots
// @route   DELETE /api/customers/:id
// @access  Private (Admin)
exports.deleteCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // 1. Find all bookings associated with this customer
    const userBookings = await Booking.find({ userId: user._id });

    // 2. Identify affected slot dates to synchronize capacity
    const affectedDates = new Set();
    userBookings.forEach((b) => {
      if (b.eventType && b.eventDate) {
        affectedDates.add(`${b.eventType}___${b.eventDate}`);
      }
    });

    // 3. Delete all customer bookings
    if (userBookings.length > 0) {
      await Booking.deleteMany({ userId: user._id });
    }

    // 4. Re-synchronize slot capacity for all affected dates
    for (const item of affectedDates) {
      const [eventType, eventDate] = item.split('___');
      const activeCount = await Booking.countDocuments({
        eventType,
        eventDate,
        status: { $in: ['Confirmed', 'Pending'] }
      });

      let slot = await Slot.findOne({ eventType, date: eventDate });
      if (slot) {
        let status = 'Available';
        if (activeCount >= slot.maxCapacity) {
          status = 'Fully Booked';
        } else if (activeCount === slot.maxCapacity - 1 && slot.maxCapacity > 1) {
          status = 'Limited';
        }
        slot.bookedCount = activeCount;
        slot.status = status;
        await slot.save();
      }
    }

    // 5. Delete customer user record
    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `Customer "${user.name}" has been permanently removed.`
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete customer'
    });
  }
};

