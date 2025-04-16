import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import Stats from 'three/examples/jsm/libs/stats.module';

const PerformanceMonitor = ({}) => {
  // Painel 0: FPS
  // 60 FPS (verde): Excelente
  // 30-59 FPS (amarelo): Aceitável
  // <30 FPS (vermelho): Problemático
  const [fpsStats] = useState(() => {
    const statsObj = new Stats();
    statsObj.showPanel(0); 
    return statsObj;
  });
  
  // Painel 1: MS (tempo por frame)
  // <16ms (verde): Excelente
  // 16-33ms (amarelo): Aceitável
  // >33ms (vermelho): Problemático
  const [msStats] = useState(() => {
    const statsObj = new Stats();
    statsObj.showPanel(1); 
    return statsObj;
  });
  
  // Painel 2: MB (memória)
  // Valor estável: Comportamento normal
  // Crescimento constante sem quedas: Vazamento de memória
  // Picos seguidos de quedas: Garbage collection funcionand  
  const [memoryStats] = useState(() => {
    const statsObj = new Stats();
    statsObj.showPanel(2); 
    return statsObj;
  });
  
  useEffect(() => {
    fpsStats.dom.style.cssText = `
      position: fixed;
      cursor: pointer;
      opacity: 0.8;
      z-index: 10000;
      top: 0px;
      left: 0px;
    `;
    document.body.appendChild(fpsStats.dom);
    
    msStats.dom.style.cssText = `
      position: fixed;
      cursor: pointer;
      opacity: 0.8;
      z-index: 10000;
      top: 48px;
      left: 0px;
    `;
    document.body.appendChild(msStats.dom);
    
    memoryStats.dom.style.cssText = `
      position: fixed;
      cursor: pointer;
      opacity: 0.8;
      z-index: 10000;
      top: 96px;
      left: 0px;
    `;
    document.body.appendChild(memoryStats.dom);
    
    return () => {
      document.body.removeChild(fpsStats.dom);
      document.body.removeChild(msStats.dom);
      document.body.removeChild(memoryStats.dom);
    };
  }, [fpsStats, msStats, memoryStats]);
  
  useFrame(() => {
    fpsStats.update();
    msStats.update();
    memoryStats.update();
  });
  
  return null;
};

export default PerformanceMonitor;