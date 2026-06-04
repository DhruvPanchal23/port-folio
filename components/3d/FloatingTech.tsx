'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingTechProps {
  text: string;
  position: [number, number, number];
  speed?: number;
}

export default function FloatingTech({ text, position, speed = 1 }: FloatingTechProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.rotation.y += 0.01;
    }
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.6}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <Text
        ref={textRef}
        position={[0, -0.5, 0]}
        fontSize={0.2}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}
