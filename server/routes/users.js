const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMyEvents } = require('../controllers/userController');

router.get('/my-events', auth, getMyEvents);

module.exports = router;
