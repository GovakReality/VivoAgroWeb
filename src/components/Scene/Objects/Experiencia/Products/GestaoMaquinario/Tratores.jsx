import React, { useRef, forwardRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTFAnimations } from '../../../../../../hooks/useGLTFAnimations';
import * as THREE from 'three';
import useSoundStore from '../../../../../../stores/SoundStore';
import useAssetsStore from '../../../../../../stores/AssetsStore';

const MODELS = [
  {
    path: '/models/products/GestaoMaquinario/Trator.glb',
    position: [4, 0, 8],
    rotation: [0, Math.PI / 2, 0],
    scale: 1,
    volume: 0.8,
    soundId: 'TRATOR_A',
    animOffset: 0 // de 0 a 1
  },
  {
    path: '/models/products/GestaoMaquinario/Trator.glb',
    position: [0, 0, 17],
    rotation: [0, Math.PI / 2, 0],
    scale: 1,
    volume: 0.4,
    soundId: 'TRATOR_B',
    animOffset: 0.3 // de 0 a 1
  },
  {
    path: '/models/products/GestaoMaquinario/Trator.glb',
    position: [-5, 0, 28],
    rotation: [0, Math.PI / 2, 0],
    scale: 1,
    volume: 0.4,
    soundId: 'TRATOR_C',
    animOffset: 0.7 // de 0 a 1
  },
];

const findObjectMesh = (object, meshName = 'Trator_Attachment') => {
  const targetObject = object.getObjectByName(meshName);

  if (targetObject && targetObject.isMesh) {
    return targetObject;
  }
  
  return null;  
};

const Trator = forwardRef(({ path, position, rotation, scale, volume = 0.5, animOffset = 0, onMeshFound, index, soundId }, ref) => {
  const { scene, play, animations } = useGLTFAnimations(path, {
    cloneScene: true,
  });
  const hasStartedAnimation = useRef(false);
  const meshRef = useRef(null);
  const frameCounter = useRef(0);
  const soundIdRef = useRef(null);
  const soundRef = useRef(null);

  const { playSound, stopSound } = useSoundStore();

  useEffect(() => {
    if (scene) {
      const objectMesh = findObjectMesh(scene);
      if (objectMesh) {
        meshRef.current = objectMesh;
      }

      play('TratorAndando_Animação', {
        loop: true, 
        timeScale: 2.4,
        startOffset: animOffset
      });      
      
      // Iniciar som do trator
      if (meshRef.current) {
        const worldPos = new THREE.Vector3();
        meshRef.current.getWorldPosition(worldPos);
        
        soundIdRef.current = playSound(soundId, {
          volume: volume,
          spatial: true,
          loop: true,
          position: [worldPos.x, worldPos.y, worldPos.z],      
        });

        soundRef.current = useAssetsStore.getState().getSound(soundId);
        
        if (soundRef.current) {
          soundRef.current.pannerAttr({
            panningModel: 'HRTF',
            refDistance: 20,    
            rolloffFactor: 0.5, 
            distanceModel: 'linear',
            maxDistance: 80
          }, soundIdRef.current);
        }
      }
    }
    
    // Cleanup ao desmontar
    return () => {
      if (soundIdRef.current) {
        stopSound(soundId, soundIdRef.current);
        soundIdRef.current = null;
      }
    };
  }, [scene, playSound, stopSound, volume, soundId, index]);
  
  useFrame(() => {
    if (meshRef.current && soundRef.current && soundIdRef.current) {
      frameCounter.current += 1;
      
      const worldPos = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPos);
      
      if (soundIdRef.current) {
        soundRef.current.pos(worldPos.x, worldPos.y, worldPos.z, soundIdRef.current);
      }

      if (onMeshFound) {
        onMeshFound(worldPos, index);
      }
    }
  });

  if (!scene) return null;
  
  return (
    <primitive 
      ref={ref}
      object={scene} 
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
});

const Tratores = ({ onObjectPositionUpdate }) => {
  const tratorRefs = useRef([]);
  
  return (
    <group name="tratores">
      {MODELS.map((model, index) => (
        <Trator 
          key={index}
          index={index}
          ref={el => tratorRefs.current[index] = el}
          path={model.path}
          position={model.position}
          rotation={model.rotation}
          scale={model.scale}
          volume={model.volume}
          soundId={model.soundId}
          animOffset={model.animOffset}
          onMeshFound={onObjectPositionUpdate}
        />
      ))}
    </group>
  );
};

export default Tratores;