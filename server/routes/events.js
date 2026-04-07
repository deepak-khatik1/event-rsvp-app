const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllEvents,
  getEvent,
  rsvpEvent,
} = require('../controllers/eventController');

router.get('/', auth, getAllEvents);
router.get('/:id', auth, getEvent);
router.post('/:id/rsvp', auth, rsvpEvent);

module.exports = router;
