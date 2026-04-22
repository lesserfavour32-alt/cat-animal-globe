import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import { Animal } from '../data/animals';

interface GlobeViewProps {
  onSelectAnimal: (animal: Animal) => void;
  selectedAnimal: Animal | null;
  animalsData: Animal[];
}

export const GlobeView: React.FC<GlobeViewProps> = ({ onSelectAnimal, selectedAnimal, animalsData }) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const globeTextureProps: any = {
    specularMapUrl: "//unpkg.com/three-globe/example/img/earth-water.png",
  };
  const selectedId = selectedAnimal?.id;
  const DATA_HUB = { lat: 39.9042, lng: 116.4074 }; // 北京

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sceneLights = useMemo(() => {
    const ambient = new THREE.AmbientLight(0xfff5fb, 0.78);
    const sun = new THREE.DirectionalLight(0xfff1e3, 1.65);
    sun.position.set(2, 1, 1);
    const fill = new THREE.DirectionalLight(0x6b5aa6, 0.75);
    fill.position.set(-2, -0.5, -1.5);
    return [ambient, sun, fill];
  }, []);

  const onGlobeReady = () => {
    if (globeRef.current) {
      globeRef.current.lights(sceneLights);
      const renderer = globeRef.current.renderer();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      const controls = globeRef.current.controls() as any;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.minDistance = 120;
      controls.maxDistance = 400;
      controls.enablePan = false; 
    }
  };

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const controls = globe.controls() as any;

    if (selectedAnimal) {
      if (controls) controls.autoRotate = false;
      globe.pointOfView({ lat: selectedAnimal.lat, lng: selectedAnimal.lng, altitude: 1.2 }, 1500);
      return;
    }

    if (controls) controls.autoRotate = true;
  }, [selectedAnimal]);

  return (
    <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
      <Globe
        ref={globeRef as any}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        {...globeTextureProps}
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#E6E6FA"
        atmosphereAltitude={dimensions.width < 768 ? 0.15 : 0.2}
        rendererConfig={{ antialias: false, powerPreference: "high-performance" }}
        arcsData={
          selectedAnimal
            ? [{ startLat: DATA_HUB.lat, startLng: DATA_HUB.lng, endLat: selectedAnimal.lat, endLng: selectedAnimal.lng }]
            : []
        }
        arcColor={() => animalsData[0]?.category === 'cat' ? '#FF9EBB' : '#FFB562'}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1500}
        arcStroke={1.5}
        arcAltitudeAutoScale={0.4}
        {...({
          htmlElementsData: animalsData,
          htmlLat: "lat",
          htmlLng: "lng",
          htmlElement: (d: Animal) => {
            const isCat = d.category === 'cat';
            const accent = isCat ? '#FF9EBB' : '#FFB562';
            const isSelected = d.id === selectedId;

            const marker = document.createElement('div');
            marker.className = isSelected ? 'cat-marker selected' : 'cat-marker';
            marker.style.color = accent;
            marker.style.borderColor = isCat ? 'rgba(255, 158, 187, 0.58)' : 'rgba(255, 181, 98, 0.58)';
            marker.style.boxShadow = isCat
              ? '0 0 16px rgba(255, 158, 187, 0.42)'
              : '0 0 16px rgba(255, 181, 98, 0.38)';

            const iconSvg = isCat
              ? `
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5.5 10.5L6.5 5.5L10.5 8.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 10.5L17.5 5.5L13.5 8.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.5 13.5C4.5 9.5 7.5 7 12 7C16.5 7 19.5 9.5 19.5 13.5C19.5 17.5 16.5 20 12 20C7.5 20 4.5 17.5 4.5 13.5Z" stroke="currentColor" stroke-width="1.7"/>
                  <path d="M9.5 13.5H9.51" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                  <path d="M14.5 13.5H14.51" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                  <path d="M10 16C10.6 16.6 11.2 17 12 17C12.8 17 13.4 16.6 14 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              `
              : `
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M7.5 10.2L5.7 7.2C5.3 6.5 5.7 5.6 6.5 5.5L9.1 5.1C9.7 5 10.2 5.4 10.3 6L10.7 8.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.5 10.2L18.3 7.2C18.7 6.5 18.3 5.6 17.5 5.5L14.9 5.1C14.3 5 13.8 5.4 13.7 6L13.3 8.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.2 13.2C6.2 9.6 8.9 7.6 12 7.6C15.1 7.6 17.8 9.6 17.8 13.2C17.8 16.8 15.1 19 12 19C8.9 19 6.2 16.8 6.2 13.2Z" stroke="currentColor" stroke-width="1.7"/>
                  <path d="M10 13.3H10.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                  <path d="M14 13.3H14.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                  <path d="M11 15.8C11.4 16.2 11.7 16.4 12 16.4C12.3 16.4 12.6 16.2 13 15.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              `;

            const labelAccent = accent;
            const labelHtml = `
              <div style="
                position: absolute;
                left: 50%;
                top: -8px;
                transform: translate(-50%, -100%);
                background: rgba(10, 15, 30, 0.72);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border: 1px solid rgba(255,255,255,0.12);
                border-left: 3px solid ${labelAccent};
                padding: 8px 12px;
                border-radius: 6px;
                color: white;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 12px;
                letter-spacing: 0.06em;
                pointer-events: none;
                white-space: nowrap;
                box-shadow: 0 8px 22px rgba(0,0,0,0.5);
                display: none;
                z-index: 9999;
              ">
                <div style="color:${labelAccent}; font-size: 9px; letter-spacing: 2px;">TARGET LOCKED</div>
                <div style="font-weight: 700; font-size: 14px; text-transform: uppercase;">${d.name}</div>
              </div>
            `;

            marker.style.position = 'relative';
            marker.innerHTML = `${iconSvg}${labelHtml}`;

            const tooltip = marker.lastElementChild as HTMLDivElement | null;

            const applyBaseStyle = () => {
              marker.style.zIndex = '1';
              marker.style.borderColor = isCat ? 'rgba(255, 158, 187, 0.58)' : 'rgba(255, 181, 98, 0.58)';
              marker.style.boxShadow = isCat
                ? '0 0 16px rgba(255, 158, 187, 0.42)'
                : '0 0 16px rgba(255, 181, 98, 0.38)';
              marker.style.background = 'rgba(15, 12, 22, 0.46)';
              marker.style.transform = isSelected ? 'scale(1.5)' : 'scale(1)';
              if (tooltip) tooltip.style.display = 'none';
            };

            const applyHoverStyle = () => {
              marker.style.zIndex = '9999';
              marker.style.background = isCat ? 'rgba(255, 158, 187, 0.18)' : 'rgba(255, 181, 98, 0.16)';
              marker.style.transform = 'scale(1.4) translateY(-5px)';
              marker.style.boxShadow = isCat
                ? '0 0 30px rgba(255, 158, 187, 0.7), 0 0 10px rgba(255,255,255,0.55)'
                : '0 0 30px rgba(255, 181, 98, 0.62), 0 0 10px rgba(255,255,255,0.55)';
              if (tooltip) tooltip.style.display = 'block';
            };

            if (isSelected) {
              marker.style.background = 'rgba(255, 255, 255, 0.95)';
              marker.style.borderColor = '#ffffff';
              marker.style.color = '#050a12';
              marker.style.boxShadow = isCat
                ? '0 0 36px rgba(255, 255, 255, 0.92), 0 0 22px rgba(255, 158, 187, 0.55)'
                : '0 0 36px rgba(255, 255, 255, 0.92), 0 0 22px rgba(255, 181, 98, 0.5)';
            }

            marker.onclick = () => onSelectAnimal(d);

            marker.onmouseenter = () => {
              applyHoverStyle();
              const controls = globeRef.current?.controls() as any;
              if (controls) controls.autoRotate = false;
            };
            marker.onmouseleave = () => {
              applyBaseStyle();
              if (isSelected) {
                marker.style.background = 'rgba(255, 255, 255, 0.95)';
                marker.style.borderColor = '#ffffff';
                marker.style.color = '#050a12';
                marker.style.transform = 'scale(1.5)';
                marker.style.boxShadow = isCat
                  ? '0 0 36px rgba(255, 255, 255, 0.92), 0 0 22px rgba(255, 158, 187, 0.55)'
                  : '0 0 36px rgba(255, 255, 255, 0.92), 0 0 22px rgba(255, 181, 98, 0.5)';
              }
              const controls = globeRef.current?.controls() as any;
              if (controls) controls.autoRotate = true;
            };

            return marker;
          },
        } as any)}
        
        backgroundColor="rgba(0,0,0,0)"
        onGlobeReady={onGlobeReady}
      />
    </div>
  );
};