import { Link } from 'react-router-dom';
export default function Navbar() {
return (
<nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center
shadow-md">
<Link to="/" className="text-2xl font-bold tracking-tight">
🍛 NearBite
</Link>
<div className="flex gap-4 text-sm font-medium">
<Link to="/browse" className="hover:underline">Browse</Link>
<Link to="/login" className="hover:underline">Login</Link>
<Link to="/signup" className="bg-white text-orange-500 px-3 py-1 rounded-full
hover:bg-orange-100">
Join as Cook
</Link>
</div>
</nav>
);
}
