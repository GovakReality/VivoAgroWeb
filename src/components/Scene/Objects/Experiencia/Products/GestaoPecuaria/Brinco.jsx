import React, { useRef, useEffect, useCallback } from 'react';
import { useGLTFAnimations } from '../../../../../../hooks/useGLTFAnimations';

const MODEL_PATH = '/models/products/GestaoPecuaria/Brinco.glb';

const Brinco = ({ position, rotation = [2, 0.7, 0.4], scale = 1.1, playSecondAnimation = false, skipProduct = false }) => {
  const meshRef = useRef();
  const { scene, play, jumpToEnd } = useGLTFAnimations(MODEL_PATH, {
    cloneScene: true,
  });

  useEffect(() => {
    if (!scene) return;

    if (!skipProduct) {
      play('BrincoEncaixando', {
        loop: false,
        timeScale: 2.4
      });
    } else {
      jumpToEnd('BrincoEncaixando');
    }
  }, [scene, skipProduct, play, jumpToEnd]);

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

export default Brinco;