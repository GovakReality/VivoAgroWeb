import React, { useState, useEffect, useRef } from 'react';
import Placeholders from '../../../Commons/Scene/Placeholders/Placeholders';
import useProductScene from '../../../../hooks/useProductScene';
import useCameraStore from '../../../../stores/CameraStore';
import Antena from '../../../Scene/Objects/Experiencia/Products/AgroCobertura/Antena';
import AntenaSmall from '../../../Scene/Objects/Experiencia/Products/AgroCobertura/AntenaSmall';
import AgroNeon from '../../../Scene/Objects/Experiencia/Products/AgroCobertura/AgroNeon';
import TabletAgro from '../../../Scene/Objects/Experiencia/Products/AgroCobertura/TabletAgro';

const PRODUCT_ID = 'agro-cobertura';
const START_NEON_DELAY = 4000;                  // inicia quando slot é selecionado
const START_FIRST_ANIMATION_DELAY = 0;          // inicia quando slot é selecionado
const SHOW_TIMER_CARD_DELAY = 6000;            // inicia quando slot é selecionado
const SHOW_TABLET_DELAY = 5000;                 // inicia quando card com timer termina
const HIDE_TABLET_DELAY = 27000;                  // inicia quando card com timer termina
const START_END_PRODUCT_DELAY = 28000;          // inicia quando card com timer termina  

const CAMERA_TARGET = [10, 1.4, 0];
const SMALL_OBJECT_LOOKAT = [10, 0.7, 0];
const PLACEHOLDER_LOOKAT_OFFSET = [0, 30, 0];
const INITIAL_PLACEHOLDER_POSITIONS = [
  [35, 0, -10],
  [40, 0, 0],
  [40, 0, 12],
];

const AgroCoberturaScene = () => {
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
        setNeonRotation([0, 0.55, 0]);
        break;
      case 1:
        setNeonPosition([0, 0, 0]);
        setNeonRotation([0, 0.25, 0]);
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
        <Antena position={selectedPosition} playSecondAnimation={shouldPlaySecondAnimation} skipProduct={shouldSkipProduct} />
      )}

      {shouldRenderNeon && (
        <AgroNeon position={neonPosition} rotation={neonRotation} onAnimationEnd={() => setShouldRenderNeon(false)} />
      )}

      {shouldRenderPlaceholders && (
        <Placeholders
          placeholderPositions={placeholderPositions}
          scale={[3, 9, 3]}
          isVisible={placeholdersVisible}
          onAnimationOutEnded={handlePlaceholderAnimationOutEnded}
        />
      )}

      {shouldRenderSmallObject && (
        <AntenaSmall
          isVisible={smallObjectVisible}
          onAnimationOutEnded={handleSmallObjAnimationOutEnded}
        />
      )}

      <TabletAgro animateTablet={animateTablet} />
    </group>
  );
};

export default AgroCoberturaScene;