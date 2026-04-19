import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Camera, Volume2, Pause, Mic, MicOff } from 'lucide-react';
import { Animal } from '../data/animals';

interface AnimalPanelProps {
  animal: Animal | null;
  onClose: () => void;
}

export const AnimalPanel: React.FC<AnimalPanelProps> = ({ animal, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const localFallbackImage = 'https://loremflickr.com/1200/900/cat,portrait?lock=999';

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setImageFailed(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [animal]);

  useEffect(() => {
    const saved = window.localStorage.getItem('cat-globe-muted');
    setIsMuted(saved === '1');
  }, []);

  const handleToggleSound = async () => {
    if (!animal) return;
    if (isMuted) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(animal.soundUrl);
      audioRef.current.volume = 0.65;
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    window.localStorage.setItem('cat-globe-muted', next ? '1' : '0');
    if (next) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsSpeaking(false);
    }
  };

  const handleToggleSpeak = () => {
    if (!animal || isMuted) return;
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
          className="fixed right-8 top-1/2 -translate-y-1/2 w-80 z-50"
        >
          {/* Core glassmorphism container */}
          <div className="relative overflow-hidden rounded-[24px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] p-6 text-white">
            
            {/* Accent glow behind the panel */}
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-[#00f2ff] rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 border border-white/5 transition-all z-10 hover:scale-110"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>

            {/* Header image */}
            <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-[#00f2ff]/20 to-purple-500/20 mb-6 flex items-center justify-center border border-white/10 overflow-hidden relative group">
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
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[10px] font-mono text-[#00f2ff] uppercase tracking-wider">
                {animal.category || 'FELINE DATA'}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 relative z-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1 drop-shadow-md">{animal.name}</h2>
                <div className="flex items-center text-[#00f2ff]/80 text-xs font-mono uppercase tracking-widest">
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
                onClick={handleToggleSound}
                disabled={isMuted}
                className="w-full mt-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-white hover:bg-white/15 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isMuted ? '当前已静音' : isPlaying ? '暂停猫咪叫声' : '播放猫咪叫声'}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleToggleSpeak}
                disabled={isMuted}
                className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-white hover:bg-white/15 transition-colors"
              >
                {isSpeaking ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isMuted ? '当前已静音' : isSpeaking ? '停止语音朗读' : '语音朗读介绍'}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleToggleMute}
                className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-white hover:bg-white/15 transition-colors"
              >
                {isMuted ? <Volume2 className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                {isMuted ? '取消全局静音' : '开启全局静音'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};