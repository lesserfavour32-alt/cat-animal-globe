import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Camera } from 'lucide-react';
import { Animal } from '../data/animals';

interface AnimalPanelProps {
  animal: Animal | null;
  onClose: () => void;
}

export const AnimalPanel: React.FC<AnimalPanelProps> = ({ animal, onClose }) => {
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
          {/* ✨ 核心磨砂玻璃容器 */}
          <div className="relative overflow-hidden rounded-[24px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] p-6 text-white">
            
            {/* 炫光背景点缀 (让玻璃有发光透出来的感觉) */}
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-[#00f2ff] rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none" />

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 border border-white/5 transition-all z-10 hover:scale-110"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>

            {/* 顶部图片/占位区 */}
            <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-[#00f2ff]/20 to-purple-500/20 mb-6 flex items-center justify-center border border-white/10 overflow-hidden relative group">
              {animal.imageUrl ? (
                <img 
                  src={animal.imageUrl} 
                  alt={animal.name} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                />
              ) : (
                <Camera className="w-10 h-10 text-white/30" />
              )}
              {/* 标签 */}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[10px] font-mono text-[#00f2ff] uppercase tracking-wider">
                {animal.category || 'FELINE DATA'}
              </div>
            </div>

            {/* 内容区 */}
            <div className="space-y-4 relative z-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1 drop-shadow-md">{animal.name}</h2>
                <div className="flex items-center text-[#00f2ff]/80 text-xs font-mono uppercase tracking-widest">
                  <MapPin className="w-3 h-3 mr-1" />
                  {animal.origin || 'Unknown Origin'}
                </div>
              </div>

              {/* 分割线 */}
              <div className="h-[1px] w-full bg-gradient-to-r from-white/30 via-white/10 to-transparent my-4" />

              {/* 描述文本 */}
              <p className="text-sm text-white/80 leading-relaxed font-light">
                {animal.description || 'No specific data found in the global database. This creature remains a mystery.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};