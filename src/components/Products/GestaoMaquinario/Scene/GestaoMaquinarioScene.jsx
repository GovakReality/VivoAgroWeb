import React, { useState, useEffect, useRef } from 'react';
import Placeholders from '../../../Commons/Scene/Placeholders/Placeholders';
import useProductScene from '../../../../hooks/useProductScene';
import useCameraStore from '../../../../stores/CameraStore';
import Tratores from '../../../Scene/Objects/Experiencia/Products/GestaoMaquinario/Tratores';
import DispositivoMaquinario from '../../../Scene/Objects/Experiencia/Products/GestaoMaquinario/DispositivoMaquinario';
import DispositivoMaquinarioSmall from '../../../Scene/Objects/Experiencia/Products/GestaoMaquinario/DispositivoMaquinarioSmall';
import TabletMaquinario from '../../../Scene/Objects/Experiencia/Products/GestaoMaquinario/TabletMaquinario';
import MaquinarioNeon from '../../../Scene/Objects/Experiencia/Products/GestaoMaquinario/MaquinarioNeon';

const PRODUCT_ID = 'gestao-maquinario';
const START_NEON_DELAY = 0;                 // inicia quando slot é selecionado
const START_FIRST_ANIMATION_DELAY = 3000;      // inicia quando slot é selecionado
const SHOW_TIMER_CARD_DELAY = 5000;            // inicia quando slot é selecionado
const SHOW_TABLET_DELAY = 5000;                 // inicia quando card com timer termina
const HIDE_TABLET_DELAY = 17000;                  // inicia quando card com timer termina
const START_END_PRODUCT_DELAY = 18000;          // inicia quando card com timer termina  

const CAMERA_TARGET = [0, 1.4, 10];
const SMALL_OBJECT_LOOKAT = [0, 0.7, 10];
const PLACEHOLDER_LOOKAT_OFFSET = [0, 0, 0];
const INITIAL_PLACEHOLDER_POSITIONS = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const GestaoMaquinarioScene = () => {
  const {
    shouldRenderMainObject,
    isCurrentProduct,
    selectedPosition,
    animateTablet,
    selectedIndex,
    shouldRenderPlaceholders,
    placeholdersVisible,
    shouldRenderSmallObject,
    smallObjectVisible,
    handlePlaceholderAnimationOutEnded,
    handleSmallObjAnimationOutEnded,
    shouldPlaySecondAnimation,
    shouldSkipProduct,
    shouldRenderNeon,
    setShouldRenderNeon,
  } = useProductScene(
    PRODUCT_ID,
    INITIAL_PLACEHOLDER_POSITIONS,
    CAMERA_TARGET,
    START_NEON_DELAY,
    START_FIRST_ANIMATION_DELAY,
    SHOW_TIMER_CARD_DELAY,
    SHOW_TABLET_DELAY,
    HIDE_TABLET_DELAY,
    START_END_PRODUCT_DELAY,
    SMALL_OBJECT_LOOKAT,
    PLACEHOLDER_LOOKAT_OFFSET
  );

  const tratorPositionsRef = useRef(INITIAL_PLACEHOLDER_POSITIONS);
  const trackedTratorIndexRef = useRef(-1);
  const isTrackingEnabledRef = useRef(false);
  const { setCurrentTarget, stopFollowingTarget, startFollowingTarget } = useCameraStore();

  const [dispositivoPosition, setDispositivoPosition] = useState(selectedPosition);
  const [placeholderPositions, setPlaceholderPositions] = useState(INITIAL_PLACEHOLDER_POSITIONS);
  const [neonPosition, setNeonPosition] = useState(false);
  const [neonRotation, setNeonRotation] = useState(false);

  useEffect(() => {
    if (selectedIndex >= 0 && isCurrentProduct) {
      trackedTratorIndexRef.current = selectedIndex;
      isTrackingEnabledRef.current = true;
      startFollowingTarget();

      if (tratorPositionsRef.current[selectedIndex]) {
        setDispositivoPosition(tratorPositionsRef.current[selectedIndex]);
      }
    }
    switch (selectedIndex) {
      case 0:
        setNeonPosition([0, 0, 0]);
        setNeonRotation([0, 0, 0]);
        break;
      case 1:
        setNeonPosition([0, 0, 0]);
        setNeonRotation([0, 0, 0]);
        break;
      case 2:
        setNeonPosition([0, 0, 0]);
        setNeonRotation([0, 0, 0]);
        break;
    }
  }, [selectedIndex, isCurrentProduct]);

  useEffect(() => {
    if (animateTablet) {
      isTrackingEnabledRef.current = false;
      stopFollowingTarget();
    }
  }, [animateTablet, stopFollowingTarget]);

  useEffect(() => {
    if (shouldSkipProduct && isCurrentProduct) {
      trackedTratorIndexRef.current = 1;
    }
  }, [shouldSkipProduct, isCurrentProduct]);

  const handleObjectPositionUpdate = (position, tratorIndex) => {
    if (position) {
      tratorPositionsRef.current[tratorIndex] = [position.x, position.y, position.z];
      // Atualizar os placeholders
      setPlaceholderPositions(prevPositions => {
        const newPositions = [...prevPositions];
        if (tratorIndex >= 0 && tratorIndex < newPositions.length) {
          newPositions[tratorIndex] = [position.x, position.y, position.z];
        }
        return newPositions;
      });

      // Atualizar a posição do dispositivo
      if (shouldRenderMainObject && trackedTratorIndexRef.current === tratorIndex) {
        setDispositivoPosition([position.x, position.y, position.z]);
      }

      // Atualizar posiçao do target da camera
      if (isTrackingEnabledRef.current && isCurrentProduct && trackedTratorIndexRef.current === tratorIndex) {
        const targetPosition = [
          position.x + PLACEHOLDER_LOOKAT_OFFSET[0],
          position.y + PLACEHOLDER_LOOKAT_OFFSET[1],
          position.z + PLACEHOLDER_LOOKAT_OFFSET[2]
        ];
        setCurrentTarget(targetPosition);
      }
    }
  };

  return (
    <group>
      <Tratores
        onObjectPositionUpdate={handleObjectPositionUpdate}
        playSecondAnimation={shouldPlaySecondAnimation}
        skipProduct={shouldSkipProduct}
      />

      {shouldRenderNeon && (
        <MaquinarioNeon position={neonPosition} rotation={neonRotation} onAnimationEnd={() => setShouldRenderNeon(false)} />
      )}

      {shouldRenderMainObject && dispositivoPosition && trackedTratorIndexRef.current >= 0 && (
        <DispositivoMaquinario
          position={dispositivoPosition}
          playSecondAnimation={shouldPlaySecondAnimation}
          skipProduct={shouldSkipProduct}
        />
      )}

      {shouldRenderPlaceholders && (
        <Placeholders
          placeholderPositions={placeholderPositions}
          scale={[1, 2, 1]}
          isVisible={placeholdersVisible}
          onAnimationOutEnded={handlePlaceholderAnimationOutEnded}
        />
      )}

      {shouldRenderSmallObject && (
        <DispositivoMaquinarioSmall
          isVisible={smallObjectVisible}
          onAnimationOutEnded={handleSmallObjAnimationOutEnded}
        />
      )}

      <TabletMaquinario animateTablet={animateTablet} />
    </group>
  );
};

export default GestaoMaquinarioScene;