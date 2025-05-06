import { useState, useEffect, useCallback, useRef } from 'react';
import useProductsStore from '../stores/ProductsStore';
import useInteractionStore from '../stores/InteractionStore';
import useSlotsStore from '../stores/SlotsStore';
import useCameraStore from '../stores/CameraStore';
import useDashboardStore from '../stores/DashboardStore';
import useEndStore from '../stores/EndStore';
import useComponentVisibility from './useComponentVisibility';
import useSoundStore from '../stores/SoundStore';

const useProductScene = (
  productId,
  initialPlaceholderPositions,
  cameraTarget,
  startNeonDelay = 0, // inicia quando slot é selecionado
  startFirstAnimationDelay = 0, // inicia quando slot é selecionado
  showTimerCardDelay = 0, // inicia quando slot é selecionado
  showTabletDelay = 0, // inicia quando card com timer termina
  hideTabletDelay = 0, // inicia quando card com timer termina  
  endProductDelay = 0, // inicia quando card com timer termina
  smallObjectLookAt,
  placeholderLookAtOffset = [0, 1.5, 0],
) => {
  const { currentProduct, setLastProductName, skipProduct } = useProductsStore();
  const {
    showInteraction,
    setShowFirstInstruction,
    setShowSecondInstruction,
    setTimerCompleteCallback,
    setShowInteraction,
    showFirstInteraction,
    setShowFirstInteraction,
    showSecondInteraction,
    setShowSecondInteraction
  } = useInteractionStore();
  const { setShowDashboard } = useDashboardStore();
  const { setSlotsLength, setShowSlots, setSelectedIndex, selectedIndex } = useSlotsStore();
  const { registerProductTarget, animateToTarget } = useCameraStore();
  const { setShowEndCard } = useEndStore();
  const { playSound } = useSoundStore();

  const [shouldRenderMainObject, setShouldRenderMainObject] = useState(false);
  const [shouldRenderNeon, setShouldRenderNeon] = useState(false);
  const [isCurrentProduct, setIsCurrentProduct] = useState(false);
  const [shouldPlaySecondAnimation, setShouldPlaySecondAnimation] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [placeholderPositions, setPlaceholderPositions] = useState(initialPlaceholderPositions || []);
  const [animateTablet, setAnimateTablet] = useState(false);
  const [shouldSkipProduct, setShouldSkipProduct] = useState(skipProduct);

  // Placeholders Visibility
  const [placeholdersVisible, setPlaceholdersVisible] = useState(false);
  const [shouldRenderPlaceholders, handlePlaceholderAnimationOutEnded] = useComponentVisibility(placeholdersVisible);
  // SmallObject Visibility
  const [smallObjectVisible, setSmallObjectVisible] = useState(false);
  const [shouldRenderSmallObject, handleSmallObjAnimationOutEnded] = useComponentVisibility(smallObjectVisible);

  useEffect(() => {
    setPlaceholdersVisible(showFirstInteraction && isCurrentProduct);
    setSmallObjectVisible(showFirstInteraction && isCurrentProduct);
  }, [showFirstInteraction, isCurrentProduct]);

  // Registrar a rotação da câmera para este produto
  useEffect(() => {
    if (cameraTarget) {
      registerProductTarget(productId, cameraTarget);
    }
  }, []);

  // Gerenciar o estado do produto atual
  useEffect(() => {
    const isThisProductCurrent = currentProduct === productId;
    setIsCurrentProduct(isThisProductCurrent);
  }, [currentProduct, productId]);

  // Iniciar primeira interação
  useEffect(() => {
    if (showInteraction && isCurrentProduct) {

      animateToTarget(smallObjectLookAt, 2);

      setShouldRenderMainObject(false);
      setShouldPlaySecondAnimation(false);
      setShouldSkipProduct(false);
      setShowFirstInstruction(true);
      setShowFirstInteraction(true);
    }
  }, [showInteraction, isCurrentProduct]);

  useEffect(() => {
    if (skipProduct && isCurrentProduct) {
      setSelectedPosition(placeholderPositions[1]);
      setShouldSkipProduct(true);
      setShouldRenderMainObject(true);
    }
  }, [skipProduct, isCurrentProduct]);

  // Configurar slots quando a primeira interação é mostrada
  useEffect(() => {
    if (showFirstInteraction && isCurrentProduct) {
      setSlotsLength(placeholderPositions.length);
      setShowSlots(true);
    } else if (!showFirstInteraction && isCurrentProduct) {
      setSelectedIndex(-1);
    }
  }, [showFirstInteraction, isCurrentProduct]);

  // Reagir quando um slot é selecionado
  useEffect(() => {
    if (selectedIndex > -1 && isCurrentProduct && placeholderPositions[selectedIndex]) {
      handleSlotClick(placeholderPositions[selectedIndex]);
    }
  }, [selectedIndex, isCurrentProduct]);

  // Configurar callback para o timer da segunda interação
  useEffect(() => {
    if (showSecondInteraction && isCurrentProduct) {
      setTimerCompleteCallback(endSecondInteraction);
    }
  }, [showSecondInteraction, isCurrentProduct]);

  // Termina Produto pela cena
  const endProduct = useCallback(() => {
    useProductsStore.getState().completeProduct(currentProduct);
    setLastProductName(currentProduct);
    setShowInteraction(false);

    if (currentProduct === 'clima-inteligente') {
      setTimeout(() => {
        setShowEndCard(true);
      }, 1000);
    } else {
      setShowDashboard(true);
    }
  }, [currentProduct]);

  // Callbacks
  const handleSlotClick = useCallback((position) => {
    if (isCurrentProduct) {
      setShowFirstInstruction(false);
      setShowFirstInteraction(false);
      
      if (currentProduct === 'gestao-maquinario' || currentProduct === 'gestao-pecuaria') {
        animateToTarget(position.map((value, index) => value + placeholderLookAtOffset[index]), 1);
      } else {
        animateToTarget(position.map((value, index) => value + placeholderLookAtOffset[index]), 3);
      }
      

      timerToStartFirstAnimation(position);
      timerToStartNeonAnimation();
      timerToStartTimerCard();
    }
  }, [isCurrentProduct]);

  const endSecondInteraction = useCallback(() => {
    setShowSecondInstruction(false);
    setShowSecondInteraction(false);

    playSound('ACTIVATION', { volume: 0.7 });

    setShouldPlaySecondAnimation(true);

    timerToShowTablet();
    timerToHideTablet();
    timerToEndProduct();
  }, [setShowSecondInstruction, endProduct, playSound]);

  const timerToStartNeonAnimation = useCallback(() => {
    setTimeout(() => {
      if (isCurrentProduct) {
        setShouldRenderNeon(true);
      }
    }, startNeonDelay);
  }, [isCurrentProduct]);

  const timerToStartFirstAnimation = useCallback((position) => {
    setTimeout(() => {
      setSelectedPosition(position);
      if (isCurrentProduct) {
        setShouldRenderMainObject(true);
      }
    }, startFirstAnimationDelay);
  }, [isCurrentProduct]);

  const timerToStartTimerCard = useCallback(() => {
    setTimeout(() => {
      setShowSecondInstruction(true);
      setShowSecondInteraction(true);
    }, showTimerCardDelay);
  }, []);

  const timerToShowTablet = useCallback(() => { // inicia quando timer do card termina
    setTimeout(() => {
      animateToTarget(cameraTarget, 1);
      setAnimateTablet(true);
    }, showTabletDelay);
  }, []);

  const timerToHideTablet = useCallback(() => { // inicia quando timer do card termina
    setTimeout(() => {
      setAnimateTablet(false);
    }, hideTabletDelay);
  }, []);

  const timerToEndProduct = useCallback(() => { // inicia quando timer do card termina
    setTimeout(() => {
      endProduct();
    }, endProductDelay);
  }, [endProduct]);

  return {
    shouldRenderMainObject,
    showFirstInteraction,
    showSecondInteraction,
    isCurrentProduct,
    selectedPosition,
    animateTablet,
    handleSlotClick,
    endSecondInteraction,
    placeholderPositions,
    selectedIndex,
    placeholdersVisible,
    shouldRenderPlaceholders,
    handlePlaceholderAnimationOutEnded,
    smallObjectVisible,
    shouldRenderSmallObject,
    handleSmallObjAnimationOutEnded,
    shouldPlaySecondAnimation,
    shouldSkipProduct,
    setShouldRenderNeon,
    shouldRenderNeon
  };
};

export default useProductScene;