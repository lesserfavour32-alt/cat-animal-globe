import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Camera, Cat as CatIcon } from 'lucide-react';
import { Animal } from '../data/animals';
import { cn } from '../lib/utils';

interface AnimalPanelProps {
  animal: Animal | null;
  onClose: () => void;
}

const CuteCatButton = ({ onClick, children, className, icon: Icon }: any) => (
  <motion.button
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={cn("relative group flex flex-col items-center justify-center gap-1", className)}
  >
    <div className="relative w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center transition-all">
      <div className="absolute -top-1 -left-1 w-4 h-4 bg-inherit border-l border-t border-white/20 rounded-tl-lg rotate-[-15deg]" />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-inherit border-r border-t border-white/20 rounded-tr-lg rotate-[15deg]" />
      <Icon size={20} className="text-white/80 group-hover:text-[#00f2ff]" />
    </div>
    {children}
  </motion.button>
);

export const AnimalPanel: React.FC<AnimalPanelProps> = ({ animal, onClose }) => {
  return (
    <AnimatePresence>
      {animal && (
        <motion.div
          initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
          className="fixed right-10 top-10 bottom-10 w-80 z-50 flex flex-col"
        >
          <div className="glass-panel rounded-[24px] h-full flex flex-col overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] to-transparent opacity-60" />
              <div className="absolute bottom-4 right-4">
                <CuteCatButton icon={Camera} onClick={() => alert('上传功能即将开放')}>
                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest mt-1">[Upload/Mod Image]</span>
                </CuteCatButton>
              </div>
              <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full"><X size={18} /></button>
            </div>

            <div className="px-8 pt-6 pb-4">
              <h2 className="text-3xl font-semibold tracking-tight text-gradient mb-2">{animal.name.split(' (')[0]}</h2>
              <div className="flex flex-wrap gap-1.5">
                {animal.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-white/60">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 px-8 pb-8 scrollbar-hide">
              <section>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[1px] mb-2">性格习性</div>
                <p className="text-white/90 leading-relaxed text-[14px] font-light">{animal.personality}</p>
              </section>
              <section>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[1px] mb-2">体型外貌</div>
                <p className="text-white/90 leading-relaxed text-[14px] font-light">{animal.appearance}</p>
              </section>
            </div>

            <div className="px-8 pb-8 pt-4 border-t border-white/5 flex flex-col items-center gap-4">
              <motion.a
                href={`https://www.douyin.com/search/${encodeURIComponent(animal.douyinSearch + ' 搞笑')}`}
                target="_blank" whileHover={{ scale: 1.1, rotate: -5 }} className="relative group"
              >
                <div className="w-16 h-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-center">
                  <div className="absolute -top-1 left-2 w-5 h-5 bg-inherit border-l border-t border-white/10 rounded-tl-xl rotate-[-10deg]" />
                  <div className="absolute -top-1 right-2 w-5 h-5 bg-inherit border-r border-t border-white/10 rounded-tr-xl rotate-[10deg]" />
                  <CatIcon size={32} className="text-[#00f2ff]" />
                </div>
              </motion.a>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[2px]">SOCIAL_QUERY</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};