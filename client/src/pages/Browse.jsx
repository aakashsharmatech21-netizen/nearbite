import { useState } from 'react';

const BASE = 'https://nearbite-server-ve2u.onrender.com';

export default function Browse() {
  const [pincode, setPincode] = useState('');
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await fetch(`${BASE}/api/cooks?pincode=${pincode}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setCooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (itemId) => {
    try {
      await fetch(`${BASE}/api/menu/${itemId}/click`, { method: 'POST' });
    } catch (err) {
      console.error('Click track failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] px-4 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Find Cooks <span className="text-orange-500">Near You</span>
          </h1>
          <p className="text-gray-500 text-sm">Enter your pincode to discover home cooks nearby</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter your pincode..."
            required
            className="flex-1 border border-gray-200 rounded-full px-5 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full text-sm transition disabled:opacity-60"
          >
            {loading ? 'Searching...' : 'Find Cooks'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {searched && !loading && cooks.length === 0 && !error && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-medium text-gray-600">No cooks found in this pincode</p>
            <p className="text-sm mt-1">Try a nearby pincode!</p>
          </div>
        )}

        <div className="space-y-6">
          {cooks.map((cook) => (
            <div key={cook._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">

              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">
                    {cook.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{cook.name}</p>
                    <p className="text-xs text-gray-400">{cook.bio || 'Home cook'}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  cook.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {cook.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>

              <div className="px-5 py-3 space-y-2">
                {cook.menu && cook.menu.length > 0 ? (
                  cook.menu.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${
                          item.isVeg ? 'border-green-500' : 'border-red-500'
                        }`}>
                          <span className={`block w-1.5 h-1.5 rounded-full m-0.5 ${
                            item.isVeg ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                        </span>
                        <span className="text-sm text-gray-700">{item.name}</span>
                        {item.tag && (
                          <span className="text-xs bg-orange-50 text-orange-400 px-2 py-0.5 rounded-full">
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-orange-500">₹{item.price}</span>

                        <a
                          href={`https://wa.me/91${cook.phone || ''}?text=${encodeURIComponent(
                            `Hi, I'd like to order ${item.name} for ₹${item.price}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleItemClick(item._id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition"
                        >
                          Order
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 py-2">No menu items yet</p>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}