import React, { useState, useEffect, useRef } from 'react';
import Placeholders from '../../../Commons/Scene/Placeholders/Placeholders';
import useProductScene from '../../../../hooks/useProductScene';
import useCameraStore from '../../../../stores/CameraStore';
import Estacao from '../../../Scene/Objects/Experiencia/Products/ClimaInteligente/Estacao';
import EstacaoSmall from '../../../Scene/Objects/Experiencia/Products/ClimaInteligente/EstacaoSmall';
import TabletClima from '../../../Scene/Objects/Experiencia/Products/ClimaInteligente/TabletClima';
import ClimaNeon from '../../../Scene/Objects/Experiencia/Products/ClimaInteligente/ClimaNeon';

const PRODUCT_ID = 'clima-inteligente';
const START_NEON_DELAY = 0;                     // inicia quando slot é selecionado
const START_FIRST_ANIMATION_DELAY = 3000;      // inicia quando slot é selecionado
const SHOW_TIMER_CARD_DELAY = 5000;            // inicia quando slot é selecionado
const SHOW_TABLET_DELAY = 5000;                 // inicia quando card com timer termina
const HIDE_TABLET_DELAY = 27000;                  // inicia quando card com timer termina
const START_END_PRODUCT_DELAY = 28000;          // inicia quando card com timer termina  

const CAMERA_TARGET = [0, 1.4, 10];
const SMALL_OBJECT_LOOKAT = [0, 0.7, 10];
const PLACEHOLDER_LOOKAT_OFFSET = [0, 1.5, 0];
const INITIAL_PLACEHOLDER_POSITIONS = [
  [7, 0.1, 22],
  [0, 0.1, 3],
  [-4, 0.1, 15],
];

const ClimaInteligenteScene = () => {
  const {
    shouldRenderMainObject,
    selectedPosition,
    placeholderPositions,
    animateTablet,
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
    selectedIndex,
    isCurrentProduct
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

  const [neonPosition, setNeonPosition] = useState(false);
  const [neonRotation, setNeonRotation] = useState(false);

  const isTrackingEnabledRef = useRef(false);
  const { setCurrentTarget, stopFollowingTarget, startFollowingTarget } = useCameraStore();

  useEffect(() => {
    if (selectedIndex >= 0 && isCurrentProduct) {
      isTrackingEnabledRef.current = true;
      startFollowingTarget();
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
  }, [selectedIndex]);

  useEffect(() => {
    if (animateTablet) {
      isTrackingEnabledRef.current = false;
      stopFollowingTarget();
    }
  }, [animateTablet, stopFollowingTarget]);

  return (
    <group>
      {shouldRenderMainObject && selectedPosition && (
        <Estacao position={selectedPosition} playSecondAnimation={shouldPlaySecondAnimation} skipProduct={shouldSkipProduct} />
      )}

      {shouldRenderNeon && (
        <ClimaNeon position={neonPosition} rotation={neonRotation} onAnimationEnd={() => setShouldRenderNeon(false)} />
      )}

      {shouldRenderPlaceholders && (
        <Placeholders
          placeholderPositions={placeholderPositions}
          scale={[1, 3, 1]}
          isVisible={placeholdersVisible}
          onAnimationOutEnded={handlePlaceholderAnimationOutEnded}
        />
      )}

      {shouldRenderSmallObject && (
        <EstacaoSmall
          isVisible={smallObjectVisible}
          onAnimationOutEnded={handleSmallObjAnimationOutEnded}
        />
      )}

      <TabletClima animateTablet={animateTablet} />
    </group>
  );
};

export default ClimaInteligenteScene;