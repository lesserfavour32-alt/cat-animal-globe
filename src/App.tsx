import React, { useEffect, useRef, useState } from 'react';
import { GlobeView } from './components/GlobeView';
import { AnimalPanel } from './components/AnimalPanel';
import { LoadingScreen } from './components/LoadingScreen';
import { ANIMALS, Animal, AnimalCategory } from './data/animals';
import { motion } from 'motion/react';
import { Globe as GlobeIcon, Cat, Dog } from 'lucide-react';

type Star = {
  x: number;
  y: number;
  r: number;
  twPhase: number;
  twSpeed: number;
  driftX: number;
  driftY: number;
};

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let raf = 0;
    let t = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const isMobile = window.innerWidth < 768;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const densityTarget = Math.floor((w * h) / 12000);
      const maxStars = isMobile ? 80 : 200;
      const target = Math.min(maxStars, Math.max(isMobile ? 50 : 120, densityTarget));
      stars = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.45 + 0.12,
        twPhase: Math.random() * Math.PI * 2,
        twSpeed: 0.35 + Math.random() * 1.15,
        driftX: (Math.random() - 0.5) * 0.06,
        driftY: (Math.random() - 0.5) * 0.06,
      }));
    };

    const draw = () => {
      t += 0.015;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.x += s.driftX;
        s.y += s.driftY;
        if (s.x < -4) s.x = w + 4;
        if (s.x > w + 4) s.x = -4;
        if (s.y < -4) s.y = h + 4;
        if (s.y > h + 4) s.y = -4;

        const twinkle = 0.32 + 0.68 * (0.5 + 0.5 * Math.sin(t * s.twSpeed + s.twPhase));
        const alpha = twinkle * (0.38 + Math.min(s.r, 1.4) * 0.22);

        ctx.fillStyle = `rgba(220, 238, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.92] mix-blend-screen"
      aria-hidden
    />
  );
};

export default function App() {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [currentCategory, setCurrentCategory] = useState<AnimalCategory>('cat');
  const [activeFilter, setActiveFilter] = useState<string>('全部');
  useEffect(() => {
    setActiveFilter('全部');
  }, [currentCategory]);

  const filterTags =
    currentCategory === 'cat'
      ? ['全部', '长毛', '短毛', '温顺', '活泼', '粘人', '聪明', '独立']
      : ['全部', '大型犬', '中型犬', '小型犬', '聪明', '护卫', '精力旺盛', '温顺'];
  const filterActiveClass =
    currentCategory === 'dog'
      ? 'bg-[#FFB562]/15 border border-[#FFB562]/55 text-[#FFB562] shadow-[0_0_16px_rgba(255,181,98,0.28)]'
      : 'bg-[#FF9EBB]/15 border border-[#FF9EBB]/55 text-[#FF9EBB] shadow-[0_0_16px_rgba(255,158,187,0.28)]';

  const categoryAnimals = ANIMALS.filter((a) => a.category === currentCategory);
  const filteredAnimals =
    activeFilter === '全部'
      ? categoryAnimals
      : categoryAnimals.filter(
          (a) =>
            a.tags?.includes(activeFilter) ||
            a.personality.includes(activeFilter) ||
            a.description.includes(activeFilter),
        );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050408] selection:bg-pink-400/30">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 125% 85% at 50% 38%, #1A1525 0%, #0F0C16 38%, #050408 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff9ebb]/10 via-transparent to-[#050408]/90" />
        <Starfield />
      </div>

      <LoadingScreen />

      <header className="fixed top-0 left-0 w-full z-40 p-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="pointer-events-auto">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                <GlobeIcon className="text-[#FF9EBB]" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-light tracking-[2px] text-[#FF9EBB] uppercase">全球动物百科</h1>
                <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 tracking-[3px] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF9EBB] animate-pulse shadow-[0_0_10px_rgba(255,158,187,0.7)]" />
                  Global Animal Atlas v1.1.0
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col items-end">
            {/* Category Switcher */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
              className="pointer-events-auto flex items-center gap-6 bg-black/20 backdrop-blur-md md:backdrop-blur-xl border border-white/5 p-3 px-6 rounded-[2rem]"
            >
              <div className="flex flex-col items-center gap-2">
                <motion.button
                  onClick={() => setCurrentCategory('cat')}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative group w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentCategory === 'cat'
                      ? 'bg-[#FF9EBB]/20 border-[#FF9EBB] shadow-[0_0_20px_rgba(255,158,187,0.35)]'
                      : 'bg-white/5 border-white/10'
                  } border`}
                >
                  <div className="absolute -top-1 -left-0.5 w-4 h-4 bg-inherit border-l border-t border-inherit rounded-tl-lg rotate-[-10deg]" />
                  <div className="absolute -top-1 -right-0.5 w-4 h-4 bg-inherit border-r border-t border-inherit rounded-tr-lg rotate-[10deg]" />
                  <Cat size={24} className={currentCategory === 'cat' ? 'text-[#FF9EBB]' : 'text-white/40'} />
                </motion.button>
                <span className={`text-[9px] font-mono uppercase tracking-widest ${currentCategory === 'cat' ? 'text-[#FF9EBB]' : 'text-white/20'}`}>Cats</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <motion.button
                  onClick={() => setCurrentCategory('dog')}
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative group w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentCategory === 'dog'
                      ? 'bg-[#FFB562]/20 border-[#FFB562] shadow-[0_0_20px_rgba(255,181,98,0.32)]'
                      : 'bg-white/5 border-white/10'
                  } border`}
                >
                  <div className="absolute -top-1 -left-0.5 w-4 h-4 bg-inherit border-l border-t border-white/10 rounded-tl-lg rotate-[-10deg]" />
                  <div className="absolute -top-1 -right-0.5 w-4 h-4 bg-inherit border-r border-t border-white/10 rounded-tr-lg rotate-[10deg]" />
                  <Dog size={24} className={currentCategory === 'dog' ? 'text-[#FFB562]' : 'text-white/40'} />
                </motion.button>
                <span className={`text-[9px] font-mono uppercase tracking-widest ${currentCategory === 'dog' ? 'text-[#FFB562]' : 'text-white/20'}`}>Dogs</span>
              </div>
            </motion.div>

            <motion.div className="flex flex-nowrap md:flex-wrap gap-2 mt-4 pointer-events-auto overflow-x-auto no-scrollbar pb-2">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveFilter(tag)}
                  className={`rounded-lg text-[11px] font-mono tracking-widest px-3 py-1.5 transition-all ${
                    activeFilter === tag
                      ? filterActiveClass
                      : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </header>

      <main className="w-full h-full">
        <GlobeView selectedAnimal={selectedAnimal} onSelectAnimal={setSelectedAnimal} animalsData={filteredAnimals} />
      </main>

      <AnimalPanel animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
    </div>
  );
}