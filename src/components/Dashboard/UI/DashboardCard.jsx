import React, { useState, useEffect, useCallback } from 'react';
import './DashboardCard.css';
import ImageButton from '../../Commons/UI/ImageButton/ImageButton';
import { RiResetRightFill } from "react-icons/ri";
import useProductsStore from '../../../stores/ProductsStore';
import useDashboardStore from '../../../stores/DashboardStore';
import { ANIMATION_DURATIONS } from '../../../config/animationUIConfig';

const DashboardCard = ({ isVisible = true, onAnimationOutEnded, onResetClick }) => {
  const { productsStatus, setCurrentProduct, setStartProduct } = useProductsStore();
  const { setShowDashboard } = useDashboardStore();
  const [animState, setAnimState] = useState('initial'); // 'initial', 'visible', 'hiding'

  useEffect(() => {
    if (isVisible) {
      setAnimState('visible')
    } else if (animState === 'visible') {
      setAnimState('hiding');
    }
  }, [isVisible]);

  useEffect(() => {
    if (animState === 'hiding') {
      const endTimer = setTimeout(() => { if (onAnimationOutEnded) onAnimationOutEnded(); }, ANIMATION_DURATIONS.DASHBOARD.SCALE_OUT);
      return () => { clearTimeout(endTimer); };
    }
  }, [animState]);

  const style = {
    '--dash-scale-in-duration': `${ANIMATION_DURATIONS.DASHBOARD.SCALE_IN}ms`,
    '--dash-scale-out-duration': `${ANIMATION_DURATIONS.DASHBOARD.SCALE_OUT}ms`
  };

  const animClass =
    animState === 'initial' ? 'hidden' :
      animState === 'visible' ? 'visible' :
        'hiding';

  const handleProductClick = useCallback((productName) => {
    setShowDashboard(false);
    // Delay menor para clima inteligente
    const delay = productName === 'clima-inteligente' ? 50 : ANIMATION_DURATIONS.DASHBOARD.SCALE_OUT;
    const timer = setTimeout(() => {
      setCurrentProduct(productName);
      setStartProduct(true);
    }, delay);
  }, []);

  const handleResetClick = useCallback(() => {
    if (onResetClick) {
      onResetClick();
    }
  }, [onResetClick])

  return (
    <div className={`dashboard-card ${animClass}`} style={style} >
      <div className="sidebar-buttons">
        <button className="sidebar-button active">
          <img src="./ui/icons/vivo-icon-dark.png" alt="Vivo Icon" />
        </button>
        <button
          className="sidebar-button"
          onClick={handleResetClick}
          title="Reiniciar experiência"
        >
          <RiResetRightFill color="#283943" size={28} />
        </button>
      </div>
      <div className="main-buttons">
        <ImageButton status={productsStatus['agro-cobertura']} title="AGRO COBERTURA" onClick={() => handleProductClick('agro-cobertura')} imageUrl="/ui/agroCobertura.jpg" />
        <ImageButton status={productsStatus['gestao-maquinario']} title="GESTÃO DE MAQUINÁRIO" onClick={() => handleProductClick('gestao-maquinario')} imageUrl="/ui/gestaoMaquinario.jpg" />
        {/* <ImageButton status={productsStatus['gestao-pecuaria']} title="GESTÃO PECUÁRIA" onClick={() => handleProductClick('gestao-pecuaria')} imageUrl="/ui/gestaoPecuaria.jpg" /> */}
        <ImageButton status={productsStatus['clima-inteligente']} title="CLIMA INTELIGENTE" onClick={() => handleProductClick('clima-inteligente')} imageUrl="/ui/climaInteligente.jpg" />
      </div>
    </div>
  );
};

export default DashboardCard;