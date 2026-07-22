import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admissions from './pages/Admissions';
import Results from './pages/Results';
import Notices from './pages/Notices';
import Calendar from './pages/Calendar';
import Gallery from './pages/Gallery';
import Communication from './pages/Communication';
import Staff from './pages/Staff';
import Apply from './pages/Apply';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/apply" element={<Apply />} />
        </Route>

        {/* ERP Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/staff" element={<Staff />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
