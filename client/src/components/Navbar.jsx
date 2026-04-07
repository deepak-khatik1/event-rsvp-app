import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Event RSVP
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/events"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Events
              </Link>
              <Link
                to="/my-events"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                My Events
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Admin
                </Link>
              )}
              <span className="text-sm text-gray-500">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
