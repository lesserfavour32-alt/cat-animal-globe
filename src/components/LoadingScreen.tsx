import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(timer); setTimeout(() => setLoading(false), 800); return 100; }
        return prev + Math.random() * 15;
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#02040a] flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center">
            <div className="absolute -inset-24 flex items-center justify-center pointer-events-none">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-64 h-64 border border-[#00f2ff]/20 rounded-full border-dashed" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-80 h-80 border-t border-b border-[#00f2ff]/30 rounded-full" />
            </div>
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.3em] text-[#00f2ff] uppercase mb-8"># GLOBAL ANIMAL GLOBE</h1>
            <div className="flex flex-col items-center gap-1 mb-8">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-[4px]">Created by: Keven</div>
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-[4px]">Planning by: yaoyao</div>
            </div>
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden"><motion.div className="h-full bg-[#00f2ff]" style={{ width: `${progress}%` }} /></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};