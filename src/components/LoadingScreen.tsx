import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const speedFactor = 0.75;

  const palette = useMemo(
    () => ({
      bg0: '#050408',
      bg1: '#0F0C16',
      pink: '#FF9EBB',
      amber: '#FFB562',
      purple: '#6B5AA6',
      ice: '#DCEEFF',
    }),
    [],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), Math.round(700 / speedFactor));
          return 100;
        }
        const next = prev + (6 + Math.random() * 14) * speedFactor;
        return Math.min(100, next);
      });
    }, 140);
    return () => clearInterval(timer);
  }, [speedFactor]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: `radial-gradient(1100px 780px at 50% 40%, ${palette.purple}18, transparent 62%),
              radial-gradient(900px 650px at 20% 30%, ${palette.pink}18, transparent 58%),
              radial-gradient(900px 650px at 80% 70%, ${palette.amber}12, transparent 60%),
              linear-gradient(180deg, ${palette.bg1} 0%, ${palette.bg0} 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen"
            style={{
              background:
                'repeating-linear-gradient(180deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, rgba(0,0,0,0) 5px, rgba(0,0,0,0) 9px)',
            }}
          />

          <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] flex items-center justify-center">
            <motion.div
              aria-hidden
              className="absolute inset-[-30%] rounded-full blur-3xl opacity-70"
              animate={{ opacity: [0.55, 0.8, 0.55] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: `radial-gradient(circle at 30% 35%, ${palette.pink}55, transparent 50%),
                  radial-gradient(circle at 70% 70%, ${palette.amber}40, transparent 55%),
                  radial-gradient(circle at 55% 45%, ${palette.purple}45, transparent 60%)`,
              }}
            />

            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{
                border: `1px dashed ${palette.ice}2E`,
                boxShadow: `0 0 40px ${palette.pink}22, 0 0 70px ${palette.purple}1A`,
              }}
            />

            <motion.div
              aria-hidden
              className="absolute inset-[10%] rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
              style={{
                borderTop: `1px solid ${palette.pink}44`,
                borderBottom: `1px solid ${palette.amber}3A`,
              }}
            />

            <div
              className="absolute inset-[14%] rounded-full"
              style={{
                background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.12), rgba(255,255,255,0.03) 55%, rgba(0,0,0,0) 70%)`,
                border: `1px solid rgba(255,255,255,0.08)`,
                boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 28px ${palette.purple}1E`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-70"
                style={{
                  background:
                    'repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, rgba(0,0,0,0) 6px, rgba(0,0,0,0) 12px)',
                  maskImage: 'radial-gradient(circle at 50% 45%, black 55%, transparent 72%)',
                  WebkitMaskImage: 'radial-gradient(circle at 50% 45%, black 55%, transparent 72%)',
                }}
              />

              <motion.div
                aria-hidden
                className="absolute left-0 right-0 h-[2px]"
                animate={{ top: ['10%', '88%', '10%'] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  background: `linear-gradient(90deg, transparent, ${palette.pink}CC, ${palette.amber}CC, transparent)`,
                  boxShadow: `0 0 18px ${palette.pink}55, 0 0 28px ${palette.amber}33`,
                  opacity: 0.85,
                }}
              />
            </div>

            <motion.div
              aria-hidden
              className="absolute inset-[6%] rounded-full"
              style={{
                background: `conic-gradient(from 180deg, ${palette.pink}00 0deg, ${palette.pink}00 20deg, ${palette.pink}55 ${Math.max(
                  20,
                  progress * 3.6,
                )}deg, transparent 0deg)`,
                filter: 'blur(1px)',
                opacity: 0.6,
                maskImage: 'radial-gradient(circle at 50% 50%, transparent 58%, black 61%, black 67%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 58%, black 61%, black 67%, transparent 70%)',
              }}
            />
          </div>

          <div className="relative flex flex-col items-center -mt-8 md:-mt-10">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
              className="text-center"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/40">
                Boot sequence · Global Animal Atlas
              </div>
              <h1
                className="mt-2 text-3xl md:text-5xl font-light tracking-[0.26em] uppercase"
                style={{
                  background: `linear-gradient(90deg, ${palette.pink}, ${palette.amber}, ${palette.purple})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: `0 0 26px ${palette.pink}22`,
                }}
              >
                GLOBAL ANIMAL GLOBE
              </h1>
            </motion.div>

            <div className="mt-6 w-[280px] md:w-[360px]">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.28em] text-white/40">
                <span>Initializing</span>
                <span style={{ color: progress >= 92 ? palette.amber : palette.pink }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden bg-white/5 border border-white/10">
                <motion.div
                  className="h-full"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${palette.pink}, ${palette.amber})`,
                    boxShadow: `0 0 18px ${palette.pink}40`,
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-[0.34em] text-white/30">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: palette.pink, boxShadow: `0 0 10px ${palette.pink}80` }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: palette.amber, boxShadow: `0 0 10px ${palette.amber}70` }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: palette.purple, boxShadow: `0 0 10px ${palette.purple}70` }} />
                <span>Synchronizing habitats</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};