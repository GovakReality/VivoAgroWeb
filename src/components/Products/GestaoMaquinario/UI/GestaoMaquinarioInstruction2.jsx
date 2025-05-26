import React from 'react';
import InstructionWithTimer from '../../../Commons/UI/InstructionWithTimer/InstructionWithTimer';

const GestaoMaquinarioInstruction2 = ({ isVisible }) => {
  return (
    <InstructionWithTimer
      isVisible={isVisible}
      title=""
      description="Estamos conectando seus sensores para integrar e fornecer os dados da sua frota."
      duration={4}
    />
  );
};

export default GestaoMaquinarioInstruction2;