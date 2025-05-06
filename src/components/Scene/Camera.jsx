import { useEffect, useRef, useMemo } from 'react';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import useCameraStore from '../../stores/CameraStore';

const CAMERA_POSITION = [0, 1.4, 0];
const TARGET_POSITION = [0.1, 1.406, 0];

const BASE_FOV = 60;
const REFERENCE_ASPECT = 16 / 9;
const MIN_FOV = 50;
const MAX_FOV = 80;

const Camera = () => {
  const cameraControlsRef = useRef();
  const cameraRef = useRef();
  const gsapAnimationRef = useRef(null);
  const { camera } = useThree();
  const { size } = useThree();

  // Obtendo estados do CameraStore para animação
  const cameraAnimate = useCameraStore(state => state.cameraAnimate);
  const currentTarget = useCameraStore(state => state.currentTarget);
  const animationDuration = useCameraStore(state => state.animationDuration);
  const finishAnimation = useCameraStore(state => state.finishAnimation);
  const resetCamera = useCameraStore(state => state.resetCamera);
  const isFreeLookMode = useCameraStore(state => state.isFreeLookMode);
  const isFollowingTarget = useCameraStore(state => state.isFollowingTarget);

  const aspectRatio = size.width / size.height;

  const adjustedFOV = useMemo(() => {

    const aspectDifference = aspectRatio / REFERENCE_ASPECT;
    let calculatedFOV;

    if (aspectDifference < 1) {
      // Tela mais estreita/alta (mobile) - aumentar FOV
      calculatedFOV = BASE_FOV + (30 * (1 - aspectDifference));
    } else {
      // Tela mais larga - reduzir FOV levemente
      calculatedFOV = BASE_FOV - (5 * (aspectDifference - 1));
    }
    // Limitar entre MIN_FOV e MAX_FOV
    return Math.min(Math.max(calculatedFOV, MIN_FOV), MAX_FOV);
  }, [aspectRatio, BASE_FOV]);

  // Configurar posição inicial da câmera
  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(
        CAMERA_POSITION[0], CAMERA_POSITION[1], CAMERA_POSITION[2],
        TARGET_POSITION[0], TARGET_POSITION[1], TARGET_POSITION[2],
        true
      );

      cameraControlsRef.current.dollySpeed = 0; // desativar zoom
      cameraControlsRef.current.truckSpeed = 0; // desativar pan
      cameraControlsRef.current.verticalDragToForward = false;  // desativar movimento frente/tras
      cameraControlsRef.current.mouseButtons.wheel = 0;   // ACTION.NONE - nada acontece com a roda
      cameraControlsRef.current.mouseButtons.middle = 0;  // ACTION.NONE para botão do meio
      cameraControlsRef.current.mouseButtons.right = 0;   // ACTION.NONE para botão direito     
      cameraControlsRef.current.touches.two = 0;
      cameraControlsRef.current.touches.three = 0;
      cameraControlsRef.current.smoothTime = 0.1;
      cameraControlsRef.current.draggingSmoothTime = 0.25;
      cameraControlsRef.current.azimuthRotateSpeed = 0.25;
      cameraControlsRef.current.polarRotateSpeed = 0.25;
      //cameraControlsRef.current.minAzimuthAngle = -Math.PI / 2;
      //cameraControlsRef.current.maxAzimuthAngle = Math.PI / 2;      
    }
  }, [camera]);

  // Modo de visualização livre
  useEffect(() => {
    if (cameraControlsRef.current) {
      if (isFreeLookMode) {
        // Ativar rotação
        cameraControlsRef.current.mouseButtons.left = 1; // CameraControls.ACTION.ROTATE
        cameraControlsRef.current.touches.one = 1; // CameraControls.ACTION.ROTATE
        
        // Limites
        cameraControlsRef.current.minDistance = 0;
        cameraControlsRef.current.maxDistance = 0;
        cameraControlsRef.current.minPolarAngle = Math.PI / 4;     
        cameraControlsRef.current.maxPolarAngle = Math.PI * 3/4;   
      } else {
        // Desativar rotação
        cameraControlsRef.current.mouseButtons.left = 0; // CameraControls.ACTION.NONE
        cameraControlsRef.current.touches.one = 0; // CameraControls.ACTION.NONE
               
        // Remover restrições
        cameraControlsRef.current.minDistance = 0;
        cameraControlsRef.current.maxDistance = Infinity;
        cameraControlsRef.current.minPolarAngle = 0;
        cameraControlsRef.current.maxPolarAngle = Math.PI;
      }
    }
  }, [isFreeLookMode, camera]);

  function normalize(angle) {
    return (angle + Math.PI * 2) % (Math.PI * 2);
  }
  
  function computeAdjustedAzimuth(current, target) {
    const TWO_PI = Math.PI * 2;
    const AZIMUTH_LIMIT = Math.PI / 2;
  
    if (target < AZIMUTH_LIMIT) {
      target = TWO_PI + target;
    }

    return target;
  }

  // Animação para targets específicos
  useEffect(() => {
    if (cameraControlsRef.current && cameraAnimate) {
      // Interromper animação anterior
      if (gsapAnimationRef.current) {
        gsapAnimationRef.current.kill();
      }
  
      // Obter a posição atual da câmera e seus ângulos
      const cameraPosition = new THREE.Vector3();
      camera.getWorldPosition(cameraPosition);

      const currentAzimuth = cameraControlsRef.current.azimuthAngle;
      const currentPolar = cameraControlsRef.current.polarAngle;
  
      const direction = new THREE.Vector3(
        currentTarget[0] - cameraPosition.x,
        currentTarget[1] - cameraPosition.y,
        currentTarget[2] - cameraPosition.z
      );

      const r = direction.length();
      const targetPolar = normalize(Math.acos(-direction.y / r)); 
      const targetAzimuth = Math.atan2(-direction.x, -direction.z);    
      const finalAzimuth = computeAdjustedAzimuth(currentAzimuth, targetAzimuth);
  
      console.log('currentAzimuth', currentAzimuth * THREE.MathUtils.RAD2DEG);
      console.log('targetAzimuth', finalAzimuth * THREE.MathUtils.RAD2DEG);

      // Criar objeto para animar
      const rotationObj = {
        azimuth: currentAzimuth,
        polar: currentPolar
      };

      // Animar com GSAP
      gsapAnimationRef.current = gsap.to(rotationObj, {
        azimuth: finalAzimuth,
        polar: targetPolar,
        duration: animationDuration,
        ease: "power2.inOut",
        onUpdate: () => {
          // Aplicar ângulos atualizados
          cameraControlsRef.current.rotateTo(
            rotationObj.azimuth,
            rotationObj.polar,
            false
          );
        },
        onComplete: () => {
          finishAnimation();
        }
      });
    }
  }, [cameraAnimate, currentTarget, animationDuration, camera]);

  // Seguir target suavemente
/*   useFrame(() => {
    if (cameraControlsRef.current && isFollowingTarget && !cameraAnimate) {
      const currentTargetPos = new THREE.Vector3();
      cameraControlsRef.current.getTarget(currentTargetPos);
      
      // Interpolação leve para movimento suave
      const lerpFactor = 0.02;
      const targetX = currentTargetPos.x + (currentTarget[0] - currentTargetPos.x) * lerpFactor;
      const targetY = currentTargetPos.y + (currentTarget[1] - currentTargetPos.y) * lerpFactor;
      const targetZ = currentTargetPos.z + (currentTarget[2] - currentTargetPos.z) * lerpFactor;
      
      cameraControlsRef.current.setTarget(targetX, targetY, targetZ, true);
    }
  }); */

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={adjustedFOV}
      /* near={0.01} */
      />
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
      />
    </>
  );
};

export default Camera;