import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { joinAdmin, leaveAdmin, getSocket, connectSocket } from '../services/socket';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create/Edit form state
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    capacity: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Attendee viewer
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Socket.IO real-time integration
  useEffect(() => {
    connectSocket();
    joinAdmin();

    const socket = getSocket();

    const handleEventCreated = (event) => {
      setEvents((prev) => [...prev, event]);
    };

    const handleEventUpdated = (updatedEvent) => {
      setEvents((prev) =>
        prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
      );
    };

    const handleEventDeleted = ({ eventId }) => {
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      if (selectedEventId === eventId) {
        setSelectedEventId(null);
        setAttendees([]);
      }
    };

    const handleAttendeeUpdate = ({ eventId, attendees: updated }) => {
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, attendees: updated } : e))
      );
      if (selectedEventId === eventId) {
        setAttendees(updated);
      }
    };

    socket.on('event-created', handleEventCreated);
    socket.on('event-updated', handleEventUpdated);
    socket.on('event-deleted', handleEventDeleted);
    socket.on('attendee-update', handleAttendeeUpdate);

    return () => {
      socket.off('event-created', handleEventCreated);
      socket.off('event-updated', handleEventUpdated);
      socket.off('event-deleted', handleEventDeleted);
      socket.off('attendee-update', handleAttendeeUpdate);
      leaveAdmin();
    };
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', date: '', venue: '', capacity: '' });
    setImageFile(null);
    setImagePreview('');
    setFormMode('create');
    setEditingId(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('date', form.date);
      formData.append('venue', form.venue);
      formData.append('capacity', Number(form.capacity));
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (formMode === 'create') {
        await api.post('/admin/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Event created successfully!');
      } else {
        await api.put(`/admin/events/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Event updated successfully!');
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (event) => {
    setFormMode('edit');
    setEditingId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      venue: event.venue,
      capacity: String(event.capacity),
    });
    setImageFile(null);
    setImagePreview(event.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/admin/events/${eventId}`);
      toast.success('Event deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const viewAttendees = async (eventId) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
      setAttendees([]);
      return;
    }

    setAttendeesLoading(true);
    setSelectedEventId(eventId);
    try {
      const res = await api.get(`/admin/events/${eventId}/attendees`);
      setAttendees(res.data);
    } catch (err) {
      setAttendees([]);
    } finally {
      setAttendeesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Create/Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {formMode === 'create' ? 'Create Event' : 'Edit Event'}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-32 w-auto rounded-lg object-cover border border-gray-200"
              />
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={formLoading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {formLoading
                ? 'Saving...'
                : formMode === 'create'
                ? 'Create Event'
                : 'Update Event'}
            </button>
            {formMode === 'edit' && (
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-600 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            All Events ({events.length})
          </h2>
        </div>

        {events.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No events yet.</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {events.map((event) => {
              const goingCount = event.attendees
                ? event.attendees.filter((a) => a.status === 'Going').length
                : 0;
              const eventDate = new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={event._id}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {eventDate} &middot; {event.venue} &middot; {goingCount}/{event.capacity} going
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewAttendees(event._id)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded border border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        {selectedEventId === event._id ? 'Hide' : 'Attendees'}
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Attendee List */}
                  {selectedEventId === event._id && (
                    <div className="px-4 pb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        {attendeesLoading ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                          </div>
                        ) : attendees.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center">
                            No attendees yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {attendees.map((a, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between py-1"
                              >
                                <div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {a.userId?.name || 'Unknown'}
                                  </span>
                                  <span className="text-xs text-gray-400 ml-2">
                                    {a.userId?.email || ''}
                                  </span>
                                </div>
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    a.status === 'Going'
                                      ? 'bg-green-100 text-green-700'
                                      : a.status === 'Maybe'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {a.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
