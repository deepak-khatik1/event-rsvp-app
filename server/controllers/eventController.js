const Event = require('../models/Event');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'attendees.userId',
      'name email'
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const rsvpEvent = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Going', 'Maybe', 'Not Going'].includes(status)) {
      return res.status(400).json({ message: 'Invalid RSVP status' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingIndex = event.attendees.findIndex(
      (a) => a.userId.toString() === req.user.id
    );

    if (status === 'Going') {
      const goingCount = event.attendees.filter(
        (a) => a.status === 'Going' && a.userId.toString() !== req.user.id
      ).length;
      if (goingCount >= event.capacity) {
        return res.status(400).json({ message: 'Event is at full capacity' });
      }
    }

    if (existingIndex > -1) {
      event.attendees[existingIndex].status = status;
    } else {
      event.attendees.push({ userId: req.user.id, status });
    }

    await event.save();

    const updatedEvent = await Event.findById(event._id).populate(
      'attendees.userId',
      'name email'
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`event:${event._id}`).emit('rsvp-updated', {
        eventId: event._id,
        attendees: updatedEvent.attendees,
      });
      io.to('admin:events').emit('attendee-update', {
        eventId: event._id,
        attendees: updatedEvent.attendees,
      });
    }

    res.json({ message: 'RSVP updated', event: updatedEvent });
  } catch (err) {
    console.error('RSVP error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllEvents, getEvent, rsvpEvent };
