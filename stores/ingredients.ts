import { defineStore } from 'pinia';

export const useIngredientsStore = defineStore('ingredients', {
  state: () => ({
    activeIngredients: [] as string[],
  }),
  actions: {
    updateActiveIngredients(updatedActiveIngredients: string[]) {
      this.activeIngredients = updatedActiveIngredients;
    },
    resetActiveIngredients() {
      this.activeIngredients = [];
    },
  },
});