export default function Home() {
return (
<div className="min-h-screen bg-orange-50">
{/* Hero */}
<div className="text-center py-20 px-4">
<h1 className="text-5xl font-extrabold text-gray-800 mb-4">
Ghar ka khana, <span className="text-orange-500">paas mein</span>
</h1>
<p className="text-gray-500 text-lg mb-8">
Find home cooks near you. Order on WhatsApp. Pick up fresh food.
</p>
<div className="flex justify-center gap-4">
<input
type="text"
placeholder="Enter your pincode..."
className="border border-gray-300 rounded-full px-5 py-3 w-64 focus:outline-none
focus:ring-2 focus:ring-orange-400"
/>
<button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold
hover:bg-orange-600 transition">
Find Cooks
</button>
</div>
</div>
{/* How it works */}
<div className="max-w-4xl mx-auto px-4 pb-20">
<h2 className="text-2xl font-bold text-center text-gray-700 mb-10">How NearBite
Works</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
{[
{ icon: "🔍", title: "Browse", desc: "Search home cooks by pincode" },
{ icon: "📱", title: "WhatsApp", desc: "Send your order directly on WhatsApp" },
{ icon: "🏠", title: "Pickup", desc: "Pick up fresh food from their home" }
].map(step => (
<div key={step.title} className="bg-white rounded-2xl p-6 shadow-sm">
<div className="text-4xl mb-3">{step.icon}</div>
<h3 className="font-bold text-gray-800 mb-1">{step.title}</h3>
<p className="text-gray-500 text-sm">{step.desc}</p>
</div>
))}
</div>
</div>
</div>
);
}