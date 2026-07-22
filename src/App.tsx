import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { School } from 'lucide-react';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Admissions from './pages/Admissions';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="bg-white p-12 rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center text-center">
    <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
      <School className="h-8 w-8" />
    </div>
    <h2 className="text-2xl font-bold text-neutral-900 mb-2">{title} Portal</h2>
    <p className="text-neutral-500 max-w-md">
      This module is currently being synchronized with the academy's central database. 
      Please check back shortly for full access.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/results" element={<PlaceholderPage title="Results" />} />
          <Route path="/notices" element={<PlaceholderPage title="Notice Board" />} />
          <Route path="/calendar" element={<PlaceholderPage title="Academic Calendar" />} />
          <Route path="/gallery" element={<PlaceholderPage title="School Gallery" />} />
          <Route path="/communication" element={<PlaceholderPage title="Communication" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
