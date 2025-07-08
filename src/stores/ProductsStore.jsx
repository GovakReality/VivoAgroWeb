import { create } from 'zustand';

const productsStore = (set, get) => ({
  startProduct: false,
  currentProduct: 'agro-cobertura',
  lastProductName: 'agro-cobertura',
  // productsOrder: ['agro-cobertura', 'gestao-maquinario', 'gestao-pecuaria', 'clima-inteligente'],
  productsOrder: ['agro-cobertura', 'gestao-maquinario', 'clima-inteligente'],
  productsStatus: {
    'agro-cobertura': 'completed',
    'gestao-maquinario': 'unlocked',
    // 'gestao-pecuaria': 'locked',
    'clima-inteligente': 'locked',
  },
  skipProduct: false,
  setSkipProduct: (value) => set({ skipProduct: value }),
  setStartProduct: (start) => set({ startProduct: start }),
  setCurrentProduct: (name) => set({ currentProduct: name }),
  setLastProductName: (name) => set({ lastProductName: name }),
  setProductStatus: (name, status) => set((state) => ({
    productsStatus: {
      ...state.productsStatus,
      [name]: status,
    },
  })),
  unlockNextProduct: (productName) => {
    const state = get();
    const { productsOrder, productsStatus } = state;

    const currentIndex = productsOrder.indexOf(productName);
    if (currentIndex !== -1 && currentIndex < productsOrder.length - 1) {
      const nextProduct = productsOrder[currentIndex + 1];
      if (productsStatus[nextProduct] === 'locked') {
        state.setProductStatus(nextProduct, 'unlocked');
        return true; // Indica que um produto foi desbloqueado
      }
    }
    return false; // Nenhum produto foi desbloqueado
  },
  completeProduct: (productName) => {
    const state = get();
    state.setProductStatus(productName, 'completed');
    state.unlockNextProduct(productName);
  }
});

const useProductsStore = create(productsStore);

export default useProductsStore;