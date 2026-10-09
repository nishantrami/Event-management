const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Route Mounts
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/preorders', require('./routes/preorderRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Eventora API'
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Eventora Event Management System API is running smoothly.');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found - ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Eventora Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
