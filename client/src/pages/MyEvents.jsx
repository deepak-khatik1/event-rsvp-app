import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await api.get('/users/my-events');
        setEvents(res.data);
      } catch (err) {
        toast.error('Failed to load your events');
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statusBadge = (status) => {
    const styles = {
      Going: 'bg-green-100 text-green-700',
      Maybe: 'bg-yellow-100 text-yellow-700',
      'Not Going': 'bg-red-100 text-red-700',
    };
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Events</h1>

      {events.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">You haven't RSVP'd to any events yet.</p>
          <Link
            to="/events"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    {statusBadge(event.myStatus)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formattedDate} &middot; {event.venue}
                  </p>
                </div>
                <Link
                  to={`/events/${event._id}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
