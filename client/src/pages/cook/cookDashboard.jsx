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
  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [savingCharge, setSavingCharge] = useState(false);
  const [chargeSaved, setChargeSaved] = useState(false);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchMenu();
    fetchProfile();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${BASE}/api/menu`, { headers });
      setMenuItems(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BASE}/api/auth/profile`, { headers });
      const data = await res.json();
      setDeliveryCharge(data.deliveryCharge ?? 0);
      setIsOpen(data.isOpen ?? false);
    } catch (err) { console.error(err); }
  };

  const handleToggle = async () => {
    try {
      const res = await fetch(`${BASE}/api/auth/toggle`, { method: 'PATCH', headers });
      const data = await res.json();
      setIsOpen(data.isOpen);
    } catch (err) { console.error(err); }
  };

  const handleSaveCharge = async () => {
    setSavingCharge(true);
    try {
      await fetch(`${BASE}/api/auth/profile`, { method: 'PATCH', headers, body: JSON.stringify({ deliveryCharge: Number(deliveryCharge) }) });
      setChargeSaved(true);
      setTimeout(() => setChargeSaved(false), 2000);
    } catch (err) { console.error(err); }
    finally { setSavingCharge(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(`${BASE}/api/menu`, { method: 'POST', headers, body: JSON.stringify({ ...form, price: Number(form.price) }) });
      const data = await res.json();
      setMenuItems([...menuItems, data]);
      setForm({ name: '', price: '', isVeg: true, tag: '' });
    } catch (err) { console.error(err); }
    finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE}/api/menu/${id}`, { method: 'DELETE', headers });
      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (err) { console.error(err); }
  };

  const handlePhotoUpload = async (itemId, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await fetch(`${BASE}/api/menu/${itemId}/photo`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await res.json();
      setMenuItems(menuItems.map((item) => item._id === itemId ? { ...item, photo: data.photo } : item));
    } catch (err) { console.error(err); }
  };

  const inputClass = "bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-orange-500 transition";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-medium tracking-widest text-[#555] uppercase mb-1">Cook Panel</p>
            <h1 className="text-3xl font-medium tracking-tight">Your <span className="text-orange-500">Dashboard</span></h1>
          </div>
          <button
            onClick={handleToggle}
            className={`px-5 py-2 rounded-full text-sm font-medium transition border ${
              isOpen
                ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'
                : 'bg-[#1a1a1a] text-[#555] border-[#2a2a2a] hover:border-[#444]'
            }`}
          >
            {isOpen ? '🟢 Open' : '🔴 Closed'}
          </button>
        </div>

        {/* Delivery Charge */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 mb-6">
          <div className="absolute top-0 left-6 w-8 h-0.5 bg-orange-500 rounded-b" style={{position:'relative', marginBottom:'12px', width:'32px', height:'2px', background:'#f97316', borderRadius:'0 0 4px 4px'}} />
          <h2 className="text-base font-medium text-white mb-1">Delivery Charge</h2>
          <p className="text-xs text-[#555] mb-4">Added to order total when customer chooses home delivery.</p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#555]">₹</span>
              <input
                type="number" min="0" placeholder="0"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                className={`${inputClass} pl-7 w-32`}
              />
            </div>
            <button onClick={handleSaveCharge} disabled={savingCharge}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-full text-sm transition disabled:opacity-60">
              {savingCharge ? 'Saving...' : 'Save'}
            </button>
            {chargeSaved && <span className="text-green-500 text-sm">✅ Saved!</span>}
          </div>
        </div>

        {/* Add Menu Item */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 mb-6">
          <h2 className="text-base font-medium text-white mb-4">Add Menu Item</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Item name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} />
              <input type="number" placeholder="Price (₹)" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} required className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Tag (e.g. lunch, snack)" value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })} className={inputClass} />
              <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
                <button type="button" onClick={() => setForm({ ...form, isVeg: !form.isVeg })}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${form.isVeg ? 'bg-green-500' : 'bg-[#333]'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isVeg ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-[#888]">{form.isVeg ? '🟢 Veg' : '🔴 Non-veg'}</span>
              </div>
            </div>
            <button type="submit" disabled={adding}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-full text-sm transition disabled:opacity-60">
              {adding ? 'Adding...' : '+ Add Item'}
            </button>
          </form>
        </div>

        {/* Menu List */}
        <div>
          <p className="text-xs font-medium tracking-widest text-[#555] uppercase mb-3">Your Menu</p>
          {loading ? (
            <p className="text-[#555] text-sm">Loading menu...</p>
          ) : menuItems.length === 0 ? (
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-8 text-center text-[#555] text-sm">
              No items yet. Add your first dish above!
            </div>
          ) : (
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div key={item._id} className="bg-[#141414] border border-[#1e1e1e] hover:border-[#333] rounded-2xl overflow-hidden transition">
                  {item.photo && <img src={item.photo} alt={item.name} className="w-full h-36 object-cover opacity-90" />}
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white text-sm">{item.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.isVeg ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-400'}`}>
                          {item.isVeg ? 'Veg' : 'Non-veg'}
                        </span>
                        {item.tag && <span className="text-xs bg-[#1e1e1e] text-[#666] px-2 py-0.5 rounded-full">{item.tag}</span>}
                      </div>
                      <p className="text-orange-500 font-medium text-sm mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-xs text-[#555] hover:text-orange-500 font-medium cursor-pointer transition">
                        {item.photo ? '📷 Change' : '📷 Add Photo'}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={(e) => handlePhotoUpload(item._id, e.target.files[0])} />
                      </label>
                      <button onClick={() => handleDelete(item._id)}
                        className="text-sm text-[#555] hover:text-red-400 font-medium transition">Delete</button>
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