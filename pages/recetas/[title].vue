<template>
  <div :style="{width: '100%'}">
    <Transition name="fade">
        <div class="loading" v-if="loading">
            <Loading />
        </div>
    </Transition>
    <div class="recipe-main">
      <div v-if="recipe && !loading" class="recipe-container">
        <div class="header">
          <h1>{{ recipe.title}}</h1>
          <div
            class="cover-image"
            :style="{backgroundImage: `url('${imageSrc}')`}"
          ></div>
          <p class="description">{{ recipe.description }}</p>
        </div>
        <Divider :isPadding="true" />
        <div class="first-data">
          <div class="item">
            <p class="name">Preparación</p>
            <div class="p-wrap">
              <p class="value">{{ recipe.preparingTime }} min</p>
            </div>
          </div>
          <div class="item">
            <p class="name">Por persona</p>
            <div class="picker-value">
              <div
                class="picker-btn"
                @click="perPersonUpdate('minus')"
                ref="btnMinusRef"
                :class="{'disabled': actualPerPerson === minPerPerson}"
              >
                <Icon name="minus" color="black" size="s"/>
              </div>
              <Transition name="go-top-number">
                <p class="value" :key="actualPerPerson">{{ actualPerPerson }}</p>
              </Transition>
              <div
                class="picker-btn"
                @click="perPersonUpdate('plus')"
                ref="btnPlusRef"
                :class="{'disabled': actualPerPerson === maxPerPerson}"
              >
                <Icon name="plus" color="black" size="s"/>
              </div>
            </div>
          </div>
          <div class="item">
            <p class="name">Cocinado</p>
            <div class="p-wrap">
              <p class="value">{{ recipe.cookingTime }} min</p>
            </div> 
          </div>
        </div>
        <div class="data-container">
          <RecipeDropdown
            v-if="recipe.utils"
            @toggle-dropdown="toggleDropdown(0)"
            :is-open="openDropdownIndex === 0"
            title="Utensilios"
            display="text"
            :data="recipe.utils"
            :url="route.params.title"
          />
          <RecipeDropdown
            v-if="recipe.ingredients"
            @toggle-dropdown="toggleDropdown(1)"
            :is-open="openDropdownIndex === 1"
            title="Ingredientes"
            display="list"
            :actual-per-person="actualPerPerson"
            :default-per-person="recipe.perPerson.default"
            :data="recipe.ingredients"
            :url="route.params.title"
          />
          <RecipeDropdown
            v-if="recipe.preparation"
            @toggle-dropdown="toggleDropdown(2)"
            :is-open="openDropdownIndex === 2"
            title="Preparación"
            display="text"
            :data="recipe.preparation"
            :url="route.params.title"
          />
          <RecipeDropdown
            v-if="recipe.presentation"
            @toggle-dropdown="toggleDropdown(3)"
            :is-open="openDropdownIndex === 3"
            title="Presentación"
            display="text"
            :data="recipe.presentations"
            :url="route.params.title"
          />
        </div>
      </div>
      <div v-else class="error-data">Error en los datos</div>
      <div class="go-back left-position">
        <ButtonIcon
            icon-name="arrow-left"
            color="grey-light"
            @click="goBack"
        />
      </div>
      <div class="open-list right-position">
        <ButtonIcon
            icon-name="list"
            color="black"
        />
      </div>
    </div>
  </div> 
</template>
<script setup>
  const route = useRoute();
  const router = useRouter();

  const recipe = ref(null)
  const loading = ref(true)
  const actualPerPerson = ref(null);
  const minPerPerson = ref(1);
  const maxPerPerson = ref(100);
  const stepPerPerson = ref(1);

  const openDropdownIndex = ref(false);
  const btnMinusRef = ref();
  const btnPlusRef = ref();
  

  // DropDown
  const toggleDropdown = (index) => {
    if (openDropdownIndex.value === index) {
      openDropdownIndex.value = null;
    } else {
      openDropdownIndex.value = index;
    }
  };

  // Función para navegar a la página anterior o a la home
  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const imageSrc = ref(`/images/${route.params.title}/cover.jpg`);

  // Recoger datos de esta receta
  async function loadRecipe(title) {
    try {
      const recipeData = await import(`@/data/recipes/${title}.ts`)
      recipe.value = recipeData.data
      
    } catch (error) {
      console.error('Failed to load recipe:', error)
      recipe.value = null
    }
  }

  // Función ampliar disminuir cantidad numero de personas
  const perPersonUpdate = (context) => {
    let actual = actualPerPerson.value;

    if(context == 'minus') {
      // Si es el botón de menos
      if( actual > minPerPerson.value && (actual + stepPerPerson.value) >= minPerPerson.value) {
        actualPerPerson.value = actual - stepPerPerson.value;
        addAndRemoveClass(btnMinusRef);
      }

    }
    else if(context == 'plus') {
      if( actual < maxPerPerson.value && (actual + stepPerPerson.value) <= maxPerPerson.value) {
        actualPerPerson.value = actual + stepPerPerson.value;
        addAndRemoveClass(btnPlusRef);
      }
    }
  }

  // Button animation
  const addAndRemoveClass = (buttonRef) => {
    if (buttonRef.value) {
        buttonRef.value.classList.add('press');
        setTimeout(() => {
            buttonRef.value.classList.remove('press');
        }, 300); 
      }
  };

  onMounted(async () => {
    const title  = route.params.title;
    await loadRecipe(title)
    loading.value = false

    // Selector cantidad por personas
    actualPerPerson.value = recipe.value.perPerson.default;
    minPerPerson.value = recipe.value.perPerson.min;
    maxPerPerson.value = recipe.value.perPerson.max;
    stepPerPerson.value = recipe.value.perPerson.step;
  })

</script>
<style scoped lang="scss">
  .recipe-main {
    width: 100%;
    max-width: 1000px;
    height: auto;
    min-height: 100dvh;
  }
  .recipe-container {
    width: 100%;
    padding: 20px 0 120px 0;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .header {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 0 $page-margin;

      h1 {
        font-size: fontSize(title, l);
        line-height: $font-line-height-s;
        font-weight: $font-weight-medium;
        margin-bottom: 6px;
      }

      .cover-image {
        width: 100%;
        height: auto;
        aspect-ratio: 4/2.5;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: $radii-m;
        margin-bottom: 6px;
      }

      p.description {
        font-size: fontSize(body, s);
        line-height: $font-line-height-m;
      }
    }

    .first-data {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding: 0 $page-margin;

      .item {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        flex: 1;

        p.name {
          font-size: fontSize(body, xs);
        }
        .p-wrap {
          height: 36px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        p.value {
          font-size: fontSize(body, m);
        }

        .picker-value {
          position: relative;
          width: calc((36px * 2) + 34px + 4px);
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 2px;

          p.value {
            width: 100%;
            position: absolute;
            left: 0;
            text-align: center;
            pointer-events: none;
          }

          .picker-btn {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 36px;
            border-radius: 100px;
            background-color: color(greyscale, 200);
            overflow: hidden;

            @include transition-default(.2s, background-color);

            &.disabled {
              opacity: .3;
            }

            &.press::before {
              content: '';
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              transform: scale(0);
              background-color: color(greyscale, 300);
              border-radius: 100%;
              opacity: 0;
            
              animation-name: pressButton;
              animation-duration: .4s;
              animation-timing-function: ease-out;
              animation-iteration-count: 1;
            }
          }
        }
      }
    }
    .data-container {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
  }
  .open-list {
    z-index: 2;
  }

  @keyframes pressButton {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1);
      opacity: .6;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

</style>