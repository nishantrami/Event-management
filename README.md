# EVENTORA — Luxury Event Management & Slot Booking Platform

A complete, production-ready full-stack Event Management & Turnkey Reservation platform built with **React.js, Node.js, Express.js, and MongoDB**.

---

## 🌟 Key Architecture & Features

### 1. Real-Time Slot Booking Engine & Double-Booking Prevention
- Real date-based capacity tracking stored in MongoDB.
- Maximum capacity rule per date (default 3 concurrent events).
- Server-side atomic capacity check: **Never relies solely on frontend validation**.
- When capacity is reached (`3 / 3 Booked`), the backend immediately rejects new bookings with `400 Bad Request: "Sorry, this date is fully booked."`
- Real-time date status indicators:
  - 🟢 **Available**: `0 / 3` or `1 / 3` booked.
  - 🟡 **Limited Slots**: `2 / 3` booked (1 slot remaining — fast filling).
  - 🔴 **Fully Booked**: `3 / 3` booked (Booking disabled with visual alert).

### 2. Demo Dates (Pre-Seeded in MongoDB)
- **17 October 2026**: 🔴 Fully Booked (3/3 Booked — Capacity Full, Booking Disabled)
- **18 October 2026**: 🟡 Limited Slots (2/3 Booked — 1 Slot Remaining)
- **19 October 2026**: 🟢 Available (0/3 Booked — 3 Slots Remaining)
- **20 October 2026**: 🟢 Available (1/3 Booked — 2 Slots Remaining)
- **24 October 2026**: 🔴 Fully Booked (3/3 Booked)

---

## 🔐 Credentials

### Admin Portal (Static Credentials)
- **Portal URL**: [http://127.0.0.1:5173/admin/login](http://127.0.0.1:5173/admin/login)
- **Email**: `admin@eventpro.com`
- **Password**: `Admin@123`
*(As requested, admin credentials are not stored in MongoDB and are verified with a 1-click Auto-Fill helper.)*

### Demo Customer Accounts (Stored in MongoDB with bcrypt)
- **Customer 1**: `rahul.sharma@example.com` / `password123`
- **Customer 2**: `priya.patel@example.com` / `password123`
- **Customer 3**: `amit.verma@example.com` / `password123`
*(Or click "Create Account" to register any new customer directly into MongoDB).*

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- MongoDB running on `mongodb://127.0.0.1:27017`

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populates MongoDB with demo events, services, packages, slots & users
node server.js   # Runs backend on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Runs Vite dev server on http://127.0.0.1:5173
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router 7, Framer Motion, Lucide Icons, Recharts, Canvas Confetti |
| **Backend** | Node.js, Express.js, Mongoose, JWT (jsonwebtoken), bcryptjs, Morgan, CORS |
| **Database** | MongoDB (Local replica/standalone) |
| **Styling** | Custom Vanilla CSS Design System with Premium White Aesthetic & Royal Violet/Gold accents |

---

## 📁 Project Structure

```
Event management/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin login, analytics stats & customers
│   │   ├── authController.js     # Customer register, login, JWT issuance
│   │   ├── bookingController.js  # Capacity lock, overbooking rejection, CRUD
│   │   ├── eventController.js    # Event categories
│   │   ├── packageController.js  # Basic, Standard, Premium packages
│   │   ├── preorderController.js # Pre-order add-ons catalog
│   │   ├── serviceController.js  # Services marketplace CRUD
│   │   └── slotController.js     # Real-time slot availability & calendar
│   ├── middleware/
│   │   ├── adminAuth.js          # Static admin JWT protection
│   │   └── auth.js               # Customer JWT protection
│   ├── models/
│   │   ├── Booking.js            # Booking schema with embedded calculations
│   │   ├── EventCategory.js      # Categories (Wedding, Birthday, etc.)
│   │   ├── Package.js            # Tiers (Basic, Standard, Premium)
│   │   ├── PreOrder.js           # Add-on treats (Cakes, bouquets, etc.)
│   │   ├── Service.js            # Services (Food, Mandap, Flowers, etc.)
│   │   ├── Slot.js               # Date-based capacity and live counts
│   │   └── User.js               # Customer accounts with bcrypt
│   ├── routes/                   # RESTful API route definitions
│   ├── .env                      # Environment variables
│   ├── seed.js                   # Comprehensive demo seeder
│   └── server.js                 # Main server entrypoint
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/            # Admin Layout, Dashboard, Slots, Bookings, Services, Customers
    │   │   ├── booking/          # DateSlotPicker, PackageSelector, ServiceSelector, PreOrderSelector, BookingSummaryCard
    │   │   ├── common/           # Navbar, Footer, CustomerAuthModal
    │   │   └── pages/            # Home, Events, Services, Packages, BookingFlow, Success, Dashboard, Login, Register
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Customer & Admin authentication state
    │   │   └── BookingContext.jsx# Live planner state, calculations & cart
    │   ├── layouts/
    │   │   └── MainLayout.jsx    # Public site layout
    │   ├── services/
    │   │   └── api.js            # Centralized API fetcher
    │   ├── styles/
    │   │   └── index.css         # Premium white CSS design system
    │   ├── App.jsx               # Routes setup
    │   └── main.jsx
    └── index.html
```

---

## 💎 Features Walkthrough

1. **Explore Events**:
   - 10 realistic categories: Wedding, Birthday Party, Engagement, Anniversary, Corporate, Religious, Baby Shower, Graduation, Reception, Other Special Events.
2. **Interactive Date Slot Checker**:
   - Quick date selector chips for immediate testing.
   - Live visual status badge: `🟢 Available`, `🟡 Limited Slots`, `🔴 Fully Booked`.
   - Capacity meter bar showing `booked / maxCapacity`.
   - Disables booking button if selected date is fully booked.
3. **Packages Comparison**:
   - **Basic Package**: ₹49,999 (Thematic decor, standard seating, food, sound).
   - **Standard Package** (⭐ Most Popular): ₹99,999 (Designer stage, premium food, floral arch, photography, lighting).
   - **Premium Package** (👑 Premium): ₹1,89,999 (Royal mandap, candid + 4K drone cinematography, live band, VIP seating, coordinators).
4. **Services Marketplace**:
   - Food & Catering: Gujarati, Punjabi, South Indian, Asian, Continental with interactive guest count slider. Total dynamically recalculates (e.g. `200 Guests * ₹350 = ₹70,000`).
   - Mandap & Stage: Traditional, Royal Palace, Floral Canopy, Minimalist, Reception Stages.
   - Flowers, Photography, Music & DJs, Lighting, Furniture, and Bridal Makeup.
5. **Pre-Order Items**:
   - Designer Wedding Cakes, Exotic Bouquets, Drink kegs, Gourmet dessert platters, and Return gifts with live item steppers.
6. **Cart & Booking Summary**:
   - Transparent itemized receipt showing Subtotal, Seasonal 5% Discount, Taxes (5% GST), and Grand Total.
7. **Customer Authentication**:
   - Customer login and registration stored in MongoDB with bcrypt hashing.
   - Includes 1-click test login buttons (`Rahul Sharma`, `Priya Patel`).
8. **Booking Success & Receipt**:
   - Confetti celebration, unique Booking ID (`EVT-...`), printable invoice, and direct link to My Bookings.
9. **Admin Panel**:
   - Separate executive portal with KPI cards, Recharts visualizations, bookings table, slot capacity regulator, services CRUD, and customer directory.
