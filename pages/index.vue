<template>
    <div id="main">
        <div class="top-bar">
            <div class="filter-search">
                <div class="input-wrap">
                    <div class="icon-position">
                        <Icon
                            name="search"
                            color="black"
                            size="m"
                        />
                    </div>
                    <input v-model="searching" type="search" placeholder="Buscar receta">
                    <div
                        v-if="searching.length > 3"
                        @click="resetSearch"
                        class="reset-input"
                    >
                        <Icon
                            name="cancel"
                            color="black"
                            size="m"
                        />
                    </div>
                </div>
            </div>
            <div class="btn-filter">
                <ButtonAction
                    @click="showMenuIngredients = true"
                    text="Ingredientes"
                    :number="false"
                    color="grey-light"
                    icon="filter"
                />
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
                        :data-checked="selectedTags.includes(tag)"
                        :class="{'checked': selectedTags.includes(tag)}"
                        @change="toggleTag(tag)"
                    >
                    <label :for="formatToLink(tag)">{{ tag }}</label>
                </div>
            </div>
        </div>
        
        <div class="recipes-container">
            <div class="display-mode">
                <p>{{ filteredRecipes.length }} Recetas</p>
                <div class="display-selector-wrap">
                    <div 
                        class="icon-wrap"
                        :class="{'active': cardVisualizationMode}"
                        @click="cardVisualizationMode = !cardVisualizationMode"
                    >
                        <Icon name="display-card" color="black" :size="cardVisualizationMode ? 'l' : 'xl'" />
                    </div>
                    <div
                        class="icon-wrap"
                        :class="{'active': !cardVisualizationMode}"
                        @click="cardVisualizationMode = !cardVisualizationMode"
                    >
                        <Icon name="display-list" color="black" :size="!cardVisualizationMode ? 'l' : 'xl'" />
                    </div>
                </div>
            </div>
            <div class="card-grid" v-if="filteredRecipes.length > 0">
                <TransitionGroup name="cards">
                    <div v-for="(recipe, index) in filteredRecipes" :key="recipe.title + index">
                    <Card       
                        v-if="filteredRecipes.includes(recipe)"
                        :title="recipe.title"
                        :description="recipe.description"
                        :total-time="recipe.cookingTime + recipe.preparingTime"
                        :per-person="recipe.perPerson"
                        :ingredients-length="recipe.ingredients.length"
                        :visualization-mode="cardVisualizationMode"
                    />
                </div>
                </TransitionGroup>
            </div>
            <Transition name="fade">
                <div
                    v-if="filteredRecipes.length <= 0"
                    class="empty-state"
                >
                    <p>No hay recetas sobre {{ searching }}</p>
                </div>
            </Transition>
        </div>
        <Transition name="menu">
            <MenuIngredients
                v-if="showMenuIngredients"
                :filteredRecipesLength="filteredRecipes.length"
                @close-menu-ingredients="handleCloseMenuIngredients"
                @resetIngredients="resetIngredients"
            />
        </Transition>
        <Transition name="go-top">
            <div class="btn-go-top" v-if="showGoTopButton">
                <ButtonIcon
                    icon-name="arrow-up"
                    color="black"
                    @click="goTop"
                />
            </div>
        </Transition>
        <div class="btn-filter">
            <ButtonIcon
                icon-name="filter"
                color="white"
                @click="showMenuIngredients = true"
            />
        </div>
        <Transition name="go-top">
            <div
                class="ingredients-reference" v-if="activeIngredients.length > 0">
                <ButtonReference
                    :ingredients-selected="activeIngredients"
                    @click="resetIngredients"
                />
            </div>
        </Transition>
       
    </div>
</template>
<script setup>
    import { useIngredientsStore } from '@/stores/ingredients'
    import { useNuxtApp } from '#app'
    const { formatToLink } = useFormatter();

    const showMenuIngredients = ref(false);
    const showGoTopButton = ref(false);
    const cardVisualizationMode = ref(true);

    // Acción Botón go to top
    const goTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    // Aparición Botón go to top
    const checkScrollPosition = () => {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        
        if (scrollPosition > viewportHeight * .6) {
            showGoTopButton.value = true;
        } else {
            showGoTopButton.value = false;
        }
    };

    const ingredientsStore = useIngredientsStore();

    // Recojer lista de ingredientes activados.
    const activeIngredients = computed(() => ingredientsStore.activeIngredients)

    // Recojer datos de las recetas del plugin
    const { $recipes } = useNuxtApp()
    const recipes = $recipes

    // Crear lista de tags recopilando de las recetas
    let allTags = recipes.flatMap(recipe => recipe.tags);
    let uniqueTags = [...new Set(allTags)];
    uniqueTags.unshift('Todo');
    let uniqueTagsLength = uniqueTags.length - 1;

    // Filtros tags
    const selectedTags = ref(['Todo']);

    const toggleTag = (tag) => {
        if (tag === 'Todo' || selectedTags.value.length === uniqueTagsLength - 1) {
            selectedTags.value = ['Todo'];
        }
        else {
            const index = selectedTags.value.indexOf(tag);
            if (index > -1) {
                selectedTags.value.splice(index, 1);
                if (selectedTags.value.length === 0) {
                    selectedTags.value = ['Todo'];
                } 
            }
            else {
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
    const resetIngredients = () => {
        ingredientsStore.resetActiveIngredients();
    };
    // Cierre del menu
    const handleCloseMenuIngredients = (shouldReset) => {
        if (shouldReset) {
            resetIngredients();
            setTimeout(() => {
                showMenuIngredients.value = false;
            }, 200);
        }
        else {
            showMenuIngredients.value = false;
        }
        
    };


    // Filtrar recetas según tags y término de búsqueda
    const filteredRecipes = computed(() => {
        const activeIngredientsSet = new Set(ingredientsStore.activeIngredients)

        return recipes.filter(recipe => {
            const matchesSearch = searching.value.length <= 1 || recipe.title.toLowerCase().includes(searching.value.toLowerCase())
            const matchesTags = selectedTags.value.includes('Todo') || recipe.tags.some(tag => selectedTags.value.includes(tag))

            // Comprobar si la receta contiene todos los ingredientes activos
            const recipeIngredientsSet = new Set(recipe.ingredients.map(ingredient => formatToLink(ingredient.name)))
            const containsAllActiveIngredients = [...activeIngredientsSet].every(ingredient => recipeIngredientsSet.has(formatToLink(ingredient)))

            return matchesSearch && matchesTags && containsAllActiveIngredients
        })
    });

    // Watch for changes in showMenuIngredients to disable/enable scroll
    watch(() => showMenuIngredients.value, (newVal) => {
        if (newVal) {
            document.body.classList.add('no-scroll')
        } else {
            document.body.classList.remove('no-scroll')
        }
    })

    onBeforeUnmount(() => {
        document.body.classList.remove('no-scroll')
    })
    onMounted(() => {
        window.addEventListener('scroll', checkScrollPosition);
    });
    onUnmounted(() => {
        window.removeEventListener('scroll', checkScrollPosition);
    });

</script>
<style scoped lang="scss">
    #main {
        padding: 40px 0;
        width: 100%;
        max-width: 1200px;
        height: auto;
        display: flex;
        flex-direction: column;
        gap: 26px;

        @media (min-width: $break-mobile) {
            gap: 40px;
        }
    }
    .top-bar {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0 $page-margin;
        gap: 12px;

        .filter-search {
            width: 100%;
            max-width: 600px;

            .input-wrap {
                position: relative;
                width: 100%;

                .icon-position {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                    pointer-events: none;

                    @media (min-width: $break-mobile) {
                        left: 16px;
                    }
                }

                input {
                    width: 100%;
                    font-family: $font-family-main;
                    font-size: fontSize(body, m);
                    padding: 4px 26px;
                    border: none;
                    border-bottom: 1px solid color(greyscale, 600);
                    background-color: transparent;
                    color: color(greyscale, 600);
                    appearance: none;
                    -webkit-appearance: none;

                    &::placeholder {
                        color: color(greyscale, 300);
                        font-size: fontSize(body, m);
                    }
                    &::-webkit-search-cancel-button {
                        display: none;
                    }

                    @media (min-width: $break-mobile) {
                        border: none;
                        height: 50px;
                        //background-color: color(greyscale, 200);
                        border-radius: 100px;
                        border: 1px solid color(greyscale, 400);
                        padding: 4px 42px;
                        cursor: text;
                        
                        @include transition-default(.2s);

                        &:hover {
                            border: 1px solid color(greyscale, 600);
                        }
                    }
                }

                .reset-input {
                    position: absolute;
                    top: 50%;
                    right: 0;
                    padding: 6px;
                    transform: translateY(-50%);
                    background-image: url('~/assets/icons/cancel.svg');
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: 100%;
                    z-index: 1;

                    @media (min-width: $break-mobile) {
                        right: 12px;
                    }
                }
            }
        }
        .btn-filter {
            position: relative;
            right: inherit;
            bottom: inherit;
            display: none;

            @media (min-width: $break-mobile) {
                display: block;
            }
        }
    }
    .filters-tag {
        width: 100%;
        height: auto;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none; 

        &::-webkit-scrollbar {
            width: 0;
            height: 0;
            display: none;
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
                    border: solid 1px color(greyscale, 500);
                    color: color(greyscale, 600);
                    border-radius: $radii-m;

                    @include transition-default(.2s);

                    @media (hover: hover) and (pointer: fine) and (min-width: $break-mobile) {
                        cursor: pointer;
                        &:hover {
                            border: solid 1px color(greyscale, 600);
                            border-radius: 10px;
                        }
                    }
                }
                input {
                    display: none;

                    &.checked + label {
                        background-color: color(greyscale, 600);
                        border: solid 1px color(greyscale, 600);
                        color: color(greyscale, 100);
                        border-radius: $radii-m;
                    }
                }
                
            }

        }
    }
    .recipes-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 12px;
        padding: 0 $page-margin;
        margin-top: 8px;

        .display-mode {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex;
            width: 100%;
            height: 20px;
            padding: 0 8px;
            margin-bottom: 6px;

            p {
                font-size: fontSize(body, s);
                font-weight: $font-weight-regular;
                padding-top: 6px;
            }

            .display-selector-wrap {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                .icon-wrap {
                    padding: 4px 0 4px 4px;
                    @include transition-default(.2s);

                    &.active {
                        opacity: .4;
                        transform: scale(1);
                    }
                }
            }
        }

        .card-grid {
            width: 100%;
            height: auto;
            display: grid;
            grid-template-columns: 1fr;
            grid-column-gap: 12px;
            grid-row-gap: 12px;

            @media (min-width: 590px) {
                grid-template-columns: repeat(2, 1fr);
            }
            @media (min-width: $break-width) {
                grid-template-columns: repeat(3, 1fr);
            }
        }

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
    .btn-filter {
        position: fixed;
        right: 16px;
        bottom: 16px;

        @media (min-width: $break-mobile) {
            display: none;
        }
    }
    .btn-go-top {
        position: fixed;
        right: 16px;
        bottom: calc(16px + (16px / 2) + 50px);

        @media (min-width: $break-width) {
            right: calc(((100% - (1200px - 40px)) / 2));
            transform: translateX(calc(100% + 20px));
        }
    }
    .ingredients-reference {
        position: fixed;
        left: 16px;
        bottom: 16px;
        width: calc(100% - (50px + (16px * 3) + 10px));
        height: auto;
    }
</style>