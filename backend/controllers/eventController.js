const EventCategory = require('../models/EventCategory');

// @desc    Get all event categories
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } }
      ];
    }
    const events = await EventCategory.find(query).sort({ popular: -1, startingPrice: 1 });
    return res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch event categories'
    });
  }
};

// @desc    Get single event category by slug or ID
// @route   GET /api/events/:slugOrId
// @access  Public
exports.getEventBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let event = await EventCategory.findOne({
      $or: [
        { slug: slugOrId.toLowerCase() },
        { name: new RegExp(`^${slugOrId}$`, 'i') }
      ]
    });

    if (!event && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      event = await EventCategory.findById(slugOrId);
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event category not found' });
    }

    return res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve event'
    });
  }
};
