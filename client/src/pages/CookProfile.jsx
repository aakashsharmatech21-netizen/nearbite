import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BASE = 'https://nearbite-server-ve2u.onrender.com';

export default function CookProfile() {
  const { id } = useParams();
  const [cook, setCook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    reviewerName: '',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCook();
  }, [id]); // ✅ fixed

  const fetchCook = async () => {
    try {
      const res = await fetch(`${BASE}/api/cooks/${id}`);
      if (!res.ok) throw new Error('Failed to fetch cook');
      const data = await res.json();
      setCook(data);
    } catch (err) {
      console.error(err);
      setCook(null);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (itemId) => {
    try {
      await fetch(`${BASE}/api/menu/${itemId}/click`, {
        method: 'POST',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();

    if (!form.reviewerName.trim()) return; // ✅ basic validation

    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/cooks/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to submit review');

      setForm({ reviewerName: '', rating: 5, comment: '' });
      fetchCook();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  if (!cook)
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center text-gray-400">
        Cook not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDF6EE] px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Cook Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xl">
              {cook.name?.[0]?.toUpperCase()}
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-800">{cook.name}</h1>
              <p className="text-sm text-gray-400">
                {cook.bio || 'Home cook'}
              </p>
            </div>

            <span
              className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${
                cook.isOpen
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {cook.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>

          {cook.avgRating && (
            <div className="flex items-center gap-1 text-sm text-yellow-500 font-semibold">
              ⭐ {cook.avgRating}{' '}
              <span className="text-gray-400 font-normal">
                ({cook.reviews?.length || 0} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Menu</h2>
          </div>

          <div className="px-5 py-3 space-y-2">
            {cook.menu?.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">
                No menu items yet
              </p>
            ) : (
              cook.menu?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-2"
                >
                  {item.photo && (
                    <img
                      src={item.photo}
                      alt={item.name}
                      onError={(e) => (e.target.style.display = 'none')}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  )}

                  <div className="flex items-center gap-2 flex-1">
                    <span
                      className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${
                        item.isVeg ? 'border-green-500' : 'border-red-500'
                      }`}
                    >
                      <span
                        className={`block w-1.5 h-1.5 rounded-full m-0.5 ${
                          item.isVeg ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                    </span>

                    <span className="text-sm text-gray-700">
                      {item.name}
                    </span>

                    {item.tag && (
                      <span className="text-xs bg-orange-50 text-orange-400 px-2 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-orange-500">
                      ₹{item.price}
                    </span>

                    {/* ✅ FIXED ORDER BUTTON */}
                    <a
                      href={`https://wa.me/91${cook.phone}?text=${encodeURIComponent(
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
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Reviews</h2>

          {cook.reviews?.length === 0 ? (
            <p className="text-sm text-gray-400 mb-4">
              No reviews yet. Be the first!
            </p>
          ) : (
            <div className="space-y-3 mb-6">
              {cook.reviews?.map((r) => (
                <div
                  key={r._id}
                  className="border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {r.reviewerName}
                    </span>
                    <span className="text-yellow-500 text-sm">
                      {'⭐'.repeat(r.rating)}
                    </span>
                  </div>

                  {r.comment && (
                    <p className="text-sm text-gray-500">
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Review */}
          <h3 className="font-semibold text-gray-700 mb-3 text-sm">
            Leave a Review
          </h3>

          <form onSubmit={handleReview} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={form.reviewerName}
              onChange={(e) =>
                setForm({ ...form, reviewerName: e.target.value })
              }
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  className={`text-xl ${
                    star <= form.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write a comment (optional)"
              value={form.comment}
              onChange={(e) =>
                setForm({ ...form, comment: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}