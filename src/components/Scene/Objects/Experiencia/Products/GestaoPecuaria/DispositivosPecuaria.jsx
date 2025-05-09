import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

const MODEL_PATH = '/models/products/GestaoPecuaria/DispositivosPecuaria.glb';

const DispositivosPecuaria = ({position = [0, 0, 0], rotation = [0, 0, 0], scale = 1}) => {
  const meshRef = useRef();
  const { scene } = useGLTF(MODEL_PATH);
  
  if (!scene) return null;

  return (
    <primitive 
      object={scene.clone()} 
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}     
    />
  );
};

export default DispositivosPecuaria;