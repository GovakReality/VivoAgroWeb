import React from 'react';
import InstructionWithTimer from '../../../Commons/UI/InstructionWithTimer/InstructionWithTimer';

const AgroCoberturaInstruction2 = ({ isVisible }) => {
  return (
    <InstructionWithTimer
      isVisible={isVisible}
      title=""
      description="Estamos ativando sua antena para que você tenha acesso às novas tecnologias na sua fazenda."
      duration={4}
    />
  );
};

export default AgroCoberturaInstruction2;