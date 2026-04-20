import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const BASE = 'https://nearbite-server-ve2u.onrender.com';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', pincode: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Riya Sharma' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '9876543210' },
    { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '201301' },
  ];

  const inputClass = "w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-orange-500 transition";

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-10">
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-8 w-full max-w-md">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest text-[#555] uppercase mb-3">Get started</p>
          <h2 className="text-3xl font-medium tracking-tight text-white">Join as a <span className="text-orange-500">Cook</span></h2>
          <p className="text-[#555] text-sm mt-2">Start selling your home-cooked food on NearBite</p>
        </div>

        {error && (
          <div className="bg-[#1a1a1a] border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="text-xs font-medium text-[#555] uppercase tracking-wider block mb-2">{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} required className={inputClass} />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-[#555] uppercase tracking-wider block mb-2">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell customers about your cooking..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-full transition disabled:opacity-60 mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-center text-[#555] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 hover:text-orange-400 transition">Login</Link>
        </p>
      </div>
    </div>
  );
}