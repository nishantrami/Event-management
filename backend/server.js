const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().catch(err => {
  console.warn('Initial DB connection failed:', err.message);
});

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Auto-reconnect DB middleware for serverless requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    if (req.path === '/api/health' || req.path === '/health' || req.path === '/') {
      return next();
    }
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Please ensure MONGO_URI is configured in Vercel environment variables.',
      error: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
  }
});

// Setup API routes
const apiRouter = express.Router();
apiRouter.use('/auth', require('./routes/authRoutes'));
apiRouter.use('/admin', require('./routes/adminRoutes'));
apiRouter.use('/events', require('./routes/eventRoutes'));
apiRouter.use('/services', require('./routes/serviceRoutes'));
apiRouter.use('/packages', require('./routes/packageRoutes'));
apiRouter.use('/slots', require('./routes/slotRoutes'));
apiRouter.use('/bookings', require('./routes/bookingRoutes'));
apiRouter.use('/preorders', require('./routes/preorderRoutes'));
apiRouter.use('/customers', require('./routes/customerRoutes'));

// Mount both with /api prefix and without to handle all reverse proxy / rewrite scenarios
app.use('/api', apiRouter);
app.use(apiRouter);

// Health check
app.get(['/api/health', '/health'], (req, res) => {
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
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Eventora Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
