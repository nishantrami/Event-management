const API_BASE_URL = 'http://localhost:5000/api';

// Helper for making requests with auth tokens
async function request(endpoint, options = {}) {
  const customerToken = localStorage.getItem('eventora_customer_token');
  const adminToken = localStorage.getItem('eventora_admin_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Determine token: if admin route or specified, use admin token; else customer token
  if (options.isAdmin && adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  } else if (customerToken) {
    headers['Authorization'] = `Bearer ${customerToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth API
  customerRegister: (userData) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  customerLogin: (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  getCustomerProfile: () =>
    request('/auth/me'),

  updateCustomerProfile: (profileData) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Admin Auth & Analytics
  adminLogin: (credentials) =>
    request('/admin/login', { method: 'POST', body: JSON.stringify(credentials) }),

  getAdminDashboardStats: () =>
    request('/admin/dashboard-stats', { isAdmin: true }),

  getAdminCustomers: (search = '') =>
    request(`/customers?search=${encodeURIComponent(search)}`, { isAdmin: true }),

  getAdminCustomerDetails: (id) =>
    request(`/customers/${id}`, { isAdmin: true }),

  deleteCustomer: (id) =>
    request(`/customers/${id}`, { method: 'DELETE', isAdmin: true }),

  // Events API
  getEvents: (search = '') =>
    request(`/events?search=${encodeURIComponent(search)}`),

  getEventBySlugOrId: (slugOrId) =>
    request(`/events/${slugOrId}`),

  // Packages API
  getPackages: () =>
    request('/packages'),

  createPackage: (pkgData) =>
    request('/packages', { method: 'POST', body: JSON.stringify(pkgData), isAdmin: true }),

  updatePackage: (id, pkgData) =>
    request(`/packages/${id}`, { method: 'PUT', body: JSON.stringify(pkgData), isAdmin: true }),

  deletePackage: (id) =>
    request(`/packages/${id}`, { method: 'DELETE', isAdmin: true }),

  // Services API
  getServices: (category = 'All', search = '', isAdminView = false) => {
    const query = new URLSearchParams();
    if (category && category !== 'All') query.append('category', category);
    if (search) query.append('search', search);
    const headers = isAdminView ? { 'x-admin-request': 'true' } : {};
    return request(`/services?${query.toString()}`, { headers, isAdmin: isAdminView });
  },

  createService: (serviceData) =>
    request('/services', { method: 'POST', body: JSON.stringify(serviceData), isAdmin: true }),

  updateService: (id, serviceData) =>
    request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(serviceData), isAdmin: true }),

  deleteService: (id) =>
    request(`/services/${id}`, { method: 'DELETE', isAdmin: true }),

  // Pre-Orders API
  getPreOrders: (category = 'All', search = '', isAdminView = false) => {
    const query = new URLSearchParams();
    if (category && category !== 'All') query.append('category', category);
    if (search) query.append('search', search);
    const headers = isAdminView ? { 'x-admin-request': 'true' } : {};
    return request(`/preorders?${query.toString()}`, { headers, isAdmin: isAdminView });
  },

  createPreOrder: (itemData) =>
    request('/preorders', { method: 'POST', body: JSON.stringify(itemData), isAdmin: true }),

  updatePreOrder: (id, itemData) =>
    request(`/preorders/${id}`, { method: 'PUT', body: JSON.stringify(itemData), isAdmin: true }),

  deletePreOrder: (id) =>
    request(`/preorders/${id}`, { method: 'DELETE', isAdmin: true }),

  // Slots & Availability API (CRITICAL CORE LOGIC)
  checkSlotAvailability: (eventType, date) =>
    request(`/slots/availability?eventType=${encodeURIComponent(eventType)}&date=${encodeURIComponent(date)}`),

  getCalendarSlots: (eventType, month) =>
    request(`/slots/calendar?eventType=${encodeURIComponent(eventType || '')}&month=${encodeURIComponent(month || '')}`),

  getSlotStats: () =>
    request('/slots/stats', { isAdmin: true }),

  getSlotBookings: (slotId) =>
    request(`/slots/${slotId}/bookings`, { isAdmin: true }),

  getAllSlots: (params = {}, maybeStatus = '', maybeSearch = '') => {
    const query = new URLSearchParams();
    if (typeof params === 'string') {
      if (params) query.append('eventType', params);
      if (maybeStatus) query.append('status', maybeStatus);
      if (maybeSearch) query.append('search', maybeSearch);
    } else {
      if (params.eventType) query.append('eventType', params.eventType);
      if (params.status) query.append('status', params.status);
      if (params.search) query.append('search', params.search);
      if (params.startDate) query.append('startDate', params.startDate);
      if (params.endDate) query.append('endDate', params.endDate);
    }
    return request(`/slots?${query.toString()}`, { isAdmin: true });
  },

  setSlotCapacity: (slotData) =>
    request('/slots', { method: 'POST', body: JSON.stringify(slotData), isAdmin: true }),

  bulkSetSlotCapacity: (bulkData) =>
    request('/slots/bulk', { method: 'POST', body: JSON.stringify(bulkData), isAdmin: true }),

  deleteSlot: (slotId) =>
    request(`/slots/${slotId}`, { method: 'DELETE', isAdmin: true }),

  // Bookings API
  createBooking: (bookingData) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),

  getMyBookings: () =>
    request('/bookings/my'),

  getBookingById: (id) =>
    request(`/bookings/${id}`),

  getAllBookings: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.eventType) query.append('eventType', params.eventType);
    if (params.date) query.append('date', params.date);
    if (params.search) query.append('search', params.search);
    return request(`/bookings?${query.toString()}`, { isAdmin: true });
  },

  updateBookingStatus: (id, status) =>
    request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }), isAdmin: true }),

  deleteBooking: (id) =>
    request(`/bookings/${id}`, { method: 'DELETE', isAdmin: true })
};
