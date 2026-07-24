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
    <div className="h-[100dvh] w-full bg-transparent transition-colors flex flex-col overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="lg:pl-[280px] flex-1 flex flex-col w-full pt-20">
        <main className="flex-1 w-full p-4 md:p-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
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
