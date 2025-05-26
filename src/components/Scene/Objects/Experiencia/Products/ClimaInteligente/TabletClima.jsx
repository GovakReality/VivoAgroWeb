import React from 'react';
import { useTablet } from '../../../../../../hooks/useTablet';

const MODEL_PATH = '/models/tablets/TabletClima.glb';
const VIDEO_PATH = '/videos/Tablet-ClimaInteligente.mp4';

const TabletClima = ({ position, rotation = [0, 0, 0], scale = 1, animateTablet = false }) => {
  const { scene, meshRef } = useTablet(MODEL_PATH, VIDEO_PATH, animateTablet, '04');

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

export default TabletClima;