import AgroCoberturaCard from '../components/Products/AgroCobertura/UI/AgroCoberturaCard';
import GestaoMaquinarioCard from '../components/Products/GestaoMaquinario/UI/GestaoMaquinarioCard';
import GestaoPecuariaCard from '../components/Products/GestaoPecuaria/UI/GestaoPecuariaCard';
import ClimaInteligenteCard from '../components/Products/ClimaInteligente/UI/ClimaInteligenteCard';

import AgroCoberturaInstruction1 from '../components/Products/AgroCobertura/UI/AgroCoberturaInstruction1';
import AgroCoberturaInstruction2 from '../components/Products/AgroCobertura/UI/AgroCoberturaInstruction2';
import ClimaInteligenteInstruction1 from '../components/Products/ClimaInteligente/UI/ClimaInteligenteInstruction1';
import ClimaInteligenteInstruction2 from '../components/Products/ClimaInteligente/UI/ClimaInteligenteInstruction2';
import GestaoMaquinarioInstruction1 from '../components/Products/GestaoMaquinario/UI/GestaoMaquinarioInstruction1';
import GestaoMaquinarioInstruction2 from '../components/Products/GestaoMaquinario/UI/GestaoMaquinarioInstruction2';
import GestaoPecuariaInstruction1 from '../components/Products/GestaoPecuaria/UI/GestaoPecuariaInstruction1';
import GestaoPecuariaInstruction2 from '../components/Products/GestaoPecuaria/UI/GestaoPecuariaInstruction2';

const productRegistry = {
  'agro-cobertura': {
    card: AgroCoberturaCard,
    instructions: {
      first: AgroCoberturaInstruction1,
      second: AgroCoberturaInstruction2
    }
  },
  'gestao-maquinario': {
    card: GestaoMaquinarioCard,
    instructions: {
      first: GestaoMaquinarioInstruction1,
      second: GestaoMaquinarioInstruction2
    }
  },
  // 'gestao-pecuaria': {
  //   card: GestaoPecuariaCard,
  //   instructions: {
  //     first: GestaoPecuariaInstruction1,
  //     second: GestaoPecuariaInstruction2
  //   }
  // },
  'clima-inteligente': {
    card: ClimaInteligenteCard,
    instructions: {
      first: ClimaInteligenteInstruction1,
      second: ClimaInteligenteInstruction2
    }
  },
};

export default productRegistry;