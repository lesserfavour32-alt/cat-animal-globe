import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Camera, Mic, MicOff, Instagram, PlaySquare } from 'lucide-react';
import { Animal } from '../data/animals';

interface AnimalPanelProps {
  animal: Animal | null;
  onClose: () => void;
}

export const AnimalPanel: React.FC<AnimalPanelProps> = ({ animal, onClose }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const isDog = animal?.category === 'dog';
  const accent = isDog ? '#FFB562' : '#FF9EBB';
  const localFallbackImage = isDog
    ? 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80'
    : 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=1200&q=80';

  useEffect(() => {
    setImageFailed(false);
    if (speechSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [animal, speechSupported]);

  const handleToggleSpeak = () => {
    if (!animal || !speechSupported) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const text = `${animal.name}。${animal.description}。性格特点：${animal.personality}。外形特征：${animal.appearance}。养护建议：${animal.habits}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    // AnimatePresence 用于控制组件卸载时的离开动画
    <AnimatePresence>
      {animal && (
        <motion.div
          // 物理弹簧动效：从右侧飞入，带有轻微的弹性
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 w-full md:right-8 md:top-1/2 md:-translate-y-1/2 md:bottom-auto md:left-auto md:w-96 z-50"
        >
          {/* Core glassmorphism container */}
          <div className="relative overflow-hidden rounded-t-[40px] md:rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)] px-6 pt-6 pb-[calc(28px+env(safe-area-inset-bottom))] text-white max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Soft inner glow */}
            <div
              className="pointer-events-none absolute inset-x-0 -top-10 h-28 opacity-50 blur-2xl"
              style={{
                background: `radial-gradient(closest-side at 50% 60%, ${accent}55, transparent 70%)`,
              }}
            />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/20 hover:bg-black/35 border border-white/10 transition-all z-10 hover:scale-110"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>

            {/* Header image */}
            <div
              className={`w-full h-48 rounded-[24px] bg-gradient-to-br mb-6 flex items-center justify-center border border-white/10 overflow-hidden relative group ${
                isDog ? 'from-[#FFB562]/18 to-amber-500/10' : 'from-[#FF9EBB]/18 to-purple-500/18'
              }`}
            >
              {animal.imageUrl ? (
                <img 
                  src={imageFailed ? localFallbackImage : animal.imageUrl}
                  alt={animal.name} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <Camera className="w-10 h-10 text-white/30" />
              )}
              {/* Category badge */}
              <div
                className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider"
                style={{ color: accent }}
              >
                {animal.category || 'FELINE DATA'}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 relative z-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1 drop-shadow-md">{animal.name}</h2>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest" style={{ color: accent, opacity: 0.9 }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}66` }} />
                  <MapPin className="w-3 h-3 mr-1" />
                  {animal.origin || 'Unknown Origin'}
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] w-full bg-gradient-to-r from-white/30 via-white/10 to-transparent my-4" />

              <section>
                <h3 className="text-[11px] font-mono text-white/60 uppercase tracking-[0.16em] mb-2">品种简介</h3>
                <p className="text-sm text-white/90 leading-relaxed font-light">
                  {animal.description || 'No specific data found in the global database. This creature remains a mystery.'}
                </p>
              </section>

              <section>
                <h3 className="text-[11px] font-mono text-white/60 uppercase tracking-[0.16em] mb-2">性格特点</h3>
                <p className="text-sm text-white/85 leading-relaxed font-light">{animal.personality}</p>
              </section>

              <section>
                <h3 className="text-[11px] font-mono text-white/60 uppercase tracking-[0.16em] mb-2">外形特征</h3>
                <p className="text-sm text-white/85 leading-relaxed font-light">{animal.appearance}</p>
              </section>

              <section>
                <h3 className="text-[11px] font-mono text-white/60 uppercase tracking-[0.16em] mb-2">养护建议</h3>
                <p className="text-sm text-white/85 leading-relaxed font-light">{animal.habits}</p>
              </section>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleToggleSpeak}
                disabled={!speechSupported}
                className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 flex items-center justify-center gap-2 text-sm text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSpeaking ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {!speechSupported ? '当前设备不支持语音朗读' : isSpeaking ? '停止语音朗读' : '语音朗读介绍'}
              </motion.button>

              <div className="flex gap-3 mt-3">
                <a
                  href={`https://www.douyin.com/search/${encodeURIComponent(animal.douyinSearch || animal.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-3 py-3 flex items-center justify-center gap-2 text-xs text-white transition-colors ${
                    isDog ? 'hover:bg-[#FFB562]/18 hover:border-[#FFB562]/35' : 'hover:bg-[#FF9EBB]/18 hover:border-[#FF9EBB]/35'
                  }`}
                >
                  <PlaySquare className="w-4 h-4" />
                  在抖音观看
                </a>
                <a
                  href={`https://www.instagram.com/explore/tags/${encodeURIComponent(animal.douyinSearch || animal.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-3 py-3 flex items-center justify-center gap-2 text-xs text-white transition-colors ${
                    isDog ? 'hover:bg-[#FFB562]/18 hover:border-[#FFB562]/35' : 'hover:bg-[#FF9EBB]/18 hover:border-[#FF9EBB]/35'
                  }`}
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};