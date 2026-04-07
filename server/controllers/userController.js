const Event = require('../models/Event');

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ 'attendees.userId': req.user.id }).sort({
      date: 1,
    });

    const eventsWithStatus = events.map((event) => {
      const attendee = event.attendees.find(
        (a) => a.userId.toString() === req.user.id
      );
      return {
        ...event.toObject(),
        myStatus: attendee ? attendee.status : null,
      };
    });

    res.json(eventsWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMyEvents };
