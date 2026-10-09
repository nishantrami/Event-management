const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerDetails, deleteCustomer } = require('../controllers/adminController');
const { adminProtect } = require('../middleware/adminAuth');

router.get('/', adminProtect, getCustomers);
router.get('/:id', adminProtect, getCustomerDetails);
router.delete('/:id', adminProtect, deleteCustomer);

module.exports = router;
