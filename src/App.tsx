import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import { About, Academics, Admissions, Gallery, Contact } from './pages/public/Placeholders';

// Auth Pages
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    await login({});
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-mesh">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-black text-white">Marhaba</h1>
        <p className="text-slate-400">Welcome back to Hazrat Aisha Academy ERP</p>
        <div className="glass-card p-8 space-y-6">
          <input className="glass-input w-full" placeholder="Email Address" type="email" />
          <input className="glass-input w-full" placeholder="Password" type="password" />
          <button onClick={handleLogin} className="glass-button w-full bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
