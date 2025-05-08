import React from 'react';
import InstructionWithTimer from '../../../Commons/UI/InstructionWithTimer/InstructionWithTimer';

const GestaoPecuariaInstruction2 = ({ isVisible }) => {
  return (
    <InstructionWithTimer
      isVisible={isVisible}
      title=""
      description="Estamos ativando o monitoramento para que tenha acesso aos dados dos seus animais."
      duration={4}
    />
  );
};

export default GestaoPecuariaInstruction2;