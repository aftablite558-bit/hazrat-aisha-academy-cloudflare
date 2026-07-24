import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

export const PublicLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-transparent transition-colors">
      <Navbar />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 pt-24"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};
