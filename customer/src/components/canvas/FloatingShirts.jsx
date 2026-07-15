import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function useBentPlaneGeometry(width, height, widthSegments, heightSegments, bendAngle) {
  return useMemo(() => {
    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    const position = geometry.attributes.position;
    const vec = new THREE.Vector3();
    const radius = width / bendAngle;
    for (let i = 0; i < position.count; i++) {
      vec.fromBufferAttribute(position, i);
      const angle = vec.x / radius;
      vec.z = Math.sin(angle) * radius;
      vec.x = Math.cos(angle) * radius - radius;
      position.setXYZ(i, vec.x, vec.y, vec.z);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, [width, height, widthSegments, heightSegments, bendAngle]);
}

function Shirt({ data, texture }) {
  const meshRef = useRef(null);
  const { top, left, scale, depth, rotate } = data;

  // Convert HTML % based positions to 3D space spread
  const x = (parseFloat(left) / 100 - 0.5) * 30; // -15 to 15
  const y = -(parseFloat(top) / 100 - 0.5) * 20; // -10 to 10
  const z = depth * -10 + 8; // spread from z=8 to z=-2

  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  // Use bent plane to look like fabric
  const geometry = useBentPlaneGeometry(3, 4, 16, 16, Math.PI / 6);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Continuous ambient floating
    meshRef.current.position.y = y + Math.sin(t * 0.4 + randomOffset) * 0.4;
    meshRef.current.position.x = x + Math.cos(t * 0.3 + randomOffset) * 0.2;
    
    // Slight rotations
    meshRef.current.rotation.x = Math.sin(t * 0.2 + randomOffset) * 0.1;
    meshRef.current.rotation.y = Math.cos(t * 0.25 + randomOffset) * 0.1 + (rotate * Math.PI / 180);
    meshRef.current.rotation.z = Math.sin(t * 0.1 + randomOffset) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]} scale={scale * 1.5} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial 
        map={texture} 
        side={THREE.DoubleSide} 
        transparent 
        opacity={0.95} 
        roughness={0.8}
      />
    </mesh>
  );
}

export function FloatingShirts({ shirtsData }) {
  // Extract URLs and load textures
  const urls = useMemo(() => shirtsData.map(s => s.src), [shirtsData]);
  const textures = useTexture(urls);

  return (
    <React.Suspense fallback={null}>
      <group>
        {shirtsData.map((data, index) => (
          <Shirt key={data.id} data={data} texture={textures[index]} />
        ))}
      </group>
    </React.Suspense>
  );
}
