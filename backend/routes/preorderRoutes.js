const express = require('express');
const router = express.Router();
const {
  getPreOrders,
  createPreOrder,
  updatePreOrder,
  deletePreOrder
} = require('../controllers/preorderController');
const { adminProtect } = require('../middleware/adminAuth');

router.get('/', getPreOrders);
router.post('/', adminProtect, createPreOrder);
router.put('/:id', adminProtect, updatePreOrder);
router.delete('/:id', adminProtect, deletePreOrder);

module.exports = router;
