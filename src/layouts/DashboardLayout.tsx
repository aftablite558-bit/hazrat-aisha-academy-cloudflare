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
    const frame = requestAnimationFrame(() => {
      perfTracker.endDashboardInit();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col overflow-x-hidden bg-transparent transition-colors">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex-1 flex flex-col w-full lg:pl-[280px] pt-20">
        <main className="flex-1 w-full p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-full mx-auto"
            >
              <ErrorBoundary><Outlet /></ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
