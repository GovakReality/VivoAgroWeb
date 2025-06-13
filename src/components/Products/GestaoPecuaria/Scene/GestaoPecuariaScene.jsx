import React, { useState, useEffect, useRef } from 'react';
import Placeholders from '../../../Commons/Scene/Placeholders/Placeholders';
import useProductScene from '../../../../hooks/useProductScene';
import useCameraStore from '../../../../stores/CameraStore';
import Vacas from '../../../Scene/Objects/Experiencia/Products/GestaoPecuaria/Vacas';
import DispositivosPecuaria from '../../../Scene/Objects/Experiencia/Products/GestaoPecuaria/DispositivosPecuaria';
import Brinco from '../../../Scene/Objects/Experiencia/Products/GestaoPecuaria/Brinco';
import BrincoSmall from '../../../Scene/Objects/Experiencia/Products/GestaoPecuaria/BrincoSmall';
import TabletPecuaria from '../../../Scene/Objects/Experiencia/Products/GestaoPecuaria/TabletPecuaria';
import PecuariaNeon from '../../../Scene/Objects/Experiencia/Products/GestaoPecuaria/PecuariaNeon';

const PRODUCT_ID = 'gestao-pecuaria';
const START_NEON_DELAY = 0;                 // inicia quando slot é selecionado
const START_FIRST_ANIMATION_DELAY = 3000;      // inicia quando slot é selecionado
const SHOW_TIMER_CARD_DELAY = 5000;            // inicia quando slot é selecionado
const SHOW_TABLET_DELAY = 5000;                 // inicia quando card com timer termina
const HIDE_TABLET_DELAY = 27000;                  // inicia quando card com timer termina
const START_END_PRODUCT_DELAY = 28000;          // inicia quando card com timer termina  

const CAMERA_TARGET = [0, 1.4, -10];
const SMALL_OBJECT_LOOKAT = [0, 0.7, -10];
const PLACEHOLDER_LOOKAT_OFFSET = [0, 0, 0];
const INITIAL_PLACEHOLDER_POSITIONS = [
  [0, 0, 0],
  [0, 0, 0],
];

const GestaoPecuariaScene = () => {
  const {
    shouldRenderMainObject,
    showFirstInteraction,
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
    tabletRef
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

  const vacaPositionsRef = useRef(INITIAL_PLACEHOLDER_POSITIONS);
  const trackedVacaIndexRef = useRef(-1);
  const isTrackingEnabledRef = useRef(false);
  const { setCurrentTarget, stopFollowingTarget, startFollowingTarget } = useCameraStore();

  const [dispositivoPosition, setDispositivoPosition] = useState(selectedPosition);
  const [placeholderPositions, setPlaceholderPositions] = useState(INITIAL_PLACEHOLDER_POSITIONS);
  const [neonPosition, setNeonPosition] = useState(false);
  const [neonRotation, setNeonRotation] = useState(false);
  const [allVacaPositions, setAllVacaPositions] = useState([null, null]);

  useEffect(() => {
    if (selectedIndex >= 0 && isCurrentProduct) {
      trackedVacaIndexRef.current = selectedIndex;
      isTrackingEnabledRef.current = true;
      startFollowingTarget();

      if (vacaPositionsRef.current[selectedIndex]) {
        setDispositivoPosition(vacaPositionsRef.current[selectedIndex]);
      }

      // Garantir que todas as posições conhecidas sejam adicionadas ao estado
      const currentPositions = [null, null];
      
      vacaPositionsRef.current.forEach((pos, index) => {
        if (pos) {
          currentPositions[index] = pos;
        }
      });
      
      setAllVacaPositions(currentPositions);
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
      trackedVacaIndexRef.current = 1;
    }
  }, [shouldSkipProduct, isCurrentProduct]);

  const handleObjectPositionUpdate = (position, vacaIndex) => {
    if (position) {
      vacaPositionsRef.current[vacaIndex] = [position.x, position.y, position.z];

      // Atualizar as posições de todas as vacas
      setAllVacaPositions(prevPositions => {
        const newPositions = [...prevPositions];
        newPositions[vacaIndex] = [position.x, position.y, position.z];
        return newPositions;
      });

      // Atualizar os placeholders
      setPlaceholderPositions(prevPositions => {
        const newPositions = [...prevPositions];
        if (vacaIndex >= 0 && vacaIndex < newPositions.length) {
          newPositions[vacaIndex] = [position.x, position.y, position.z];
        }
        return newPositions;
      });

      // Atualizar a posição do dispositivo
      if (shouldRenderMainObject && trackedVacaIndexRef.current === vacaIndex) {
        setDispositivoPosition([position.x, position.y, position.z]);
      }

      // Atualizar posiçao do target da camera
      if (isTrackingEnabledRef.current && isCurrentProduct && trackedVacaIndexRef.current === vacaIndex && !tabletRef.current) {
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
      <DispositivosPecuaria />
      <Vacas
        onObjectPositionUpdate={handleObjectPositionUpdate}
        playSecondAnimation={shouldPlaySecondAnimation}
        skipProduct={shouldSkipProduct}
      />

      {shouldRenderNeon && (
        <PecuariaNeon position={neonPosition} rotation={neonRotation} onAnimationEnd={() => setShouldRenderNeon(false)} />
      )}

      {shouldRenderMainObject && (
        <>
          {allVacaPositions.map((position, index) => {
            return position && (
              <Brinco
                key={`brinco-${index}`}
                position={position}
                playSecondAnimation={shouldPlaySecondAnimation}
                skipProduct={shouldSkipProduct}
              />
            );
          })}
        </>
      )}

      {shouldRenderPlaceholders && (
        <Placeholders
          placeholderPositions={placeholderPositions}
          scale={[0.3, 0.6, 0.3]}
          isVisible={placeholdersVisible}
          onAnimationOutEnded={handlePlaceholderAnimationOutEnded}
        />
      )}

      {shouldRenderSmallObject && (
        <BrincoSmall
          isVisible={smallObjectVisible}
          onAnimationOutEnded={handleSmallObjAnimationOutEnded}
        />
      )}

      <TabletPecuaria animateTablet={animateTablet} />
    </group>
  );
};

export default GestaoPecuariaScene;

