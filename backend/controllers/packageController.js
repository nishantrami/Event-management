const Package = require('../models/Package');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ price: 1 });
    return res.status(200).json({
      success: true,
      count: packages.length,
      packages
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch packages'
    });
  }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    return res.status(200).json({ success: true, package: pkg });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving package' });
  }
};

// @desc    Create package (Admin)
// @route   POST /api/packages
// @access  Private (Admin)
exports.createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package: pkg
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create package'
    });
  }
};

// @desc    Update package (Admin)
// @route   PUT /api/packages/:id
// @access  Private (Admin)
exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      package: pkg
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update package'
    });
  }
};

// @desc    Delete package (Admin)
// @route   DELETE /api/packages/:id
// @access  Private (Admin)
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete package'
    });
  }
};
