<template>
    <div class="menu-container">
        <div class="items-container">
            <div v-for="(ingredient,index) in uniqueIngredients" :key="index">
                <MenuCheckbox
                    :index="index"
                    :name="ingredient"
                    :quantity="ingredientCounts[ingredient]"
                    :checked="activeIngredients.includes(ingredient)"
                    @update-active-ingredients="updateActiveIngredients"
                    :disabled="filteredRecipesLength === 0"
                />
            </div>
        </div>
        <div class="buttons-container">
            <ButtonAction
                @click="closeMenuIngredients(true)"
                v-if="activeIngredients.length > 0 && filteredRecipesLength !== 0 || filteredRecipesLength === 0"
                text="Cancelar"
                :number="false"
                color="grey"
                :icon="false"
            />
            <ButtonAction
                v-else
                @click="closeMenuIngredients(false)"
                text="Cancelar"
                :number="false"
                color="grey"
                :icon="false"
            />
            <ButtonAction
                v-if="activeIngredients.length > 0 && filteredRecipesLength !== 0"
                @click="closeMenuIngredients(false)"
                text="Buscar"
                :number="filteredRecipesLength"
                color="accent"
                :icon="false"
            />
            <ButtonAction
                v-if="filteredRecipesLength === 0"
                @click="resetIngredients"
                text="Sin recetas"
                :number="false"
                color="grey"
                icon="refresh"
            />
        </div>
    </div>
</template>
<script setup>
    const { formatToLink } = useFormatter();
    import { useIngredientsStore } from '@/stores/ingredients'
    import { useNuxtApp } from '#app'

    const emit = defineEmits(['close-menu-ingredients', 'reset-ingredients']);

    const props = defineProps({
        filteredRecipesLength: {
            type: Number,
            required: true
        }
    })

    const closeMenuIngredients = (shouldReset) => {
        emit('close-menu-ingredients', shouldReset);
    };
    const resetIngredients = () => {
        emit('reset-ingredients');
    };

    // Recojer datos de las recetas del plugin
    const { $recipes } = useNuxtApp()
    const recipes = $recipes

    // Crear lista de ingredientes recopilando de las recetas
    const ingredientCounts = computed(() => {
    const counts = {};
    recipes.flatMap(recipe => recipe.ingredients.map(ingredient => ingredient.name))
        .forEach(name => counts[name] = (counts[name] || 0) + 1);
        return counts;
    });

    const uniqueIngredients = computed(() => [...new Set(Object.keys(ingredientCounts.value))]);

    const ingredientsStore = useIngredientsStore()

    const activeIngredients = computed(() => ingredientsStore.activeIngredients);

    const updateActiveIngredients = ({ name, checked }) => {
        const updatedActiveIngredients = checked
            ? [...activeIngredients.value, name]
            : activeIngredients.value.filter(ingredient => ingredient !== name);
        ingredientsStore.updateActiveIngredients(updatedActiveIngredients);
    };

</script>