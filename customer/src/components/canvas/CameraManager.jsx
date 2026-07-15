import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo } from 'react';

export function CameraManager({ progressRef }) {
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const p = progressRef.current || 0;

    // The GSAP timeline is defined from 0 to 1
    // We break it down to match the visual scenes

    if (p < 0.15) {
      // SCENE 1: Dive through the shirts
      const diveProgress = p / 0.15;
      state.camera.position.z = THREE.MathUtils.lerp(10, 0, diveProgress);
      state.camera.position.y = 0;
      state.camera.position.x = 0;
      target.set(0, 0, -10);
    } else if (p < 0.35) {
      // SCENE 2: Glassmorphism & Products
      const panProgress = (p - 0.15) / 0.20;
      state.camera.position.x = THREE.MathUtils.lerp(0, 3, panProgress);
      state.camera.position.z = THREE.MathUtils.lerp(0, -2, panProgress);
      target.set(3, 0, -10);
    } else if (p < 0.65) {
      // SCENE 3: Horizontal scrub
      const trackProgress = (p - 0.35) / 0.30;
      state.camera.position.x = 3 + trackProgress * 8;
      target.set(11 + trackProgress * 8, 0, -10);
    } else if (p < 0.85) {
      // SCENE 4: Philosophy
      const zoomProgress = (p - 0.65) / 0.20;
      state.camera.position.z = THREE.MathUtils.lerp(-2, -8, zoomProgress);
      state.camera.position.y = THREE.MathUtils.lerp(0, -2, zoomProgress);
      target.set(state.camera.position.x, -2, -20);
    } else {
      // SCENE 5: Newsletter Morph
      const outroProgress = (p - 0.85) / 0.15;
      state.camera.position.y = THREE.MathUtils.lerp(-2, 2, outroProgress);
      target.set(state.camera.position.x, 2, -20);
    }

    state.camera.lookAt(target);
  });

  return null;
}
