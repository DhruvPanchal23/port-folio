'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import FloatingTech from './FloatingTech';

const techItems = [
  { text: 'React', position: [-3, 1, 0] as [number, number, number], speed: 0.8 },
  { text: 'Next.js', position: [3, 2, -1] as [number, number, number], speed: 1.2 },
  { text: 'TypeScript', position: [-2, 3, -2] as [number, number, number], speed: 1.0 },
  { text: 'Three.js', position: [2, 0.5, 1] as [number, number, number], speed: 0.9 },
  { text: 'Tailwind', position: [0, 2.5, -1] as [number, number, number], speed: 1.1 },
];

export default function FloatingTechCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          {techItems.map((item, i) => (
            <FloatingTech key={i} {...item} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
