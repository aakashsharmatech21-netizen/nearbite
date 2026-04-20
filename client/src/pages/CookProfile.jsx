import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BASE = 'https://nearbite-server-ve2u.onrender.com';

export default function CookProfile() {
  const { id } = useParams();
  const [cook, setCook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ reviewerName: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null);
  const [orderType, setOrderType] = useState('pickup');
  const [address, setAddress] = useState('');

  useEffect(() => { fetchCook(); }, [id]);

  const fetchCook = async () => {
    try {
      const res = await fetch(`${BASE}/api/cooks/${id}`);
      if (!res.ok) throw new Error('Failed to fetch cook');
      setCook(await res.json());
    } catch (err) { console.error(err); setCook(null); }
    finally { setLoading(false); }
  };

  const handleItemClick = async (itemId) => {
    try { await fetch(`${BASE}/api/menu/${itemId}/click`, { method: 'POST' }); }
    catch (err) { console.error(err); }
  };

  // ✅ FIX 1: Block modal from opening if restaurant is closed
  const openModal = (item) => {
    if (!cook.isOpen) {
      alert('This kitchen is currently closed and not accepting orders.');
      return;
    }
    setModal(item);
    setOrderType('pickup');
    setAddress('');
  };

  const closeModal = () => { setModal(null); setAddress(''); setOrderType('pickup'); };

  const handleSendOrder = () => {
    if (!modal) return;
    if (orderType === 'delivery' && !address.trim()) {
      alert('Please enter your delivery address.');
      return;
    }
    const deliveryCharge = cook.deliveryCharge || 0;
    const isDelivery = orderType === 'delivery';
    const total = modal.price + (isDelivery ? deliveryCharge : 0);

    let message = `Hi! I'd like to order ${modal.name} - ₹${modal.price}\nOrder type: ${isDelivery ? `Home Delivery (+₹${deliveryCharge})` : 'Self Pickup (free)'}\nTotal: ₹${total}`;

    if (isDelivery) {
      message += `\nMy address: ${address.trim()}`;
    } else {
      // ✅ FIX 2: Include pickup location in WhatsApp message
      message += `\nPickup location: ${cook.address || `Pincode - ${cook.pincode}`}`;
    }

    handleItemClick(modal._id);
    window.open(`https://wa.me/91${cook.phone}?text=${encodeURIComponent(message)}`, '_blank');
    closeModal();
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!form.reviewerName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/cooks/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to submit review');
      setForm({ reviewerName: '', rating: 5, comment: '' });
      fetchCook();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const inputClass = "w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-orange-500 transition";

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-[#555]">Loading...</div>;
  if (!cook) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-[#555]">Cook not found</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Cook Info */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-orange-500 font-bold text-xl">
              {cook.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-medium text-white">{cook.name}</h1>
              <p className="text-sm text-[#555]">{cook.bio || 'Home cook'}</p>
            </div>
            <span className={`ml-auto text-xs font-medium px-3 py-1 rounded-full ${cook.isOpen ? 'bg-green-500/10 text-green-500' : 'bg-[#1e1e1e] text-[#555]'}`}>
              {cook.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          {cook.avgRating && (
            <div className="flex items-center gap-1 text-sm text-yellow-500 font-medium">
              ⭐ {cook.avgRating}{' '}
              <span className="text-[#555] font-normal">({cook.reviews?.length || 0} reviews)</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e1e1e]">
            <h2 className="font-medium text-white">Menu</h2>
          </div>
          <div className="px-5 py-3 space-y-1">
            {cook.menu?.length === 0 ? (
              <p className="text-xs text-[#444] py-2">No menu items yet</p>
            ) : cook.menu?.map((item) => (
              <div key={item._id} className="flex items-center justify-between py-2.5 border-b border-[#1a1a1a] last:border-0 gap-2">
                {item.photo && <img src={item.photo} alt={item.name} onError={(e) => (e.target.style.display = 'none')} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 opacity-90" />}
                <div className="flex items-center gap-2 flex-1">
                  <span className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                    <span className={`block w-1.5 h-1.5 rounded-full m-0.5 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                  </span>
                  <span className="text-sm text-[#ccc]">{item.name}</span>
                  {item.tag && <span className="text-xs bg-[#1e1e1e] text-[#666] px-2 py-0.5 rounded-full">{item.tag}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-orange-500">₹{item.price}</span>
                  {/* ✅ FIX 1: Visually disable button + block click when closed */}
                  <button
                    onClick={() => openModal(item)}
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
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
          <h2 className="font-medium text-white mb-4">Reviews</h2>
          {cook.reviews?.length === 0 ? (
            <p className="text-sm text-[#555] mb-4">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-3 mb-6">
              {cook.reviews?.map((r) => (
                <div key={r._id} className="border border-[#1e1e1e] rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{r.reviewerName}</span>
                    <span className="text-yellow-500 text-sm">{'⭐'.repeat(r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-sm text-[#555]">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
          <h3 className="font-medium text-white mb-3 text-sm">Leave a Review</h3>
          <form onSubmit={handleReview} className="space-y-3">
            <input type="text" placeholder="Your name" value={form.reviewerName}
              onChange={(e) => setForm({ ...form, reviewerName: e.target.value })} required className={inputClass} />
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#555]">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}
                  className={`text-xl transition ${star <= form.rating ? 'text-yellow-400' : 'text-[#333]'}`}>★</button>
              ))}
            </div>
            <textarea placeholder="Write a comment (optional)" value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })} rows={3}
              className={`${inputClass} resize-none`} />
            <button type="submit" disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-full text-sm transition disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

      </div>

      {/* Order Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 px-4 pb-6 sm:pb-0">
          <div className="bg-[#141414] border border-[#2a2a2a] w-full max-w-md rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-white">How would you like it?</h2>
              <button onClick={closeModal} className="text-[#555] hover:text-white text-xl leading-none transition">✕</button>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#ccc]">
              🍽️ <span className="font-medium text-white">{modal.name}</span> — ₹{modal.price}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['pickup', 'delivery'].map((type) => (
                <button key={type} onClick={() => setOrderType(type)}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${orderType === type ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-[#2a2a2a] text-[#555] hover:border-[#444]'}`}>
                  {type === 'pickup'
                    ? <>🏃 Self Pickup<br /><span className="text-xs font-normal text-green-500">Free</span></>
                    : <>🚗 Home Delivery<br /><span className="text-xs font-normal text-[#555]">+₹{cook.deliveryCharge || 0}</span></>}
                </button>
              ))}
            </div>

            {/* ✅ FIX 2: Show pickup address info OR delivery address input */}
            {orderType === 'pickup' ? (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#ccc] space-y-1">
                <p className="text-xs text-[#555] uppercase tracking-wide mb-1">Pickup from</p>
                <p className="text-white font-medium">
                  {cook.address || `Cloud Kitchen — Pincode ${cook.pincode}`}
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
                ₹{modal.price + (orderType === 'delivery' ? (cook.deliveryCharge || 0) : 0)}
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