import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BASE = 'https://nearbite-server-ve2u.onrender.com';

export default function Browse() {
  const [pincode, setPincode] = useState('');
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  // ✅ Modal state (same as CookProfile)
  const [modal, setModal] = useState(null);       // { item, cook }
  const [orderType, setOrderType] = useState('pickup');
  const [address, setAddress] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchCooks = async (pin) => {
    if (!pin.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await fetch(`${BASE}/api/cooks?pincode=${pin}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setCooks(data);
    } catch (err) {
      setError(err.message);
      setCooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const p = searchParams.get('pincode');
    if (p) {
      setPincode(p);
      fetchCooks(p);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCooks(pincode);
  };

  const handleItemClick = async (itemId) => {
    try {
      await fetch(`${BASE}/api/menu/${itemId}/click`, { method: 'POST' });
    } catch (err) {
      console.error('Click track failed', err);
    }
  };

  // ✅ Open modal — block if closed
  const openModal = (item, cook) => {
    if (!cook.isOpen) {
      alert('This kitchen is currently closed and not accepting orders.');
      return;
    }
    setModal({ item, cook });
    setOrderType('pickup');
    setAddress('');
  };

  const closeModal = () => {
    setModal(null);
    setAddress('');
    setOrderType('pickup');
  };

  // ✅ Send order via WhatsApp with pickup/delivery info
  const handleSendOrder = () => {
    if (!modal) return;
    const { item, cook } = modal;
    if (orderType === 'delivery' && !address.trim()) {
      alert('Please enter your delivery address.');
      return;
    }
    const deliveryCharge = cook.deliveryCharge || 0;
    const isDelivery = orderType === 'delivery';
    const total = item.price + (isDelivery ? deliveryCharge : 0);

    let message = `Hi! I'd like to order ${item.name} - ₹${item.price}\nOrder type: ${isDelivery ? `Home Delivery (+₹${deliveryCharge})` : 'Self Pickup (free)'}\nTotal: ₹${total}`;

    if (isDelivery) {
      message += `\nMy address: ${address.trim()}`;
    } else {
      message += `\nPickup location: ${cook.address || `Pincode - ${cook.pincode}`}`;
    }

    handleItemClick(item._id);
    window.open(`https://wa.me/91${cook.phone}?text=${encodeURIComponent(message)}`, '_blank');
    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest text-[#555] uppercase mb-3">Discover</p>
          <h1 className="text-4xl font-medium tracking-tight mb-3">
            Find Cooks <span className="text-orange-500">Near You</span>
          </h1>
          <p className="text-[#777] text-sm">
            Enter your pincode to discover home cooks nearby
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-0 max-w-sm mx-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-full pl-5 pr-1.5 py-1.5 mb-10"
        >
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter your pincode..."
            required
            maxLength={6}
            className="bg-transparent border-none outline-none text-white placeholder-[#555] text-sm flex-1 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-2.5 text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? 'Searching...' : 'Find Cooks'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-[#1a1a1a] border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Empty state */}
        {searched && !loading && cooks.length === 0 && !error && (
          <div className="text-center py-16 text-[#555]">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-medium text-[#888]">No cooks found in this pincode</p>
            <p className="text-sm mt-1">Try a nearby pincode!</p>
          </div>
        )}

        {/* Cook list */}
        <div className="space-y-4">
          {cooks.map((cook) => (
            <div
              key={cook._id}
              className="bg-[#141414] border border-[#1e1e1e] hover:border-[#333] rounded-2xl overflow-hidden transition"
            >
              {/* Cook header */}
              <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
                <div
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                  onClick={() => navigate(`/cook/${cook._id}`)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-orange-500 font-bold text-sm">
                    {cook.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm hover:text-orange-500 transition">{cook.name}</p>
                    <p className="text-xs text-[#555]">{cook.bio || 'Home cook'}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${cook.isOpen ? 'bg-green-500/10 text-green-500' : 'bg-[#1e1e1e] text-[#555]'}`}>
                  {cook.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>

              {/* Menu */}
              <div className="px-5 py-3 space-y-1">
                {cook.menu && cook.menu.length > 0 ? (
                  cook.menu.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between py-2.5 border-b border-[#1a1a1a] last:border-0 gap-2"
                    >
                      {item.photo && (
                        <img
                          src={item.photo}
                          alt={item.name}
                          onError={(e) => (e.target.style.display = 'none')}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 cursor-pointer opacity-90"
                          onClick={() => navigate(`/cook/${cook._id}`)}
                        />
                      )}
                      <div className="flex items-center gap-2 flex-1">
                        <span className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                          <span className={`block w-1.5 h-1.5 rounded-full m-0.5 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                        </span>
                        <span className="text-sm text-[#ccc]">{item.name}</span>
                        {item.tag && (
                          <span className="text-xs bg-[#1e1e1e] text-[#666] px-2 py-0.5 rounded-full">{item.tag}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-orange-500">₹{item.price}</span>
                        {/* ✅ Button replaces <a> tag — no direct WhatsApp redirect */}
                        <button
                          onClick={() => openModal(item, cook)}
                          disabled={!cook.isOpen}
                          className={`text-white text-xs font-medium px-3 py-1.5 rounded-full transition ${
                            cook.isOpen
                              ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                              : 'bg-[#2a2a2a] text-[#555] cursor-not-allowed'
                          }`}
                        >
                          {cook.isOpen ? 'Order' : 'Closed'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#444] py-2">No menu items yet</p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ✅ Order Modal — exact same as CookProfile */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 px-4 pb-6 sm:pb-0">
          <div className="bg-[#141414] border border-[#2a2a2a] w-full max-w-md rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-white">How would you like it?</h2>
              <button onClick={closeModal} className="text-[#555] hover:text-white text-xl leading-none transition">✕</button>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#ccc]">
              🍽️ <span className="font-medium text-white">{modal.item.name}</span> — ₹{modal.item.price}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['pickup', 'delivery'].map((type) => (
                <button key={type} onClick={() => setOrderType(type)}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${orderType === type ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-[#2a2a2a] text-[#555] hover:border-[#444]'}`}>
                  {type === 'pickup'
                    ? <><span>🏃 Self Pickup</span><br /><span className="text-xs font-normal text-green-500">Free</span></>
                    : <><span>🚗 Home Delivery</span><br /><span className="text-xs font-normal text-[#555]">+₹{modal.cook.deliveryCharge || 0}</span></>}
                </button>
              ))}
            </div>

            {orderType === 'pickup' ? (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#ccc] space-y-1">
                <p className="text-xs text-[#555] uppercase tracking-wide mb-1">Pickup from</p>
                <p className="text-white font-medium">
                  {modal.cook.address || `Cloud Kitchen — Pincode ${modal.cook.pincode}`}
                </p>
                <p className="text-xs text-[#555]">Contact cook on WhatsApp for exact location.</p>
              </div>
            ) : (
              <textarea
                placeholder="Enter your delivery address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-orange-500 transition resize-none"
              />
            )}

            <div className="flex items-center justify-between text-sm font-medium text-[#888] border-t border-[#1e1e1e] pt-4">
              <span>Total</span>
              <span className="text-orange-500 text-base font-medium">
                ₹{modal.item.price + (orderType === 'delivery' ? (modal.cook.deliveryCharge || 0) : 0)}
              </span>
            </div>
            <button onClick={handleSendOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-full text-sm transition">
              📲 Send Order on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}