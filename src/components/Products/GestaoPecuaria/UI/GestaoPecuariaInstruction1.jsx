import React from 'react';
import Instruction from '../../../Commons/UI/Instruction/Instruction';
import useComponentVisibility from '../../../../hooks/useComponentVisibility';

const GestaoPecuariaInstruction1 = ({ isVisible }) => {
  const [shouldRender, handleAnimationOutEnded] = useComponentVisibility(isVisible);

  if (!shouldRender) return null;

  return (
    <div className="instruction-container">
      <Instruction
        title=""
        description="Aplique o brinco no gado e tenha acesso aos dados do animal."
        isVisible={isVisible}
        onAnimationOutEnded={handleAnimationOutEnded}
      />
    </div>
  );
};

export default GestaoPecuariaInstruction1;