<template>
    <div :style="{width: '100%', display: 'flex', justifyContent: 'center' }">
        <Transition name="fade">
            <div class="loading" v-if="!isClientReady">
                <Loading />
            </div>
        </Transition>
        <div class="shop-list-main">
            <Transition name="go-top">
                <div class="more-tools" v-if="isClientReady && unCheckedIngredientsCookie.length > 0">
                    <NavButton
                        @click="copyToClipboard"
                        type="secondary"
                        :path="false"
                        icon="copy"
                        :notice="false"
                    />
                    <NavButton
                        @click="deleteMode = !deleteMode"
                        :type="!deleteMode ? 'secondary' : 'tertiary'"
                        :path="false"
                        icon="select"
                        :notice="false"
                    />
                </div>
            </Transition>
            <div v-if="isClientReady" class="shop-list-container">
                <h3>Lista de la compra</h3>
                <div v-if="unCheckedIngredientsCookie.length > 0" class="ingredients-list">
                    <div class="item" v-for="(item, index) in unCheckedIngredientsCookie" :key="item.id">
                        <RecipeCheckbox
                            :is-delete-mode="deleteMode"
                            :data="item"
                            :id="item.id"
                            :checked="isChecked(item)"
                            @is-checked="handleIsChecked"
                        />
                    </div>
                </div>
                <div v-else class="empty">No hay ingredientes en la lista de la compra.</div>
                <Transition name="go-top">
                    <div
                        v-if="!openAddIngredientMenu"
                        class="add-ingredient"
                        :class="{ 'empty': unCheckedIngredientsCookie.length <= 0 }"
                        @click="openAddIngredientMenu = true; deleteMode = false"
                    >
                        <Icon name="plus" :color="unCheckedIngredientsCookie.length <= 0 ? 'grey-dark' : 'grey'" size="m" />
                        <p>Añadir Ingrediente</p>
                    </div>
                </Transition>
            </div>
            <Transition name="go-top">
                <div v-if="isClientReady && !openAddIngredientMenu" class="go-back left-position">
                    <ButtonIcon
                        icon-name="arrow-left"
                        color="grey-light"
                        @click="goBack"
                    />
                </div>
            </Transition>
            <Transition name="go-top">
                <div
                    v-if="isClientReady && unCheckedIngredientsCookie.length > 0 && !openAddIngredientMenu"
                    class="btn-filter right-position"
                >
                    <ButtonIcon
                        icon-name="delete"
                        color="black"
                        @click="resetList"
                    />
                </div>
            </Transition>
        </div>
        <Transition name="pop-up">
            <MenuAddIngredient
                v-if="openAddIngredientMenu"
                @close-add-ingredient="openAddIngredientMenu = false"
            />
        </Transition>
    </div>
</template>
<script setup>
    import { useToastStore } from '~/stores/toast';
    const toastStore = useToastStore();
    import { useShopListStore } from '@/stores/shop-list';
    const shopListStore = useShopListStore();
    const router = useRouter();

    const isClientReady = ref(false);
    const unCheckedIngredientsCookie = ref([]);
    const checkedIngredientsCookie = ref([]);

    const openAddIngredientMenu = ref(false);

    const deleteMode = ref(false);

    // Copy function
    const copyToClipboard = async () => {
        // Convertir el array en una cadena de texto con el formato deseado
        const textToCopy = unCheckedIngredientsCookie.value.map(item => `- ${item.name} ${item.quantity} ${item.unit}`).join('\n');

        // Crear un textarea temporal para copiar el texto
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        // Establecer el textarea fuera de la vista
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);

        // Seleccionar el texto dentro del textarea
        textarea.select();
        textarea.setSelectionRange(0, 99999); // Para dispositivos móviles

        try {
            // Copiar el texto seleccionado al portapapeles
            document.execCommand('copy');
            toastStore.addToast(
                'La lista de la compra se ha copiado al portapapeles!',
                'tip',
                'copy',
                false,
            );
        } catch (error) {
            toastStore.addToast(
                'Error al copiar en portapapeles',
                'accent',
                'alert',
                false,
            );
        }

        // Eliminar el textarea temporal del DOM
        document.body.removeChild(textarea);
    };


    // Comprueba si un ingrediente está marcado
    const isChecked = (ingredient) => {
        return checkedIngredientsCookie.value.some(i => i.id === ingredient.id);
    }

     // Checked / unchecked
     const handleIsChecked = ({ ingredient, quantity, id, checked }) => {
        if(deleteMode.value) {
            // Borrar aquí
            const deleteSelect = unCheckedIngredientsCookie.value.findIndex(i => i.id === ingredient.id);
            if (deleteSelect !== -1) {
                unCheckedIngredientsCookie.value.splice(deleteSelect, 1);
            }
        }
        else {
            if (checked) {
                let ingredientData = {
                    id: id,
                    name: ingredient.name,
                    quantity: quantity,
                    unit: ingredient.unit
                };
                checkedIngredientsCookie.value.push(ingredientData);
            } else {
                const index = checkedIngredientsCookie.value.findIndex(i => i.id === ingredient.id);
                if (index !== -1) {
                    checkedIngredientsCookie.value.splice(index, 1);
                }
            }
        }

        // Update List
        shopListStore.updateShopCheckedList(checkedIngredientsCookie.value);
        shopListStore.updateShopList(unCheckedIngredientsCookie.value);
    };
    
    // Limpiar lista de la compra
    const resetList = () => {
        shopListStore.updateShopList([]);
        shopListStore.updateShopCheckedList([]);

        unCheckedIngredientsCookie.value = [];
        checkedIngredientsCookie.value = [];

        deleteMode.value = false;
    };

    // Función para navegar a la página anterior o a la home
    const goBack = () => {
        if (window.history.length > 1) {
        router.back()
        } else {
        router.push('/')
        }
    }

    // Watchers para actualizar las listas locales cuando cambian en el store
    watch(() => shopListStore.shopList, (newList) => {
        unCheckedIngredientsCookie.value = newList;
    }, { immediate: true });

    // Watch for changes in openAddIngredientMenu to disable/enable scroll
    watch(() => openAddIngredientMenu.value, (newVal) => {
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
        shopListStore.loadShopList();
        shopListStore.loadShopCheckedList();

        unCheckedIngredientsCookie.value = shopListStore.shopList;
        checkedIngredientsCookie.value = shopListStore.shopCheckedList;

        console.log(unCheckedIngredientsCookie.value);
        console.log(checkedIngredientsCookie.value);

        isClientReady.value = true;
    });

</script>
<style scoped lang="scss">
    .shop-list-main {
        width: 100%;
        max-width: 1200px;
        height: auto;
        padding: 20px 0;

        .more-tools {
            position: absolute;
            top: $page-margin;
            right: $page-margin;
            display: flex;
            flex-direction: row;
            gap: 12px;
        }

        .shop-list-container {
            padding: 0 $page-margin;
            display: flex;
            flex-direction: column;
            gap: 20px;

            h3 {
                font-size: fontSize(title, l);
                line-height: $font-line-height-s;
                font-weight: $font-weight-medium;
                margin-bottom: 6px;
            }

            .ingredients-list {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .empty {
                color: color(greyscale, 400);
                line-height: $font-line-height-m;
            }

            .add-ingredient {
                width: fit-content;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                gap: 4px;

                p {
                    color: color(greyscale, 400);
                }

                &.empty {
                    margin-top: 20px;
                    padding: 12px 16px 12px 12px;
                    border: solid 1px color(greyscale, 500);
                    border-radius: $radii-m;

                    p {
                        color: color(greyscale, 500);
                    }
                }
            }
        }
    }
    
</style>