import React, { useContext, useEffect, useState } from 'react';
import GestaoMaquinarioCard from './GestaoMaquinarioCard';
import useCameraStore from '../../../stores/CameraStore';

const GestaoMaquinario = ({ isVisible }) => {
  const cameraAnimDuration = 8000;
  const showCardDelay = 2000;

  const [showCard, setShowCard] = useState(false);
  const { setCameraTarget, setCameraAnimate } = useCameraStore();

  const startCameraAnimation = () => {
    setCameraTarget({ point: [30, 0, -8], duration: cameraAnimDuration / 1000 });
    setCameraAnimate(true);
  }

  const onContinueClick = () => {
    setShowCard(false);
    //libera interaçao
  }

  const onSkipClick = () => {
    setShowCard(false);
    //abre dashboard
  }

  useEffect(() => {
    let timer;
    if (isVisible) {
      startCameraAnimation();
      timer = setTimeout(() => {
        setShowCard(true);
      }, showCardDelay);
    } else {
      setShowCard(false);
    }

    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null

  return (
    <div className="gestao-maquinario-container">
      <GestaoMaquinarioCard isVisible={showCard} onContinueClick={onContinueClick} onSkipClick={onSkipClick}/>
    </div>
  );
};

export default GestaoMaquinario;