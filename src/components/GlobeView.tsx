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
      controls.autoRotateSpeed = 0.5;
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
            marker.className = `animal-marker ${isCat ? 'cat' : 'dog'} ${isSelected ? 'selected' : ''}`;
            marker.style.setProperty('--accent', accent);

            const iconSvg = isCat
              ? `
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="12.8" r="6.8" fill="currentColor" fill-opacity="0.2"/>
                  <circle cx="9.2" cy="12.4" r="1.1" fill="currentColor"/>
                  <circle cx="14.8" cy="12.4" r="1.1" fill="currentColor"/>
                  <ellipse cx="8.1" cy="15.1" rx="1.4" ry="0.8" fill="#ff8fb4" fill-opacity="0.75"/>
                  <ellipse cx="15.9" cy="15.1" rx="1.4" ry="0.8" fill="#ff8fb4" fill-opacity="0.75"/>
                  <path d="M11 14.7L12 15.4L13 14.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.2 16.5C10.8 17 11.3 17.2 12 17.2C12.7 17.2 13.2 17 13.8 16.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
              `
              : `
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="13" r="6.6" fill="currentColor" fill-opacity="0.2"/>
                  <circle cx="9.3" cy="12.6" r="1.05" fill="currentColor"/>
                  <circle cx="14.7" cy="12.6" r="1.05" fill="currentColor"/>
                  <ellipse cx="8.3" cy="15.3" rx="1.35" ry="0.78" fill="#ffc68e" fill-opacity="0.75"/>
                  <ellipse cx="15.7" cy="15.3" rx="1.35" ry="0.78" fill="#ffc68e" fill-opacity="0.75"/>
                  <circle cx="12" cy="14.8" r="0.8" fill="currentColor"/>
                  <path d="M10.8 16.6C11.2 17 11.5 17.2 12 17.2C12.5 17.2 12.8 17 13.2 16.6" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
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
            marker.innerHTML = `
              <div class="animal-marker-head">
                <div class="animal-marker-ears" aria-hidden="true"></div>
                ${iconSvg}
              </div>
              ${labelHtml}
            `;

            const tooltip = marker.lastElementChild as HTMLDivElement | null;

            const applyBaseStyle = () => {
              marker.style.zIndex = '1';
              marker.style.transform = isSelected ? 'scale(1.36)' : 'scale(1)';
              if (tooltip) tooltip.style.display = 'none';
            };

            const applyHoverStyle = () => {
              marker.style.zIndex = '9999';
              marker.style.transform = 'scale(1.28) translateY(-4px)';
              if (tooltip) tooltip.style.display = 'block';
            };

            marker.style.pointerEvents = 'auto';
            marker.onclick = (e) => {
              e.stopPropagation();
              onSelectAnimal(d);
            };

            marker.onmouseenter = () => {
              applyHoverStyle();
              const controls = globeRef.current?.controls() as any;
              if (controls) controls.autoRotate = false;
            };
            marker.onmouseleave = () => {
              applyBaseStyle();
              const controls = globeRef.current?.controls() as any;
              if (controls) controls.autoRotate = true;
            };

            return marker;
          },
        } as any)}
        pointsData={animalsData}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => 'rgba(255,255,255,0.01)'}
        pointAltitude={0.01}
        pointRadius={0.12}
        pointsMerge={false}
        pointResolution={12}
        onPointClick={(d: object) => onSelectAnimal(d as Animal)}
        
        backgroundColor="rgba(0,0,0,0)"
        onGlobeReady={onGlobeReady}
      />
    </div>
  );
};