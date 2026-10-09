const Service = require('../models/Service');

// @desc    Get all services (supports filtering by category)
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { availability: true };

    // If admin is requesting, allow showing all availability
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

    const services = await Service.find(query).sort({ category: 1, price: 1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({ success: true, service });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving service' });
  }
};

// @desc    Create a new service (Admin)
// @route   POST /api/services
// @access  Private (Admin)
exports.createService = async (req, res) => {
  try {
    const { name, category, description, price, pricingUnit, image, availability } = req.body;

    if (!name || !category || !description || price === undefined || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required service fields (name, category, description, price, image)'
      });
    }

    const service = await Service.create({
      name,
      category,
      description,
      price: Number(price),
      pricingUnit: pricingUnit || 'fixed',
      image,
      availability: availability !== undefined ? availability : true
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create service'
    });
  }
};

// @desc    Update service (Admin)
// @route   PUT /api/services/:id
// @access  Private (Admin)
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update service'
    });
  }
};

// @desc    Delete service (Admin)
// @route   DELETE /api/services/:id
// @access  Private (Admin)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
};
