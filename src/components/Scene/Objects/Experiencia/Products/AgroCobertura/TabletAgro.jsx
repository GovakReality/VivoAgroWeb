import React from 'react';
import { useTablet } from '../../../../../../hooks/useTablet';

const MODEL_PATH = '/models/tablets/TabletAgro.glb';
const VIDEO_PATH = '/videos/Tablet-AgroCobertura.mp4';

const TabletAgro = ({ position, rotation = [0, 0, 0], scale = 1, animateTablet = false }) => {
  const { scene, meshRef } = useTablet(MODEL_PATH, VIDEO_PATH, animateTablet, '01');

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

export default TabletAgro;