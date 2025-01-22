import React, { useContext, useEffect, useState } from 'react';
import AgroCoberturaCard from '../AgroCoberturaCard';
import useCameraStore from '../../../stores/CameraStore';

const AgroCobertura = ({ isVisible }) => {
  const cameraAnimDuration = 8000;
  const showCardDelay = 2000;

  const [showCard, setShowCard] = useState(false);
  const { setCameraTarget, setCameraAnimate } = useCameraStore();

  const startCameraAnimation = () => {
    setCameraTarget({ point: [-30, 0, -8], duration: cameraAnimDuration / 1000 });
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
    <div className="agro-cobertura-container">
      <AgroCoberturaCard isVisible={showCard} onContinueClick={onContinueClick} onSkipClick={onSkipClick}/>
    </div>
  );
};

export default AgroCobertura;