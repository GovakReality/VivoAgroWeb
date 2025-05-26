import React from 'react';
import { useTablet } from '../../../../../../hooks/useTablet';

const MODEL_PATH = '/models/tablets/TabletMaquinario.glb';
const VIDEO_PATH = '/videos/Tablet-GestaoMaquinario.mp4';

const TabletMaquinario = ({ position, rotation = [0, 0, 0], scale = 1, animateTablet = false }) => {
  const { scene, meshRef } = useTablet(MODEL_PATH, VIDEO_PATH, animateTablet, '02');

  if (!scene) return null;

  return (
    <primitive
      object={scene}
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

export default TabletMaquinario;