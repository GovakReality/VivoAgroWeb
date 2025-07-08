import React from 'react';
import IntroScene from '../../Intro/Scene/IntroScene';
import AgroCoberturaScene from '../../Products/AgroCobertura/Scene/AgroCoberturaScene';
import GestaoMaquinarioScene from '../../Products/GestaoMaquinario/Scene/GestaoMaquinarioScene';
import GestaoPecuariaScene from '../../Products/GestaoPecuaria/Scene/GestaoPecuariaScene';
import ClimaInteligenteScene from '../../Products/ClimaInteligente/Scene/ClimaInteligenteScene';
import Vacas from '../../Scene/Objects/Experiencia/Products/GestaoPecuaria/Vacas';

const Experiencia = () => {

  return (
    <group>
      <IntroScene />
      <AgroCoberturaScene />
      <GestaoMaquinarioScene />
      <ClimaInteligenteScene />
      {/* Desativando Gestão Pecuária mas mantendo as vacas */}
      {/* <GestaoPecuariaScene /> */}
      <Vacas />
    </group>
  );
};

export default Experiencia;