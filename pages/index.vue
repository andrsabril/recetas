<template>
    <div class="main">
        <div class="filter-search">
            <div class="input-wrap">
                <input v-model="searching" type="search" placeholder="Buscar receta">
                <div
                    v-if="searching.length > 3"
                    @click="resetSearch"
                    class="reset-input"
                ></div>
            </div>
        </div>
        <div class="filters-tag">
            <div class="tags">
                <div
                    class="tag"
                    v-for="(tag, index) in uniqueTags"
                    :key="tag + index"
                >
                    <input
                        type="checkbox"
                        :id="formatToLink(tag)"
                        name="filters"
                        :checked="selectedTags.includes(tag)"
                        @change="toggleTag(tag)"
                    >
                    <label :for="formatToLink(tag)">{{ tag }}</label>
                </div>
            </div>
        </div>
        <div class="recipes-container">
            <Card
                v-if="filteredRecipes.length > 0"
                v-for="(recipe, index) in filteredRecipes"
                :key="recipe.title + index"
                :title="recipe.title"
                :cookingTime="recipe.cookingTime"
            />
            <div v-else class="empty-state">
                <p>No hay recetas sobre {{ searching }}</p>
            </div>
        </div>
        
    </div>
</template>
<script setup>
    import { useNuxtApp } from '#app'
    const { formatToLink } = useFormatter();

    // Recojer datos de las recetas del plugin
    const { $recipes } = useNuxtApp()
    const recipes = $recipes

    // Crear lista de tags recopilando de las recetas
    let allTags = recipes.flatMap(recipe => recipe.tags);
    let uniqueTags = [...new Set(allTags)];
    uniqueTags.unshift('Todo');

    // Filtros tags
    const selectedTags = ref(['Todo']);

    const toggleTag = (tag) => {
        if (tag === 'Todo') {
            selectedTags.value = ['Todo'];
        } else {
            const index = selectedTags.value.indexOf(tag);
            if (index > -1) {
                selectedTags.value.splice(index, 1);
            if (selectedTags.value.length === 0) {
                selectedTags.value = ['Todo'];
            }
            } else {
                selectedTags.value.push(tag);
                selectedTags.value = selectedTags.value.filter(t => t !== 'Todo');
            }
        }
    };

    // Searching
    const searching = ref('');

    // Reset Search
    const resetSearch = () => {
        searching.value = '';
    };


    // Filtrar recetas según tags y término de búsqueda
    const filteredRecipes = computed(() => {
        return recipes.filter(recipe => {
            const matchesSearch = searching.value.length <= 1 || recipe.title.toLowerCase().includes(searching.value.toLowerCase());
            const matchesTags = selectedTags.value.includes('Todo') || recipe.tags.some(tag => selectedTags.value.includes(tag));
            return matchesSearch && matchesTags;
        });
});

</script>
<style scoped lang="scss">
    .main {
        padding: 40px 0;
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        gap: 26px;
    }
    .filters-tag {
        width: 100%;
        height: auto;
        overflow-x: auto;

        &::-webkit-scrollbar {
            width: 0;
            height: 0;
        }
        &::-webkit-scrollbar-track {
            width: 0;
            height: 0;
        }
        &::-webkit-scrollbar-thumb {
            width: 0;
            height: 0;
        }

        .tags {
            width: fit-content;
            height: fit-content;
            display: flex;
            flex-direction: row;
            gap: 8px;
            padding: 0 $page-margin;

            .tag {
                display: flex;

                label {
                    padding: 8px 14px;
                    border: solid 1px color(greyscale, 600);
                    border-radius: $radii-m;

                    transition: all ease-in-out .2s;
                }
                input {
                    display: none;

                    &:focus + label,
                    &:checked + label {
                        background-color: color(greyscale, 600);
                        color: color(greyscale, 100);
                    }
                }
                
            }

        }
    }
    .filter-search {
        width: 100%;
        padding: 0 $page-margin;

        .input-wrap {
            position: relative;
            width: 100%;

            input {
                width: 100%;
                font-family: $font-family-main;
                font-size: fontSize(body, m);
                padding: 4px 26px;
                border: none;
                border-bottom: 1px solid color(greyscale, 600);
                color: color(greyscale, 600);

                &::placeholder {
                    color: color(greyscale, 300);
                    font-size: fontSize(body, s);
                }
                &::-webkit-search-cancel-button {
                    display: none;
                }
            }
            &::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                transform: translate(0,-54%);
                width: 20px;
                height: 20px;
                background-position: center;
                background-repeat: no-repeat;
                background-size: 100%;
                background-image: url('~/assets/icons/search.svg');
            }

            .reset-input {
                position: absolute;
                top: 50%;
                right: 0;
                transform: translate(0,-54%);
                height: 20px;
                width: 20px;
                background-image: url('~/assets/icons/cancel.svg');
                background-position: center;
                background-repeat: no-repeat;
                background-size: 100%;
                z-index: 1;
            }
        }
    }
    .recipes-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 12px;
        padding: 0 $page-margin;

        .empty-state {
            width: 100%;
            padding: 40px 0;
            display: flex;
            flex-direction: column;
            gap: 30px 20px;
            justify-content: center;
            align-items: center;

            p {
                font-size: fontSize(body, m);
                color: color(greyscale, 400);
                line-height: $font-line-height-m;
                text-align: center;
            }
        }
    }
</style>