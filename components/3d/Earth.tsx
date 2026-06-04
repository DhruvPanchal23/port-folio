'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const countries = [
  { name: 'UK', lat: 51.5074, lon: -0.1278, color: '#3b82f6' },
  { name: 'India', lat: 20.5937, lon: 78.9629, color: '#10b981' },
  { name: 'USA', lat: 37.0902, lon: -95.7129, color: '#f59e0b' },
];

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.Group>(null);

  // Create country markers
  const markers = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const colors: number[] = [];
    
    countries.forEach((country) => {
      const pos = latLonToVector3(country.lat, country.lon, 2.1);
      points.push(pos);
      const color = new THREE.Color(country.color);
      colors.push(color.r, color.g, color.b);
    });
    
    return { points, colors };
  }, []);

  // Create connection lines
  const connectionLines = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = [];
    
    for (let i = 0; i < countries.length; i++) {
      for (let j = i + 1; j < countries.length; j++) {
        const start = latLonToVector3(countries[i].lat, countries[i].lon, 2.05);
        const end = latLonToVector3(countries[j].lat, countries[j].lon, 2.05);
        lines.push({ start, end, color: '#3b82f6' });
      }
    }
    
    return lines;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.8}
          metalness={0.2}
          emissive="#0f172a"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh rotation={meshRef.current?.rotation}>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Country markers */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={markers.points.length}
            array={new Float32Array(markers.points.flatMap((p) => [p.x, p.y, p.z]))}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={markers.colors.length / 3}
            array={new Float32Array(markers.colors)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* Connection lines */}
      <group ref={linesRef}>
        {connectionLines.map((line, i) => {
          const curve = new THREE.QuadraticBezierCurve3(
            line.start,
            line.start.clone().lerp(line.end, 0.5).multiplyScalar(1.3),
            line.end
          );
          const points = curve.getPoints(50);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          return (
            <line key={i} geometry={geometry}>
              <lineBasicMaterial
                color={line.color}
                transparent
                opacity={0.3}
                linewidth={2}
              />
            </line>
          );
        })}
      </group>

      {/* Ambient glow */}
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
