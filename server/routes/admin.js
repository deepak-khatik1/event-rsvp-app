const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAttendees,
} = require('../controllers/adminController');

router.post('/events', auth, admin, upload.single('image'), createEvent);
router.put('/events/:id', auth, admin, upload.single('image'), updateEvent);
router.delete('/events/:id', auth, admin, deleteEvent);
router.get('/events/:id/attendees', auth, admin, getAttendees);

module.exports = router;
