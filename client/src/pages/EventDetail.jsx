import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import RsvpButton from '../components/RsvpButton';
import { joinEvent, leaveEvent, getSocket, connectSocket } from '../services/socket';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        toast.error('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    connectSocket();
    joinEvent(id);

    const socket = getSocket();
    const handleRsvpUpdated = (data) => {
      if (data.eventId === id) {
        setEvent((prev) => (prev ? { ...prev, attendees: data.attendees } : prev));
      }
    };

    socket.on('rsvp-updated', handleRsvpUpdated);

    return () => {
      socket.off('rsvp-updated', handleRsvpUpdated);
      leaveEvent(id);
    };
  }, [id]);

  const handleRsvp = (updatedEvent) => {
    setEvent(updatedEvent);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-center text-red-600 mt-8">Event not found</div>;
  }

  const goingCount = event.attendees.filter((a) => a.status === 'Going').length;
  const maybeCount = event.attendees.filter((a) => a.status === 'Maybe').length;
  const notGoingCount = event.attendees.filter((a) => a.status === 'Not Going').length;

  const myRsvp = event.attendees.find(
    (a) => (a.userId?._id || a.userId) === user?.id
  );
  const currentStatus = myRsvp?.status || null;
  const isAtCapacity = goingCount >= event.capacity;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <img
          src={event.image || 'https://placehold.co/800x400/6366f1/ffffff?text=Event+Image'}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

        <p className="text-gray-600 mb-6">{event.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-900">{formattedDate}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Venue</p>
            <p className="font-medium text-gray-900">{event.venue}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{goingCount}</p>
            <p className="text-sm text-green-600">Going</p>
          </div>
          <div className="flex-1 bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{maybeCount}</p>
            <p className="text-sm text-yellow-600">Maybe</p>
          </div>
          <div className="flex-1 bg-red-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{notGoingCount}</p>
            <p className="text-sm text-red-600">Not Going</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">
            Capacity: {goingCount} / {event.capacity}
            {isAtCapacity && (
              <span className="ml-2 text-red-500 font-medium">Full</span>
            )}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((goingCount / event.capacity) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your RSVP</h3>
          <RsvpButton
            eventId={event._id}
            currentStatus={currentStatus}
            onRsvp={handleRsvp}
            disabled={isAtCapacity && currentStatus !== 'Going'}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
