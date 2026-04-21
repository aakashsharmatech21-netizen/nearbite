import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = role === 'cook' ? '/cook/dashboard' : '/buyer/dashboard';

  return (
    <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-lg font-semibold tracking-tight">
        🍛 NearBite
      </Link>

      <div className="flex gap-6 text-sm font-medium items-center">
        <Link to="/browse" className="hover:text-orange-100 transition">Browse</Link>

        {token ? (
          <>
            <Link to={dashboardPath} className="hover:text-orange-100 transition">
              Dashboard
            </Link>
            <Link
              to={role === 'cook' ? '/cook/profile' : '/buyer/profile'}
              className="hover:text-orange-100 transition"
            >
              Profile
            </Link>
            <button onClick={handleLogout}
              className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-100 transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-orange-100 transition">Login</Link>
            <Link to="/signup"
              className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-100 transition">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}