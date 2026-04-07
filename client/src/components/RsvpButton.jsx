import { useState } from 'react';
import api from '../services/api';

const statuses = ['Going', 'Maybe', 'Not Going'];

const RsvpButton = ({ eventId, currentStatus, onRsvp, disabled }) => {
  const [loading, setLoading] = useState(false);

  const handleRsvp = async (status) => {
    if (status === currentStatus) return;
    setLoading(true);
    try {
      const res = await api.post(`/events/${eventId}/rsvp`, { status });
      if (onRsvp) onRsvp(res.data.event);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to RSVP');
    } finally {
      setLoading(false);
    }
  };

  const getButtonStyle = (status) => {
    const isActive = currentStatus === status;
    const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    if (status === 'Going') {
      return `${base} ${isActive ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`;
    }
    if (status === 'Maybe') {
      return `${base} ${isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'}`;
    }
    return `${base} ${isActive ? 'bg-red-500 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'}`;
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => handleRsvp(status)}
          disabled={loading || disabled}
          className={getButtonStyle(status)}
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default RsvpButton;
