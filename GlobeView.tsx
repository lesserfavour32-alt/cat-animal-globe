import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import { ANIMALS, Animal } from '../data/animals';

interface GlobeViewProps {
  onSelectAnimal: (animal: Animal) => void;
  selectedAnimal: Animal | null;
}

export const GlobeView: React.FC<GlobeViewProps> = ({ onSelectAnimal, selectedAnimal }) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // 🎯 新增：用于记录当前鼠标“悬停”在哪个猫咪点位上
  const [hoverD, setHoverD] = useState<any>(null);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sceneLights = useMemo(() => {
    const ambient = new THREE.AmbientLight(0x2a2e45, 0.6); 
    const sun = new THREE.DirectionalLight(0xfff5eb, 2.5);
    sun.position.set(2, 1, 1); 
    const fill = new THREE.DirectionalLight(0x7ec8ff, 0.8);
    fill.position.set(-2, -0.5, -1.5);
    return [ambient, sun, fill];
  }, []);

  const onGlobeReady = () => {
    if (globeRef.current) {
      globeRef.current.lights(sceneLights);
      const controls = globeRef.current.controls() as any;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.minDistance = 120;
      controls.maxDistance = 400;
      controls.enablePan = false; 
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
      <Globe
        ref={globeRef as any}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#3a86ff"
        atmosphereAltitude={0.2}
        
        pointsData={ANIMALS}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.08}
        
        // ✨ 交互升级 1：呼吸感体积变化（悬停或选中时变大）
        pointRadius={(d: any) => (d === hoverD || d === selectedAnimal) ? 1.2 : 0.6}
        
        // ✨ 交互升级 2：颜色高亮反馈（平时是赛博青色，悬停变耀眼纯白）
        pointColor={(d: any) => (d === hoverD || d === selectedAnimal) ? '#ffffff' : '#00f2ff'}
        
        // ✨ 交互升级 3：科技感十足的鼠标跟随浮窗 (HTML 注入)
        pointLabel={(d: any) => `
          <div style="
            background: rgba(10, 15, 30, 0.7);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(0, 242, 255, 0.3);
            border-left: 3px solid #00f2ff;
            padding: 8px 12px;
            border-radius: 4px;
            color: white;
            font-family: monospace;
            font-size: 12px;
            pointer-events: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            transition: all 0.2s ease;
          ">
            <span style="color: #00f2ff; font-size: 9px; letter-spacing: 2px;">TARGET LOCKED</span><br/>
            <span style="font-weight: bold; font-size: 14px; text-transform: uppercase;">${d.name}</span>
          </div>
        `}
        
        // ✨ 交互升级 4：精准捕捉鼠标划过事件，并逼停地球转动
        onPointHover={(point: any) => {
          setHoverD(point);
          if (globeRef.current) {
            const controls = globeRef.current.controls() as any;
            // 如果鼠标悬停在点上 (point 存在)，地球停止自转；移开则继续
            controls.autoRotate = !point; 
          }
        }}

        onPointClick={(point: any) => onSelectAnimal(point as Animal)}
        
        backgroundColor="rgba(0,0,0,0)"
        onGlobeReady={onGlobeReady}
      />
    </div>
  );
};