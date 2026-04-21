import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Browse from './pages/Browse';
import CookProfile from './pages/CookProfile';
import ProtectedRoute from './components/ProtectedRoute';
import CookDashboard from './pages/cook/CookDashboard';
import CookProfileEdit from './pages/cook/CookProfileEdit';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerProfileEdit from './pages/buyer/BuyerProfileEdit';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/signup"   element={<Signup />} />
        <Route path="/browse"   element={<Browse />} />
        <Route path="/cook/:id" element={<CookProfile />} />

        {/* Cook only */}
        <Route path="/cook/dashboard" element={
          <ProtectedRoute allowedRole="cook"><CookDashboard /></ProtectedRoute>
        } />
        <Route path="/cook/profile" element={
          <ProtectedRoute allowedRole="cook"><CookProfileEdit /></ProtectedRoute>
        } />

        {/* Buyer only */}
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute allowedRole="buyer"><BuyerDashboard /></ProtectedRoute>
        } />
        <Route path="/buyer/profile" element={
          <ProtectedRoute allowedRole="buyer"><BuyerProfileEdit /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}