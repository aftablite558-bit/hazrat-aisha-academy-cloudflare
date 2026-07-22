import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { ScrollProgressBar } from '../components/common/ScrollProgressBar';
import { ScrollToTop } from '../components/common/ScrollToTop';
import { MobileActionBar } from '../components/common/MobileActionBar';

export const PublicLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-transparent transition-colors pb-16 sm:pb-0 relative overflow-x-clip">
      {/* Scroll Progress Bar at Top */}
      <ScrollProgressBar />

      {/* Main Navbar Header */}
      <Navbar />

      {/* Animated Route Page Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-1 pt-20"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Main Footer */}
      <Footer />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

      {/* Mobile Bottom Quick Action Bar */}
      <MobileActionBar />
    </div>
  );
};

