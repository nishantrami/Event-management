const express = require('express');
const router = express.Router();
const {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packageController');
const { adminProtect } = require('../middleware/adminAuth');

router.get('/', getPackages);
router.get('/:id', getPackageById);
router.post('/', adminProtect, createPackage);
router.put('/:id', adminProtect, updatePackage);
router.delete('/:id', adminProtect, deletePackage);

module.exports = router;
