const PreOrder = require('../models/PreOrder');

// @desc    Get all pre-order items
// @route   GET /api/preorders
// @access  Public
exports.getPreOrders = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { availability: true };

    if (req.headers['x-admin-request']) {
      query = {};
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await PreOrder.find(query).sort({ price: 1 });
    return res.status(200).json({
      success: true,
      count: items.length,
      preOrders: items
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pre-orders'
    });
  }
};

// @desc    Create pre-order item (Admin)
// @route   POST /api/preorders
// @access  Private (Admin)
exports.createPreOrder = async (req, res) => {
  try {
    const item = await PreOrder.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Pre-order item created successfully',
      preOrder: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create pre-order item'
    });
  }
};

// @desc    Update pre-order item (Admin)
// @route   PUT /api/preorders/:id
// @access  Private (Admin)
exports.updatePreOrder = async (req, res) => {
  try {
    const item = await PreOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Pre-order item updated successfully',
      preOrder: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update pre-order item'
    });
  }
};

// @desc    Delete pre-order item (Admin)
// @route   DELETE /api/preorders/:id
// @access  Private (Admin)
exports.deletePreOrder = async (req, res) => {
  try {
    const item = await PreOrder.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Pre-order item deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete pre-order item'
    });
  }
};
