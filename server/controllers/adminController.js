const Event = require('../models/Event');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, capacity } = req.body;

    if (!title || !description || !date || !venue || !capacity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const eventData = { title, description, date, venue, capacity };
    if (req.file) {
      eventData.image = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create(eventData);

    const io = req.app.get('io');
    if (io) {
      io.to('admin:events').emit('event-created', event);
    }

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const io = req.app.get('io');
    if (io) {
      io.to('admin:events').emit('event-updated', event);
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const io = req.app.get('io');
    if (io) {
      io.to('admin:events').emit('event-deleted', { eventId: req.params.id });
    }

    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'attendees.userId',
      'name email'
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event.attendees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createEvent, updateEvent, deleteEvent, getAttendees };
