const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { adminProtect } = require('../middleware/adminAuth');

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', adminProtect, createService);
router.put('/:id', adminProtect, updateService);
router.delete('/:id', adminProtect, deleteService);

module.exports = router;
