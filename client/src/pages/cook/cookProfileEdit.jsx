import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const BASE = 'https://nearbite-server-ve2u.onrender.com';

export default function CookProfileEdit() {
  const { token } = useAuth();
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const [form,   setForm]   = useState({ name: '', bio: '', phone: '', pincode: '' });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/auth/profile`, { headers })
      .then(r => r.json())
      .then(d => setForm({ name: d.name || '', bio: d.bio || '', phone: d.phone || '', pincode: d.pincode || '' }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${BASE}/api/auth/profile`, { method: 'PATCH', headers, body: JSON.stringify(form) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  const inputClass = "w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-orange-500 transition";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10">
      <div className="max-w-xl mx-auto">
        <p className="text-xs tracking-widest text-[#555] uppercase mb-1">Cook Account</p>
        <h1 className="text-3xl font-medium mb-8">Edit <span className="text-orange-500">Profile</span></h1>

        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
          {[['Name', 'name', 'text'], ['Phone', 'phone', 'tel'], ['Pincode', 'pincode', 'text']].map(([label, key, type]) => (
            <div key={key}>
              <label className="text-xs text-[#555] mb-1 block">{label}</label>
              <input type={type} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })} className={inputClass} />
            </div>
          ))}
          <div>
            <label className="text-xs text-[#555] mb-1 block">Bio</label>
            <textarea rows={3} value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              className={`${inputClass} resize-none`} />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-full text-sm transition disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && <span className="text-green-500 text-sm">✅ Saved!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}