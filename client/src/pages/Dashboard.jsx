import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = 'https://nearbite-server-ve2u.onrender.com';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [menuItems, setMenuItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', isVeg: true, tag: '' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${BASE}/api/menu`, { headers });
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      const res = await fetch(`${BASE}/api/auth/toggle`, {
        method: 'PATCH',
        headers,
      });
      const data = await res.json();
      setIsOpen(data.isOpen);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(`${BASE}/api/menu`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await res.json();
      setMenuItems([...menuItems, data]);
      setForm({ name: '', price: '', isVeg: true, tag: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE}/api/menu/${id}`, {
        method: 'DELETE',
        headers,
      });
      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoUpload = async (itemId, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await fetch(`${BASE}/api/menu/${itemId}/photo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      setMenuItems(menuItems.map((item) =>
        item._id === itemId ? { ...item, photo: data.photo } : item
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your menu and availability</p>
          </div>
          <button
            onClick={handleToggle}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              isOpen
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isOpen ? '🟢 Open' : '🔴 Closed'}
          </button>
        </div>

        {/* Add Menu Item Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Add Menu Item</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Item name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tag (e.g. lunch, snack)"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isVeg: !form.isVeg })}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                    form.isVeg ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.isVeg ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {form.isVeg ? '🟢 Veg' : '🔴 Non-veg'}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={adding}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition disabled:opacity-60"
            >
              {adding ? 'Adding...' : '+ Add Item'}
            </button>
          </form>
        </div>

        {/* Menu Items List */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-4">Your Menu</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading menu...</p>
          ) : menuItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm shadow-sm">
              No items yet. Add your first dish above!
            </div>
          ) : (
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  {item.photo && (
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-full h-36 object-cover"
                    />
                  )}
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 text-sm">{item.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.isVeg
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {item.isVeg ? 'Veg' : 'Non-veg'}
                        </span>
                        {item.tag && (
                          <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-orange-500 font-semibold text-sm mt-0.5">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-orange-500 hover:text-orange-600 font-medium cursor-pointer transition">
                        {item.photo ? '📷 Change' : '📷 Add Photo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(item._id, e.target.files[0])}
                        />
                      </label>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-sm text-red-400 hover:text-red-600 font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}