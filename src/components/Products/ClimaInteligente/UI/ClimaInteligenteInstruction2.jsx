import React from 'react';
import InstructionWithTimer from '../../../Commons/UI/InstructionWithTimer/InstructionWithTimer';

const ClimaInteligenteInstruction2 = ({ isVisible }) => {
  return (
    <InstructionWithTimer
      isVisible={isVisible}
      title=""
      description="Estamos iniciando a sua estação meteorológica para que você tenha acesso aos dados climáticos da sua fazenda."
      duration={4}
    />
  );
};

export default ClimaInteligenteInstruction2;