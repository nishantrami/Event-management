const express = require('express');
const router = express.Router();
const { getEvents, getEventBySlugOrId } = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/:slugOrId', getEventBySlugOrId);

module.exports = router;
