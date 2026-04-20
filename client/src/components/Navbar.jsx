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
      <Link to="/" className="text-2xl font-bold tracking-tight">
        🍛 NearBite
      </Link>
      <div className="flex gap-4 text-sm font-medium items-center">
        <Link to="/browse" className="hover:underline">Browse</Link>
        {token ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-white text-orange-500 px-3 py-1 rounded-full hover:bg-orange-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="bg-white text-orange-500 px-3 py-1 rounded-full hover:bg-orange-100">
              Join as Cook
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}