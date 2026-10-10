import { db } from './localStorageDb';
import { STATIC_ADMIN } from './initialData';

const DEFAULT_CAPACITY = 3;

// Helper to calculate slot status string
function calculateSlotStatus(bookedCount, maxCapacity, isBlocked = false) {
  if (isBlocked) return 'Blocked';
  if (bookedCount >= maxCapacity) return 'Fully Booked';
  if (bookedCount === maxCapacity - 1 && maxCapacity > 1) return 'Limited';
  return 'Available';
}

// Helper to synchronize slot status with real bookings in localStorage
function syncSlot(eventType, date) {
  const allBookings = db.getBookings();
  const activeBookings = allBookings.filter(b => 
    b.eventType === eventType && 
    b.eventDate === date && 
    (b.status === 'Confirmed' || b.status === 'Pending')
  );

  const existingSlot = db.findSlot(eventType, date);
  const maxCapacity = existingSlot ? existingSlot.maxCapacity : DEFAULT_CAPACITY;
  const isBlocked = existingSlot ? Boolean(existingSlot.isBlocked) : false;
  const notes = existingSlot ? (existingSlot.notes || '') : '';
  const bookedCount = activeBookings.length;
  const status = calculateSlotStatus(bookedCount, maxCapacity, isBlocked);
  const remainingSlots = isBlocked ? 0 : Math.max(0, maxCapacity - bookedCount);

  const updatedSlot = db.saveSlot({
    ...(existingSlot || {}),
    eventType,
    date,
    maxCapacity,
    bookedCount,
    status,
    isBlocked,
    notes
  });

  return {
    ...updatedSlot,
    remainingSlots,
    isAvailable: !isBlocked && remainingSlots > 0
  };
}

// Simulate realistic micro-async delay
const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth API
  customerRegister: async (userData) => {
    await delay();
    const existing = db.findUserByEmail(userData.email);
    if (existing) {
      const error = new Error('An account with this email already exists');
      error.status = 400;
      throw error;
    }

    const newUser = db.createUser({
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      password: userData.password
    });

    const token = `mock_token_cust_${newUser._id}`;
    localStorage.setItem('eventora_customer_token', token);
    localStorage.setItem('eventora_customer_user', JSON.stringify(newUser));

    return {
      success: true,
      message: 'Registration successful! Welcome to Eventora.',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }
    };
  },

  customerLogin: async (credentials) => {
    await delay();
    const { email, password } = credentials;
    const user = db.findUserByEmail(email);

    if (!user || user.password !== password) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    const token = `mock_token_cust_${user._id}`;
    localStorage.setItem('eventora_customer_token', token);
    localStorage.setItem('eventora_customer_user', JSON.stringify(user));

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    };
  },

  getCustomerProfile: async () => {
    await delay();
    const rawUser = localStorage.getItem('eventora_customer_user');
    if (!rawUser) {
      const error = new Error('Not authenticated');
      error.status = 401;
      throw error;
    }
    const user = JSON.parse(rawUser);
    const freshUser = db.findUserById(user._id) || user;
    return {
      success: true,
      user: {
        _id: freshUser._id,
        name: freshUser.name,
        email: freshUser.email,
        phone: freshUser.phone
      }
    };
  },

  updateCustomerProfile: async (profileData) => {
    await delay();
    const rawUser = localStorage.getItem('eventora_customer_user');
    if (!rawUser) {
      const error = new Error('Not authenticated');
      error.status = 401;
      throw error;
    }
    const user = JSON.parse(rawUser);
    const updated = db.updateUser(user._id, profileData);
    localStorage.setItem('eventora_customer_user', JSON.stringify(updated));
    return {
      success: true,
      message: 'Profile updated successfully',
      user: updated
    };
  },

  // Admin Auth & Analytics
  adminLogin: async (credentials) => {
    await delay();
    const { email, password } = credentials;

    if (email?.trim().toLowerCase() !== STATIC_ADMIN.email.toLowerCase() || password !== STATIC_ADMIN.password) {
      const error = new Error('Invalid admin credentials. Use admin@eventpro.com / Admin@123');
      error.status = 401;
      throw error;
    }

    const token = 'mock_admin_token_2026';
    localStorage.setItem('eventora_admin_token', token);

    return {
      success: true,
      message: 'Admin authenticated successfully',
      token,
      admin: {
        email: STATIC_ADMIN.email,
        name: STATIC_ADMIN.name,
        role: 'admin'
      }
    };
  },

  getAdminDashboardStats: async () => {
    await delay();
    const customers = db.getUsers();
    const bookings = db.getBookings();
    const slots = db.getSlots();

    const confirmedOrCompleted = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed');
    const totalRevenue = confirmedOrCompleted.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
    const todayStr = new Date().toISOString().split('T')[0];

    const upcomingEvents = bookings.filter(b => 
      b.eventDate >= todayStr && (b.status === 'Confirmed' || b.status === 'Pending')
    ).length;

    const todaysBookings = bookings.filter(b => {
      const created = b.createdAt ? b.createdAt.split('T')[0] : '';
      return created === todayStr;
    }).length;

    const fullyBookedSlots = slots.filter(s => s.status === 'Fully Booked').length;
    const availableSlots = slots.filter(s => s.status === 'Available').length;
    const limitedSlots = slots.filter(s => s.status === 'Limited').length;

    // Monthly trends
    const monthMap = {};
    bookings.forEach(b => {
      const m = b.eventDate ? b.eventDate.substring(0, 7) : '2026-10';
      if (!monthMap[m]) monthMap[m] = { month: m, bookings: 0, revenue: 0 };
      monthMap[m].bookings += 1;
      if (b.status !== 'Cancelled') {
        monthMap[m].revenue += (Number(b.totalAmount) || 0);
      }
    });
    const monthlyStats = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));

    // Category Distribution
    const catMap = {};
    bookings.forEach(b => {
      const cat = b.eventType || 'Other';
      if (!catMap[cat]) catMap[cat] = { name: cat, value: 0, revenue: 0 };
      catMap[cat].value += 1;
      catMap[cat].revenue += (Number(b.totalAmount) || 0);
    });
    const categoryDistribution = Object.values(catMap);

    // Package Popularity
    const pkgMap = {};
    bookings.forEach(b => {
      const pName = (b.package && b.package.name) ? b.package.name : 'Standard';
      if (!pkgMap[pName]) pkgMap[pName] = { name: pName, value: 0, revenue: 0 };
      pkgMap[pName].value += 1;
      pkgMap[pName].revenue += (Number(b.totalAmount) || 0);
    });
    const packagePopularity = Object.values(pkgMap);

    return {
      success: true,
      stats: {
        totalCustomers: customers.length,
        totalBookings: bookings.length,
        totalRevenue,
        upcomingEvents,
        todaysBookings,
        fullyBookedSlots,
        availableSlots,
        limitedSlots
      },
      charts: {
        monthly: monthlyStats.length ? monthlyStats : [{ month: '2026-10', bookings: bookings.length, revenue: totalRevenue }],
        categoryDistribution,
        packagePopularity
      },
      recentBookings: bookings.slice(0, 5)
    };
  },

  getAdminCustomers: async (search = '') => {
    await delay();
    let users = db.getUsers();
    if (search) {
      const s = search.toLowerCase();
      users = users.filter(u => 
        u.name?.toLowerCase().includes(s) || 
        u.email?.toLowerCase().includes(s) || 
        u.phone?.includes(s)
      );
    }

    const allBookings = db.getBookings();
    const customersWithStats = users.map(user => {
      const userBookings = allBookings.filter(b => b.userId === user._id || b.customer?.email === user.email);
      const totalSpent = userBookings.reduce((sum, b) => b.status !== 'Cancelled' ? sum + (Number(b.totalAmount) || 0) : sum, 0);
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        totalBookings: userBookings.length,
        totalSpent,
        lastBooking: userBookings.length > 0 ? userBookings[0].eventDate : null,
        status: 'Active'
      };
    });

    return {
      success: true,
      count: customersWithStats.length,
      customers: customersWithStats
    };
  },

  getAdminCustomerDetails: async (id) => {
    await delay();
    const user = db.findUserById(id);
    if (!user) {
      const error = new Error('Customer not found');
      error.status = 404;
      throw error;
    }
    const bookings = db.getBookings().filter(b => b.userId === id || b.customer?.email === user.email);
    return {
      success: true,
      customer: user,
      bookings
    };
  },

  deleteCustomer: async (id) => {
    await delay();
    db.deleteUser(id);
    return { success: true, message: 'Customer deleted successfully' };
  },

  // Events API
  getEvents: async (search = '') => {
    await delay();
    let events = db.getEvents();
    if (search) {
      const s = search.toLowerCase();
      events = events.filter(e => 
        e.name?.toLowerCase().includes(s) || 
        e.description?.toLowerCase().includes(s) || 
        e.tagline?.toLowerCase().includes(s)
      );
    }
    return {
      success: true,
      count: events.length,
      events,
      data: events
    };
  },

  getEventBySlugOrId: async (slugOrId) => {
    await delay();
    const event = db.findEventBySlugOrId(slugOrId);
    if (!event) {
      const error = new Error('Event category not found');
      error.status = 404;
      throw error;
    }
    return {
      success: true,
      event,
      data: event
    };
  },

  // Packages API
  getPackages: async () => {
    await delay();
    const packages = db.getPackages();
    return {
      success: true,
      count: packages.length,
      packages,
      data: packages
    };
  },

  createPackage: async (pkgData) => {
    await delay();
    const created = db.createPackage(pkgData);
    return {
      success: true,
      message: 'Package created successfully',
      package: created,
      data: created
    };
  },

  updatePackage: async (id, pkgData) => {
    await delay();
    const updated = db.updatePackage(id, pkgData);
    return {
      success: true,
      message: 'Package updated successfully',
      package: updated,
      data: updated
    };
  },

  deletePackage: async (id) => {
    await delay();
    db.deletePackage(id);
    return {
      success: true,
      message: 'Package deleted successfully'
    };
  },

  // Services API
  getServices: async (category = 'All', search = '', isAdminView = false) => {
    await delay();
    let services = db.getServices();
    if (!isAdminView) {
      services = services.filter(s => s.availability !== false);
    }
    if (category && category !== 'All') {
      services = services.filter(s => s.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      services = services.filter(s => 
        s.name?.toLowerCase().includes(s) || 
        s.description?.toLowerCase().includes(s)
      );
    }
    return {
      success: true,
      count: services.length,
      services,
      data: services
    };
  },

  createService: async (serviceData) => {
    await delay();
    const created = db.createService(serviceData);
    return {
      success: true,
      message: 'Service created successfully',
      service: created,
      data: created
    };
  },

  updateService: async (id, serviceData) => {
    await delay();
    const updated = db.updateService(id, serviceData);
    return {
      success: true,
      message: 'Service updated successfully',
      service: updated,
      data: updated
    };
  },

  deleteService: async (id) => {
    await delay();
    db.deleteService(id);
    return {
      success: true,
      message: 'Service deleted successfully'
    };
  },

  // Pre-Orders API
  getPreOrders: async (category = 'All', search = '', isAdminView = false) => {
    await delay();
    let items = db.getPreOrders();
    if (!isAdminView) {
      items = items.filter(i => i.availability !== false);
    }
    if (category && category !== 'All') {
      items = items.filter(i => i.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(i => 
        i.name?.toLowerCase().includes(s) || 
        i.description?.toLowerCase().includes(s)
      );
    }
    return {
      success: true,
      count: items.length,
      preOrders: items,
      data: items
    };
  },

  createPreOrder: async (itemData) => {
    await delay();
    const created = db.createPreOrder(itemData);
    return {
      success: true,
      message: 'Pre-order item created successfully',
      preOrder: created,
      data: created
    };
  },

  updatePreOrder: async (id, itemData) => {
    await delay();
    const updated = db.updatePreOrder(id, itemData);
    return {
      success: true,
      message: 'Pre-order item updated successfully',
      preOrder: updated,
      data: updated
    };
  },

  deletePreOrder: async (id) => {
    await delay();
    db.deletePreOrder(id);
    return {
      success: true,
      message: 'Pre-order item deleted successfully'
    };
  },

  // Slots & Availability API
  checkSlotAvailability: async (eventType, date) => {
    await delay();
    if (!eventType || !date) {
      const error = new Error('Please provide eventType and date');
      error.status = 400;
      throw error;
    }
    const slotData = syncSlot(eventType, date);
    return {
      success: true,
      data: slotData
    };
  },

  getCalendarSlots: async (eventType, month) => {
    await delay();
    let slots = db.getSlots();
    if (eventType && eventType !== 'All') {
      slots = slots.filter(s => s.eventType === eventType);
    }
    if (month) {
      slots = slots.filter(s => s.date?.startsWith(month));
    }
    return {
      success: true,
      count: slots.length,
      slots,
      data: slots
    };
  },

  getSlotStats: async () => {
    await delay();
    const slots = db.getSlots();
    const fullyBooked = slots.filter(s => s.status === 'Fully Booked').length;
    const limited = slots.filter(s => s.status === 'Limited').length;
    const available = slots.filter(s => s.status === 'Available').length;
    const blocked = slots.filter(s => s.status === 'Blocked' || s.isBlocked).length;
    return {
      success: true,
      stats: {
        total: slots.length,
        fullyBooked,
        limited,
        available,
        blocked
      }
    };
  },

  getSlotBookings: async (slotId) => {
    await delay();
    const slot = db.getSlots().find(s => s._id === slotId);
    if (!slot) return { success: true, bookings: [] };
    const bookings = db.getBookings().filter(b => b.eventType === slot.eventType && b.eventDate === slot.date);
    return {
      success: true,
      slot,
      bookings
    };
  },

  getAllSlots: async (params = {}, maybeStatus = '', maybeSearch = '') => {
    await delay();
    let slots = db.getSlots();
    let eventType = typeof params === 'string' ? params : params.eventType;
    let status = typeof params === 'string' ? maybeStatus : params.status;
    let search = typeof params === 'string' ? maybeSearch : params.search;

    if (eventType && eventType !== 'All') {
      slots = slots.filter(s => s.eventType === eventType);
    }
    if (status && status !== 'All') {
      slots = slots.filter(s => s.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      slots = slots.filter(slot => 
        slot.eventType?.toLowerCase().includes(s) || 
        slot.date?.includes(s) ||
        slot.notes?.toLowerCase().includes(s)
      );
    }

    return {
      success: true,
      count: slots.length,
      slots,
      data: slots
    };
  },

  setSlotCapacity: async (slotData) => {
    await delay();
    const { eventType, date, maxCapacity, isBlocked, notes } = slotData;
    const slot = db.saveSlot({
      eventType,
      date,
      maxCapacity: Number(maxCapacity) || DEFAULT_CAPACITY,
      isBlocked: Boolean(isBlocked),
      notes: notes || ''
    });
    const synced = syncSlot(eventType, date);
    return {
      success: true,
      message: 'Slot updated successfully',
      slot: synced
    };
  },

  bulkSetSlotCapacity: async (bulkData) => {
    await delay();
    const { eventTypes = [], dates = [], maxCapacity = 3, isBlocked = false, notes = '' } = bulkData;
    for (const et of eventTypes) {
      for (const d of dates) {
        db.saveSlot({
          eventType: et,
          date: d,
          maxCapacity: Number(maxCapacity),
          isBlocked: Boolean(isBlocked),
          notes: notes || ''
        });
        syncSlot(et, d);
      }
    }
    return {
      success: true,
      message: `Bulk updated slots for ${eventTypes.length} categories across ${dates.length} dates.`
    };
  },

  deleteSlot: async (slotId) => {
    await delay();
    db.deleteSlotById(slotId);
    return {
      success: true,
      message: 'Slot configuration reset to default'
    };
  },

  // Bookings API
  createBooking: async (bookingData) => {
    await delay();
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
    } = bookingData;

    if (!eventType || !eventDate || !selectedPackage || !totalAmount) {
      const error = new Error('Missing required booking details');
      error.status = 400;
      throw error;
    }

    // Verify slot capacity
    const slotInfo = syncSlot(eventType, eventDate);
    if (slotInfo.isBlocked) {
      const error = new Error(slotInfo.notes ? `Date unavailable: ${slotInfo.notes}` : 'This date is currently blocked.');
      error.status = 400;
      throw error;
    }

    if (slotInfo.bookedCount >= slotInfo.maxCapacity) {
      const error = new Error('Sorry, this date is already fully booked for this event type.');
      error.status = 400;
      throw error;
    }

    // Get current customer if logged in
    let userId = null;
    try {
      const rawUser = localStorage.getItem('eventora_customer_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        userId = u._id;
      }
    } catch (e) {}

    const newBooking = db.createBooking({
      userId,
      customer: customer || {
        name: 'Guest Customer',
        email: 'guest@example.com',
        phone: '+91 90000 00000'
      },
      eventType,
      eventDate,
      package: selectedPackage,
      services,
      preOrders,
      guestCount: Number(guestCount) || 100,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      taxes: Number(taxes) || 0,
      totalAmount: Number(totalAmount),
      specialRequests: specialRequests || '',
      status: 'Confirmed'
    });

    // Re-sync slot with new booking
    syncSlot(eventType, eventDate);

    return {
      success: true,
      message: '🎉 Booking created successfully! Your slot has been reserved.',
      booking: newBooking,
      data: newBooking
    };
  },

  getMyBookings: async () => {
    await delay();
    let userId = null;
    let userEmail = null;
    try {
      const rawUser = localStorage.getItem('eventora_customer_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        userId = u._id;
        userEmail = u.email;
      }
    } catch (e) {}

    const allBookings = db.getBookings();
    const myBookings = allBookings.filter(b => 
      (userId && b.userId === userId) || 
      (userEmail && b.customer?.email?.toLowerCase() === userEmail.toLowerCase())
    );

    return {
      success: true,
      count: myBookings.length,
      bookings: myBookings,
      data: myBookings
    };
  },

  getBookingById: async (id) => {
    await delay();
    const booking = db.getBookings().find(b => b._id === id);
    if (!booking) {
      const error = new Error('Booking not found');
      error.status = 404;
      throw error;
    }
    return {
      success: true,
      booking,
      data: booking
    };
  },

  getAllBookings: async (params = {}) => {
    await delay();
    let bookings = db.getBookings();
    if (params.status && params.status !== 'All') {
      bookings = bookings.filter(b => b.status === params.status);
    }
    if (params.eventType && params.eventType !== 'All') {
      bookings = bookings.filter(b => b.eventType === params.eventType);
    }
    if (params.date) {
      bookings = bookings.filter(b => b.eventDate === params.date);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      bookings = bookings.filter(b => 
        b.customer?.name?.toLowerCase().includes(s) || 
        b.customer?.email?.toLowerCase().includes(s) || 
        b.customer?.phone?.includes(s) ||
        b.eventType?.toLowerCase().includes(s) ||
        b._id?.toLowerCase().includes(s)
      );
    }

    return {
      success: true,
      count: bookings.length,
      bookings,
      data: bookings
    };
  },

  updateBookingStatus: async (id, status) => {
    await delay();
    const updated = db.updateBooking(id, { status });
    if (!updated) {
      const error = new Error('Booking not found');
      error.status = 404;
      throw error;
    }
    // Re-sync slot
    if (updated.eventType && updated.eventDate) {
      syncSlot(updated.eventType, updated.eventDate);
    }
    return {
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updated,
      data: updated
    };
  },

  deleteBooking: async (id) => {
    await delay();
    const booking = db.getBookings().find(b => b._id === id);
    db.deleteBookingById(id);
    if (booking?.eventType && booking?.eventDate) {
      syncSlot(booking.eventType, booking.eventDate);
    }
    return {
      success: true,
      message: 'Booking deleted successfully'
    };
  }
};
