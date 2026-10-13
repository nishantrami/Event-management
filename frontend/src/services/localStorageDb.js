import {
  INITIAL_USERS,
  INITIAL_EVENTS,
  INITIAL_PACKAGES,
  INITIAL_SERVICES,
  INITIAL_PREORDERS,
  INITIAL_SLOTS,
  INITIAL_BOOKINGS,
  STATIC_ADMIN
} from './initialData';

const STORAGE_KEYS = {
  USERS: 'eventora_users',
  EVENTS: 'eventora_events',
  PACKAGES: 'eventora_packages',
  SERVICES: 'eventora_services',
  PREORDERS: 'eventora_preorders',
  SLOTS: 'eventora_slots',
  BOOKINGS: 'eventora_bookings',
  INQUIRIES: 'eventora_inquiries',
  INITIALIZED: 'eventora_db_v1_initialized'
};

// Seed database on first visit or reset
export function initializeLocalStorage(forceReset = false) {
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_PACKAGES));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.PREORDERS, JSON.stringify(INITIAL_PREORDERS));
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(INITIAL_SLOTS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    console.log('✨ Eventora local database seeded successfully!');
  }
}

// Ensure database is initialized immediately
initializeLocalStorage();

// Generic helper to get data from localStorage
function getCollection(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

// Generic helper to set data in localStorage
function setCollection(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// Generate unique Mongo-like ObjectId string
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

// Database helper functions
export const db = {
  resetAll: () => {
    initializeLocalStorage(true);
  },

  // USERS
  getUsers: () => getCollection(STORAGE_KEYS.USERS, INITIAL_USERS),
  saveUsers: (users) => setCollection(STORAGE_KEYS.USERS, users),
  findUserById: (id) => getCollection(STORAGE_KEYS.USERS).find(u => u._id === id),
  findUserByEmail: (email) => getCollection(STORAGE_KEYS.USERS).find(u => u.email.toLowerCase() === email.toLowerCase().trim()),
  createUser: (userData) => {
    const users = getCollection(STORAGE_KEYS.USERS);
    const newUser = {
      _id: generateId('usr'),
      createdAt: new Date().toISOString(),
      ...userData
    };
    users.push(newUser);
    setCollection(STORAGE_KEYS.USERS, users);
    return newUser;
  },
  updateUser: (id, updateData) => {
    const users = getCollection(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u._id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updateData };
    setCollection(STORAGE_KEYS.USERS, users);
    return users[index];
  },
  deleteUser: (id) => {
    const users = getCollection(STORAGE_KEYS.USERS).filter(u => u._id !== id);
    setCollection(STORAGE_KEYS.USERS, users);
  },

  // EVENTS
  getEvents: () => getCollection(STORAGE_KEYS.EVENTS, INITIAL_EVENTS),
  findEventBySlugOrId: (slugOrId) => {
    const events = getCollection(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    return events.find(e => 
      e.slug?.toLowerCase() === slugOrId?.toLowerCase() || 
      e._id === slugOrId || 
      e.name?.toLowerCase() === slugOrId?.toLowerCase()
    );
  },

  // PACKAGES
  getPackages: () => getCollection(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES),
  createPackage: (pkgData) => {
    const pkgs = getCollection(STORAGE_KEYS.PACKAGES);
    const newPkg = { _id: generateId('pkg'), ...pkgData };
    pkgs.push(newPkg);
    setCollection(STORAGE_KEYS.PACKAGES, pkgs);
    return newPkg;
  },
  updatePackage: (id, updateData) => {
    const pkgs = getCollection(STORAGE_KEYS.PACKAGES);
    const index = pkgs.findIndex(p => p._id === id);
    if (index === -1) return null;
    pkgs[index] = { ...pkgs[index], ...updateData };
    setCollection(STORAGE_KEYS.PACKAGES, pkgs);
    return pkgs[index];
  },
  deletePackage: (id) => {
    const pkgs = getCollection(STORAGE_KEYS.PACKAGES).filter(p => p._id !== id);
    setCollection(STORAGE_KEYS.PACKAGES, pkgs);
  },

  // SERVICES
  getServices: () => getCollection(STORAGE_KEYS.SERVICES, INITIAL_SERVICES),
  createService: (serviceData) => {
    const services = getCollection(STORAGE_KEYS.SERVICES);
    const newService = { _id: generateId('srv'), availability: true, ...serviceData };
    services.push(newService);
    setCollection(STORAGE_KEYS.SERVICES, services);
    return newService;
  },
  updateService: (id, updateData) => {
    const services = getCollection(STORAGE_KEYS.SERVICES);
    const index = services.findIndex(s => s._id === id);
    if (index === -1) return null;
    services[index] = { ...services[index], ...updateData };
    setCollection(STORAGE_KEYS.SERVICES, services);
    return services[index];
  },
  deleteService: (id) => {
    const services = getCollection(STORAGE_KEYS.SERVICES).filter(s => s._id !== id);
    setCollection(STORAGE_KEYS.SERVICES, services);
  },

  // PRE-ORDERS
  getPreOrders: () => getCollection(STORAGE_KEYS.PREORDERS, INITIAL_PREORDERS),
  createPreOrder: (itemData) => {
    const items = getCollection(STORAGE_KEYS.PREORDERS);
    const newItem = { _id: generateId('pre'), availability: true, ...itemData };
    items.push(newItem);
    setCollection(STORAGE_KEYS.PREORDERS, items);
    return newItem;
  },
  updatePreOrder: (id, updateData) => {
    const items = getCollection(STORAGE_KEYS.PREORDERS);
    const index = items.findIndex(i => i._id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updateData };
    setCollection(STORAGE_KEYS.PREORDERS, items);
    return items[index];
  },
  deletePreOrder: (id) => {
    const items = getCollection(STORAGE_KEYS.PREORDERS).filter(i => i._id !== id);
    setCollection(STORAGE_KEYS.PREORDERS, items);
  },

  // SLOTS
  getSlots: () => getCollection(STORAGE_KEYS.SLOTS, INITIAL_SLOTS),
  saveSlots: (slots) => setCollection(STORAGE_KEYS.SLOTS, slots),
  findSlot: (eventType, date) => {
    const slots = getCollection(STORAGE_KEYS.SLOTS);
    return slots.find(s => s.eventType === eventType && s.date === date);
  },
  saveSlot: (slotData) => {
    const slots = getCollection(STORAGE_KEYS.SLOTS);
    const index = slots.findIndex(s => s.eventType === slotData.eventType && s.date === slotData.date);
    if (index >= 0) {
      slots[index] = { ...slots[index], ...slotData };
      setCollection(STORAGE_KEYS.SLOTS, slots);
      return slots[index];
    } else {
      const newSlot = { _id: generateId('slot'), ...slotData };
      slots.push(newSlot);
      setCollection(STORAGE_KEYS.SLOTS, slots);
      return newSlot;
    }
  },
  deleteSlotById: (id) => {
    const slots = getCollection(STORAGE_KEYS.SLOTS).filter(s => s._id !== id);
    setCollection(STORAGE_KEYS.SLOTS, slots);
  },

  // BOOKINGS
  getBookings: () => getCollection(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS),
  createBooking: (bookingData) => {
    const bookings = getCollection(STORAGE_KEYS.BOOKINGS);
    const newBooking = {
      _id: generateId('bkg'),
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      ...bookingData
    };
    bookings.unshift(newBooking);
    setCollection(STORAGE_KEYS.BOOKINGS, bookings);
    return newBooking;
  },
  updateBooking: (id, updateData) => {
    const bookings = getCollection(STORAGE_KEYS.BOOKINGS);
    const index = bookings.findIndex(b => b._id === id);
    if (index === -1) return null;
    bookings[index] = { ...bookings[index], ...updateData };
    setCollection(STORAGE_KEYS.BOOKINGS, bookings);
    return bookings[index];
  },
  deleteBookingById: (id) => {
    const bookings = getCollection(STORAGE_KEYS.BOOKINGS).filter(b => b._id !== id);
    setCollection(STORAGE_KEYS.BOOKINGS, bookings);
  },

  // CONTACT INQUIRIES
  getInquiries: () => getCollection(STORAGE_KEYS.INQUIRIES, []),
  createInquiry: (inquiryData) => {
    const inquiries = getCollection(STORAGE_KEYS.INQUIRIES, []);
    const newInquiry = {
      _id: generateId('inq'),
      referenceNumber: `EVT-INQ-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'Received',
      ...inquiryData
    };
    inquiries.unshift(newInquiry);
    setCollection(STORAGE_KEYS.INQUIRIES, inquiries);
    return newInquiry;
  }
};
