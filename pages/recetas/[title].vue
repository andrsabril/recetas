<template>
    <div class="recipe-main">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="recipe" class="recipe-container">
        <h1>{{ recipe.title}}</h1>
        <div
          class="cover-image"
          :style="{backgroundImage: `url('${imageSrc}')`}"
        ></div>
        <p class="description">{{ recipe.description }}</p>
        <Divider />
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
                :class="{'disabled': actualPerPerson === minPerPerson}"
              >
                <Icon name="minus" color="black" size="s"/>
              </div>
              <Transition name="go-top">
                <p class="value" :key="actualPerPerson">{{ actualPerPerson }}</p>
              </Transition>
              <div
                class="picker-btn"
                @click="perPersonUpdate('plus')"
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
        <Divider />
        <Dropdown title="Utensilios">
          Info
        </Dropdown>
        <Divider />
        <Dropdown title="Ingredientes">
          Info
        </Dropdown>
        <Divider />
        <Dropdown title="Preparación">
          Info
        </Dropdown>
        <Divider />
        <Dropdown title="Preparación">
          Info
        </Dropdown>
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


  // Función para navegar a la página anterior o a la home
  function goBack() {
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
      }

    }
    else if(context == 'plus') {
      if( actual < maxPerPerson.value && (actual + stepPerPerson.value) <= maxPerPerson.value) {
        actualPerPerson.value = actual + stepPerPerson.value;
      }
    }
  }

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
    height: auto;
    min-height: 100dvh;
  }
  .recipe-container {
    width: 100%;
    padding: 20px $page-margin 120px $page-margin;
    display: flex;
    flex-direction: column;
    gap: 20px;

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

    .first-data {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;

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
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 36px;
            border-radius: 100px;
            background-color: color(greyscale, 200);

            @include transition-default(.2s);

            &.disabled {
              opacity: .3;
            }
          }
        }
      }
    }
  }

</style>