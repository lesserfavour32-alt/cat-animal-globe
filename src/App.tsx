import React, { useState } from 'react';
import { GlobeView } from './components/GlobeView';
import { AnimalPanel } from './components/AnimalPanel';
import { Background } from './components/Background';
import { LoadingScreen } from './components/LoadingScreen';
import { ANIMALS, Animal, AnimalCategory } from './data/animals';
import { motion } from 'motion/react';
import { Globe as GlobeIcon, Info, Cat } from 'lucide-react';

export default function App() {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [currentCategory, setCurrentCategory] = useState<AnimalCategory>('cat');

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black selection:bg-cyan-500/30">
      <LoadingScreen />
      <Background />

      <header className="fixed top-0 left-0 w-full z-40 p-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="pointer-events-auto">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-2xl backdrop-blur-md">
                <GlobeIcon className="text-[#00f2ff]" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-light tracking-[2px] text-[#00f2ff] uppercase">全球动物百科</h1>
                <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 tracking-[3px] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse shadow-[0_0_10px_#00f2ff]" />
                  Global Animal Atlas v1.1.0
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Switcher */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="pointer-events-auto flex items-center gap-6 bg-black/20 backdrop-blur-xl border border-white/5 p-3 px-6 rounded-[2rem]"
          >
            <div className="flex flex-col items-center gap-2">
              <motion.button
                onClick={() => setCurrentCategory('cat')}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`relative group w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  currentCategory === 'cat' ? 'bg-[#00f2ff]/20 border-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.4)]' : 'bg-white/5 border-white/10'
                } border`}
              >
                <div className="absolute -top-1 -left-0.5 w-4 h-4 bg-inherit border-l border-t border-inherit rounded-tl-lg rotate-[-10deg]" />
                <div className="absolute -top-1 -right-0.5 w-4 h-4 bg-inherit border-r border-t border-inherit rounded-tr-lg rotate-[10deg]" />
                <Cat size={24} className={currentCategory === 'cat' ? 'text-[#00f2ff]' : 'text-white/40'} />
              </motion.button>
              <span className={`text-[9px] font-mono uppercase tracking-widest ${currentCategory === 'cat' ? 'text-[#00f2ff]' : 'text-white/20'}`}>Cats</span>
            </div>

            <div className="flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
              <motion.button className="relative group w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
                <div className="absolute -top-1 -left-0.5 w-4 h-4 bg-inherit border-l border-t border-white/10 rounded-tl-lg rotate-[-10deg]" />
                <div className="absolute -top-1 -right-0.5 w-4 h-4 bg-inherit border-r border-t border-white/10 rounded-tr-lg rotate-[10deg]" />
                <Cat size={24} className="text-[#ff9933]/40" />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white/60 rotate-[-15deg] font-bold">LOCK</span>
                </div>
              </motion.button>
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/10">Dogs</span>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="w-full h-full">
        <GlobeView selectedAnimal={selectedAnimal} onSelectAnimal={setSelectedAnimal} />
      </main>

      <AnimalPanel animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
    </div>
  );
}