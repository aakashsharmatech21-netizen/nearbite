import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BASE = 'https://nearbite-server-ve2u.onrender.com'; // 👈 change to this

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [role,    setRole]    = useState('cook');
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = role === 'cook' ? '/api/auth/login' : '/api/buyer/login';
      const res  = await fetch(`${BASE}${endpoint}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      login(data.token, data.user.role, data.user.id);
      navigate(role === 'cook' ? '/cook/dashboard' : '/buyer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-orange-500 transition";

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-8 w-full max-w-md">

        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest text-[#555] uppercase mb-3">Welcome back</p>
          <h2 className="text-3xl font-medium tracking-tight text-white">
            Login to <span className="text-orange-500">NearBite</span>
          </h2>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-2 mb-6 bg-[#1a1a1a] p-1 rounded-full border border-[#2a2a2a]">
          {['cook', 'buyer'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition capitalize ${
                role === r
                  ? 'bg-orange-500 text-white'
                  : 'text-[#555] hover:text-white'
              }`}
            >
              {r === 'cook' ? '👨‍🍳 Cook' : '🛍️ Buyer'}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-[#1a1a1a] border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#555] uppercase tracking-wider block mb-2">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" required className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#555] uppercase tracking-wider block mb-2">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="••••••••" required className={inputClass} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-full transition disabled:opacity-60 mt-2">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center text-[#555] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-orange-500 hover:text-orange-400 transition">Sign up</Link>
        </p>
      </div>
    </div>
  );
}