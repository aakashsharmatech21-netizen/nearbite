import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BASE = 'https://nearbite-server-ve2u.onrender.com';

export default function BuyerDashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/api/buyer/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setProfile);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">

        <p className="text-xs tracking-widest text-[#555] uppercase mb-1">Buyer Panel</p>
        <h1 className="text-3xl font-medium mb-2">
          Hey, <span className="text-orange-500">{profile?.name || '...'}</span> 👋
        </h1>
        <p className="text-[#555] text-sm mb-10">What are you hungry for today?</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div onClick={() => navigate('/browse')}
            className="bg-[#141414] border border-[#1e1e1e] hover:border-orange-500/40 rounded-2xl p-6 cursor-pointer transition group">
            <div className="text-3xl mb-3">🍱</div>
            <h2 className="text-base font-medium text-white group-hover:text-orange-500 transition">Browse Cooks</h2>
            <p className="text-xs text-[#555] mt-1">Find home cooks near you</p>
          </div>

          <div onClick={() => navigate('/buyer/profile')}
            className="bg-[#141414] border border-[#1e1e1e] hover:border-orange-500/40 rounded-2xl p-6 cursor-pointer transition group">
            <div className="text-3xl mb-3">👤</div>
            <h2 className="text-base font-medium text-white group-hover:text-orange-500 transition">My Profile</h2>
            <p className="text-xs text-[#555] mt-1">Edit your name, pincode, phone</p>
          </div>
        </div>

        <button onClick={() => { logout(); navigate('/login'); }}
          className="mt-12 text-sm text-[#555] hover:text-red-400 transition">
          Sign out
        </button>
      </div>
    </div>
  );
}