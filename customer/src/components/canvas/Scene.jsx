import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { FloatingShirts } from './FloatingShirts';
import { CameraManager } from './CameraManager';

function CursorLight() {
  const lightRef = useRef(null);
  
  useFrame(({ mouse, viewport }) => {
    // Map normalized device coordinates to 3D world space
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    
    // Smoothly interpolate light position
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x, 0.1);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, y, 0.1);
    }
  });

  return (
    <pointLight 
      ref={lightRef} 
      position={[0, 0, 2]} 
      distance={8} 
      intensity={1.5} 
      color="#fefce8" // Soft warm light
    />
  );
}

export function Scene({ cameraTimelineProgress, floatingShirtsData, eventSourceRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
      eventSource={eventSourceRef}
      eventPrefix="client"
    >
      <color attach="background" args={['#000000']} />
      
      {/* General Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4a90e2" />
      
      <CursorLight />

      {/* Environment for cinematic reflections */}
      <Environment preset="city" />

      {/* Floating Products */}
      <FloatingShirts shirtsData={floatingShirtsData} />
      
      {/* Luxury Dust Particles */}
      <Sparkles count={200} scale={30} size={1.2} speed={0.2} opacity={0.3} color="#ffffff" />
      <Sparkles count={80} scale={20} size={2.5} speed={0.1} opacity={0.15} color="#fbbf24" />

      {/* Camera Animation Sync */}
      <CameraManager progressRef={cameraTimelineProgress} />

      {/* Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.4} mipmapBlur intensity={0.6} />
        <Noise opacity={0.035} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
