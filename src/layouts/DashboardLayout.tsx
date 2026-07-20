import { GlassSidebar as Sidebar } from '../components/layout/Sidebar';
import { GlassHeader as Header } from '../components/layout/Header';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { perfTracker } from '../utils/performance';

export const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    perfTracker.startDashboardInit();
    // Simulate dashboard finished loading after first render
    const frame = requestAnimationFrame(() => {
      perfTracker.endDashboardInit();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="min-h-screen bg-transparent transition-colors flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="flex-1 lg:pl-[300px] pt-24 p-4 md:p-8 w-full max-w-full overflow-x-hidden mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
