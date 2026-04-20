import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-lg font-semibold tracking-tight">
        🍛 NearBite
      </Link>

      <div className="flex gap-6 text-sm font-medium items-center">
        <Link to="/browse" className="hover:text-orange-100 transition">
          Browse
        </Link>

        {token ? (
          <>
            <Link to="/dashboard" className="hover:text-orange-100 transition">
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-orange-100 transition">
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-100 transition"
            >
              Join as Cook
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}