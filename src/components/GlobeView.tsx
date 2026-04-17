import React, { useCallback, useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { ANIMALS, Animal } from '../data/animals';

interface GlobeViewProps {
  onSelectAnimal: (animal: Animal) => void;
  selectedAnimal: Animal | null;
}

export const GlobeView: React.FC<GlobeViewProps> = ({ onSelectAnimal, selectedAnimal }) => {
  const globeRef = useRef<GlobeMethods>();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current;
      globe.controls().autoRotate = !selectedAnimal;
      globe.controls().autoRotateSpeed = 0.5;
      if (selectedAnimal) {
        globe.pointOfView({ lat: selectedAnimal.lat, lng: selectedAnimal.lng, altitude: 1.2 }, 1500);
      }
    }
  }, [selectedAnimal]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Globe
        ref={globeRef} width={dimensions.width} height={dimensions.height} backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        pointsData={ANIMALS} pointLat="lat" pointLng="lng" pointColor={() => '#00f2ff'}
        pointAltitude={0.1} pointRadius={0.5}
        pointLabel={(d: any) => `
          <div class="glass-panel p-2 px-3 rounded-lg text-white">
            <div class="text-[10px] font-mono text-white/40 uppercase tracking-[1px] mb-0.5">${d.origin}</div>
            <div class="font-medium text-sm text-[#00f2ff]">${d.name}</div>
          </div>
        `}
        onPointClick={(point: any) => onSelectAnimal(point as Animal)}
        atmosphereColor="#00f2ff" atmosphereAltitude={0.25} showAtmosphere={true}
      />
    </div>
  );
};