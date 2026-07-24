import { GlassSidebar as Sidebar } from '../components/layout/Sidebar';
import { GlassHeader as Header } from '../components/layout/Header';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
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
    <div className="min-h-screen bg-transparent transition-colors flex flex-col">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="lg:pl-[280px] flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-4 pb-4 md:px-8 md:pb-8 pt-24 md:pt-28 w-full max-w-full min-w-0 mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ErrorBoundary><Outlet /></ErrorBoundary>
          </motion.div>
        </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
