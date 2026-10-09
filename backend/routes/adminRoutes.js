const express = require('express');
const router = express.Router();
const { adminLogin, getDashboardStats } = require('../controllers/adminController');
const { adminProtect } = require('../middleware/adminAuth');

router.post('/login', adminLogin);
router.get('/dashboard-stats', adminProtect, getDashboardStats);

module.exports = router;
