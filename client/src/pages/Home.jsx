import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = 'https://nearbite-server-ve2u.onrender.com';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [pincode, setPincode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE}/api/menu/trending`)
      .then((res) => res.json())
      .then((data) => setTrending(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Hero */}
      <div className="text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2 text-xs text-[#888] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
          Home cooked. Delivered nearby.
        </div>

        <h1 className="text-6xl font-medium tracking-tight leading-tight mb-5">
          Ghar ka khana,<br />
          <span className="text-orange-500">paas mein</span>
        </h1>

        <p className="text-[#777] text-lg max-w-md mx-auto mb-10 leading-relaxed">
          Discover home cooks in your neighbourhood. Order on WhatsApp. Fresh every day.
        </p>

        {/* Search bar */}
        <div className="flex items-center gap-0 max-w-sm mx-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-full pl-5 pr-1.5 py-1.5">
          <input
            type="text"
            value={pincode}
            onChange={(e) => {
              const val = e.target.value;
              setPincode(val);
              if (val.length === 6) navigate(`/browse?pincode=${val}`);
            }}
            placeholder="Enter your pincode..."
            maxLength={6}
            className="bg-transparent border-none outline-none text-white placeholder-[#555] text-sm flex-1 py-2"
          />
          <button
            onClick={() => pincode.length === 6 && navigate(`/browse?pincode=${pincode}`)}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-2.5 text-sm font-medium transition"
          >
            Find Cooks
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-14 pt-10 border-t border-[#1a1a1a]">
          {[
            { num: '200+', label: 'Home Cooks' },
            { num: '50+', label: 'Pincodes' },
            { num: '1000+', label: 'Orders Placed' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-medium tracking-tight">{s.num}</div>
              <div className="text-xs text-[#555] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <p className="text-xs font-medium tracking-widest text-[#555] uppercase mb-3">How it works</p>
        <h2 className="text-3xl font-medium tracking-tight mb-10">Three steps to fresh food</h2>

        <div className="grid grid-cols-3 gap-4">
          {[
            { num: '01', icon: '🔍', title: 'Browse', desc: 'Enter your pincode and discover home cooks near you.' },
            { num: '02', icon: '📱', title: 'Order on WhatsApp', desc: 'Pick a dish, choose pickup or delivery, send directly.' },
            { num: '03', icon: '🏠', title: 'Get fresh food', desc: 'Pick up or get it delivered — hot and homemade.' },
          ].map((step) => (
            <div key={step.num} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-7 relative">
              <div className="absolute top-0 left-6 w-8 h-0.5 bg-orange-500 rounded-b" />
              <div className="text-xs text-[#444] font-medium tracking-wider mb-5">{step.num}</div>
              <div className="text-3xl mb-4">{step.icon}</div>
              <h3 className="text-base font-medium text-white mb-2">{step.title}</h3>
              <p className="text-sm text-[#555] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <p className="text-xs font-medium tracking-widest text-[#555] uppercase mb-3">Trending now</p>
          <h2 className="text-3xl font-medium tracking-tight mb-10">Popular this week</h2>

          <div className="grid grid-cols-3 gap-4">
            {trending.map((dish) => (
              <div
                key={dish._id}
                className="bg-[#141414] border border-[#1e1e1e] hover:border-[#333] rounded-2xl p-6 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl">🔥</span>
                  <span className="text-lg font-medium text-orange-500">₹{dish.price}</span>
                </div>
                <div className="text-sm font-medium text-white mb-2">{dish.name}</div>
                {dish.tag && (
                  <span className="text-xs bg-[#1e1e1e] text-[#666] px-2.5 py-1 rounded-full inline-block mb-3">
                    {dish.tag}
                  </span>
                )}
                <div className="text-xs text-[#444]">by {dish.cookName || 'Home Cook'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#1a1a1a] px-6 py-8 flex items-center justify-between max-w-4xl mx-auto">
        <span className="text-[#444] text-sm">NearBite</span>
        <span className="text-[#333] text-xs">© 2026 NearBite. Made with love.</span>
      </div>

    </div>
  );
}