import React, { useEffect, useRef, useState } from 'react';
import { GlobeView } from './components/GlobeView';
import { AnimalPanel } from './components/AnimalPanel';
import { LoadingScreen } from './components/LoadingScreen';
import { Animal, AnimalCategory } from './data/animals';
import { motion } from 'motion/react';
import { Globe as GlobeIcon, Cat, Music2, VolumeX } from 'lucide-react';

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(560, Math.max(240, Math.floor((w * h) / 8500)));
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

        if (s.r > 0.95) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.2);
          glow.addColorStop(0, `rgba(200, 232, 255, ${alpha * 0.55})`);
          glow.addColorStop(0.35, `rgba(180, 210, 255, ${alpha * 0.2})`);
          glow.addColorStop(1, 'rgba(160, 200, 255, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

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
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [globallyMuted, setGloballyMuted] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedMute = window.localStorage.getItem('cat-globe-muted') === '1';
    setGloballyMuted(savedMute);
    const savedBgm = window.localStorage.getItem('cat-globe-bgm') === '1';
    setBgmEnabled(savedBgm && !savedMute);
  }, []);

  useEffect(() => {
    if (globallyMuted || !bgmEnabled) {
      if (bgmRef.current) bgmRef.current.pause();
      return;
    }
    if (!bgmRef.current) {
      bgmRef.current = new Audio(
        'https://cdn.pixabay.com/download/audio/2022/11/03/audio_9f309668f4.mp3?filename=ambient-piano-amp-pad-10711.mp3',
      );
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.25;
    }
    bgmRef.current.play().catch(() => {
      setBgmEnabled(false);
      window.localStorage.setItem('cat-globe-bgm', '0');
    });
  }, [bgmEnabled, globallyMuted]);

  useEffect(() => {
    const onStorage = () => {
      const savedMute = window.localStorage.getItem('cat-globe-muted') === '1';
      setGloballyMuted(savedMute);
      if (savedMute) setBgmEnabled(false);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleBgm = () => {
    if (globallyMuted) return;
    const next = !bgmEnabled;
    setBgmEnabled(next);
    window.localStorage.setItem('cat-globe-bgm', next ? '1' : '0');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020308] selection:bg-cyan-500/30">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 125% 85% at 50% 38%, #122338 0%, #0a1524 38%, #050a12 72%, #020308 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/25 via-transparent to-[#020308]/90" />
        <Starfield />
      </div>

      <LoadingScreen />

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

            <div className="h-10 w-px bg-white/10" />
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleBgm}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-mono tracking-wider uppercase transition-all ${
                globallyMuted
                  ? 'opacity-50 cursor-not-allowed border-white/10 text-white/30'
                  : bgmEnabled
                  ? 'border-[#00f2ff]/40 bg-[#00f2ff]/15 text-[#00f2ff]'
                  : 'border-white/15 bg-white/5 text-white/60'
              }`}
            >
              {globallyMuted ? <VolumeX size={14} /> : <Music2 size={14} />}
              {globallyMuted ? 'Muted' : bgmEnabled ? 'BGM On' : 'BGM Off'}
            </motion.button>
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