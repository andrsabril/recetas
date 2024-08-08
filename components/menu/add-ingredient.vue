<template>
    <div class="pop-up-container">
        <div class="pop-up-wrap">
            <div class="row">
                <div class="input">
                    <label for="name">Ingrediente*</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Chocolate"
                        v-model="ingredientName"
                        :class="{ 'error': ingredientNameError }"
                    >
                    <Transition name="fade">
                        <p v-if="ingredientNameError" class="error-message">Menos de 3 caracteres</p>
                    </Transition>  
                </div>
            </div>
            <div class="row">
                <div class="input">
                    <label for="quantity">Cantidad*</label>
                    <input
                        type="number"
                        pattern="[0-9]+([\.,][0-9]+)?"
                        id="quantity"
                        name="quantity"
                        placeholder="200"
                        min="1"
                        max="9999"
                        v-model="ingredientQuantity"
                        :class="{ 'error': ingredientQuantityError }"
                    >
                </div>
                <div class="input">
                    <label for="unit">Unidad*</label>
                    <input
                        type="text"
                        id="unit"
                        name="unit"
                        placeholder="g"
                        v-model="ingredientUnit"
                    >
                </div>
            </div>
            <div class="buttons-container">
                <ButtonAction
                    text="Cancelar"
                    :number="false"
                    color="inline"
                    :icon="false"
                    @click="closeAddIngredient"
                />
                <ButtonAction
                    text="Añadir"
                    :number="false"
                    color="accent"
                    :icon="false"
                    :isDisabled="!isFormValid"
                    @click="addIngredient"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
    const emit = defineEmits(['close-add-ingredient']);

    const ingredientName = ref('');
    const ingredientQuantity = ref();
    const ingredientUnit = ref('');

    const isFormValid = computed(() => {
        return  ingredientName.value.trim() !== '' &&
                ingredientName.value.length >= 3 &&
                ingredientQuantity.value !== null &&
                ingredientQuantity.value > 0 &&
                ingredientUnit.value.trim() !== '';
    });

    const ingredientNameError = computed(() => {
        return  ingredientName.value.length > 0 &&
                ingredientName.value.length < 3;
    });
    const ingredientQuantityError = computed(() => {
        if(ingredientQuantity.value) {
            return  ingredientQuantity.value.length > 0 &&
                    Number.isFinite(ingredientQuantity.value) &&
                    !Number.isInteger(ingredientQuantity.value);
        }             
    });

    // Unidad siempre en minusculas
    watch(ingredientUnit, (newValue) => {
        if (newValue) {
            ingredientUnit.value = newValue.toLowerCase();
        }
    });

    const addIngredient = () => {
        if (isFormValid.value) {
            // Lógica para añadir el ingrediente
            console.log('Ingrediente añadido:', {
                name: ingredientName.value,
                quantity: ingredientQuantity.value,
                unit: ingredientUnit.value,
            });
            closeAddIngredient();
        }
    };

    const closeAddIngredient = () => {
        emit('close-add-ingredient', {});
    };
</script>
<style lang="scss" scoped>
.pop-up-wrap {
    padding-top: calc($page-margin * 2);
    gap: 26px;
}
.row {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16px;

    .input {
        position: relative;
        flex: 1;
        font-family: $font-family-main;
        display: flex;
        flex-direction: column;
        gap: 12px;

        label{
            font-size: fontSize(body, s);
            color: color(greyscale, 300);
            padding-left: 10px;
        }
        input{
            width: 100%;
            outline: none;
            border: solid 1px color(greyscale, 500);
            background-color: color(greyscale, 500);
            border-radius: $radii-m;
            font-size: fontSize(body, m);
            padding: 14px;
            color: color(greyscale, 100);

            @include transition-default(.2s);

            &::placeholder {
                color: color(greyscale, 400);
            }
            &.error {
                border: 1px solid color(accent, 300);
                -webkit-box-shadow: inset 0px 0px 80px -39px color(accent, 300);
                -moz-box-shadow: inset 0px 0px 80px -39px color(accent, 300);
                box-shadow: inset 0px 0px 80px -39px color(accent, 300);
            }
        }
        .error-message {
            position: absolute;
            top: 2px;
            right: 0;
            font-size: fontSize(body, xs);
            color: color(accent, 300);
            padding-right: 10px;
        }
    }
}
.buttons-container {
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding-top: 20px;
    z-index: 2;
}
</style>