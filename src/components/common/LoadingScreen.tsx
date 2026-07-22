import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Hazrat Aisha Academy", 
  fullScreen = true 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden z-50 ${fullScreen ? 'fixed inset-0 min-h-screen w-screen' : 'w-full py-20 min-h-[400px] rounded-3xl'}`}>
      
      {/* Radial Glow Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Animated Crest Container */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm px-6 text-center">
        
        {/* Animated Pulsing Logo Ring */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          
          {/* Rotating Outer Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-3xl border-2 border-dashed border-emerald-500/40"
          />

          {/* Pulsing Backlight */}
          <motion.div 
            animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-2 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 blur-md"
          />

          {/* Center Logo Box */}
          <div className="relative w-20 h-20 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center shadow-2xl shadow-emerald-950">
            <GraduationCap className="text-emerald-400" size={38} />
          </div>

          {/* Sparkle Badge */}
          <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-md">
            <Sparkles size={12} className="animate-spin" />
          </div>
        </div>

        {/* Brand Text */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            {message}
          </h2>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">
            Sitamarhi, Bihar • Academic Portal
          </p>
        </div>

        {/* Loading Progress Bar Indicator */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative border border-white/10 mt-2">
          <motion.div 
            animate={{ 
              x: ['-100%', '100%'] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-full h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full"
          />
        </div>

        <p className="text-[11px] text-slate-400 font-medium tracking-wide font-arabic">
          رَبِّ زِدْنِي عِلْمًا • Preparing Academic Resources
        </p>

      </div>
    </div>
  );
};
