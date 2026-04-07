import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const goingCount = event.attendees
    ? event.attendees.filter((a) => a.status === 'Going').length
    : 0;

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <img
        src={event.image || 'https://placehold.co/400x160/6366f1/ffffff?text=Event+Image'}
        alt={event.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>

        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <p>
            <span className="font-medium">Date:</span> {formattedDate}
          </p>
          <p>
            <span className="font-medium">Venue:</span> {event.venue}
          </p>
          <p>
            <span className="font-medium">Capacity:</span> {goingCount} / {event.capacity}
          </p>
        </div>

        <div className="mt-auto">
          <Link
            to={`/events/${event._id}`}
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
