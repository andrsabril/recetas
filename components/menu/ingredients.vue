<template>
    <div class="menu-container">
        <div
            class="menu-background"
            v-if="activeIngredients.length > 0 && filteredRecipesLength !== 0 || filteredRecipesLength === 0"
            @click="closeMenuIngredients(true)"
        >
        </div>
        <div
            class="menu-background"
            v-else @click="closeMenuIngredients(false)"
        >
        </div>
        <div class="menu-wrap">
            <div class="items-container">
                <div v-for="(ingredient,index) in uniqueIngredients" :key="index">
                    <div
                        v-if="index === 0 || uniqueIngredients[index][0] !== uniqueIngredients[index - 1][0]"
                        class="letter-separator"
                        :id="ingredient[0]"
                    >
                        <p>{{ ingredient[0] }}</p>
                    </div>
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
    </div>
</template>
<script setup>
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

    const uniqueIngredients = computed(() => {
        const ingredientsArray = [...new Set(Object.keys(ingredientCounts.value))];
        ingredientsArray.sort((a, b) => a.localeCompare(b));
        
        return ingredientsArray;
    });

    const ingredientsStore = useIngredientsStore()

    const activeIngredients = computed(() => ingredientsStore.activeIngredients);

    const updateActiveIngredients = ({ name, checked }) => {
        const updatedActiveIngredients = checked
            ? [...activeIngredients.value, name]
            : activeIngredients.value.filter(ingredient => ingredient !== name);
        ingredientsStore.updateActiveIngredients(updatedActiveIngredients);
    };

</script>
<style scoped lang="scss">
    .letter-separator {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 12px $page-margin 12px $page-margin;

        p {
            color: color(greyscale, 400);
            font-size: fontSize(body, s);
        }
    }
</style>