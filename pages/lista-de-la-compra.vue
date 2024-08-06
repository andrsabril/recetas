<template>
    <div :style="{width: '100%'}">
        <Transition name="fade">
            <div class="loading" v-if="loading">
                <Loading />
            </div>
        </Transition>
        <div class="shop-list-main">
            <div v-if="!loading" class="shop-list-container">
                <h3>Lista de la compra</h3>
                <div v-if="getShopCookie.length > 0" class="ingredients-list">
                    <div class="item" v-for="(item, index) in getShopCookie" :key="item.id">
                        <RecipeCheckbox
                            :data="item"
                            :id="item.id"
                            :checked="isChecked(item)"
                            @is-checked="handleIsChecked"
                        />
                    </div>
                </div>
                <div v-else class="empty">No hay ingredientes en la lista de la compra.</div>
                <div class="add-ingredient" :class="{ 'empty': getShopCookie.length <= 0 }">
                    <Icon name="plus" :color="getShopCookie.length <= 0 ? 'grey-dark' : 'grey'" size="m" />
                    <p>Añadir Ingrediente</p>
                </div>
            </div>
            <div class="go-back left-position">
                <ButtonIcon
                    icon-name="arrow-left"
                    color="grey-light"
                    @click="goBack"
                />
            </div>
            <Transition name="go-top">
                <div class="btn-filter right-position" v-if="getShopCookie.length > 0">
                    <ButtonIcon
                        icon-name="delete"
                        color="black"
                        @click="resetList"
                    />
                </div>
            </Transition>
        </div>
    </div>
</template>
<script setup>
    import Cookies from 'js-cookie';
    import { useShopListStore } from '@/stores/shop-list';
    const router = useRouter();

    const loading = ref(true);
    const getShopCookie = ref([]);
    const checkedIngredients = ref([]);

    function getShopCheckedCookie() {
        const jsonString = Cookies.get('shopCheckedList');
        return jsonString ? JSON.parse(jsonString) : [];
    }
    function getShopListCookie() {
        const jsonString = Cookies.get('shopList');
        return jsonString ? JSON.parse(jsonString) : [];
    }

    // Comprueba si un ingrediente está marcado
    const isChecked = (ingredient) => {
        return checkedIngredients.value.some(i => i.id === ingredient.id);
    }

     // Checked unchecked
     const handleIsChecked = ({ ingredient, quantity, id, checked }) => {
        if (checked) {
            let ingredientData = {
                id: id,
                name: ingredient.name,
                quantity: quantity,
                unit: ingredient.unit
            };
            checkedIngredients.value.push(ingredientData);
        } else {
            const index = checkedIngredients.value.findIndex(i => i.id === ingredient.id);
            if (index !== -1) {
                checkedIngredients.value.splice(index, 1);
            }
        }
        console.log(checkedIngredients.value);
        const jsonString = JSON.stringify(checkedIngredients.value);
        Cookies.set('shopCheckedList', jsonString, { expires: 7 });
    };
    
    const shopListStore = useShopListStore();

    const resetList = () => {
        Cookies.remove('shopList');
        getShopCookie.value = [];
        Cookies.remove('shopCheckedList');
        checkedIngredients.value = [];

        shopListStore.updateShopList([]);
    };

    // Función para navegar a la página anterior o a la home
    const goBack = () => {
        if (window.history.length > 1) {
        router.back()
        } else {
        router.push('/')
        }
    }

    onMounted(() => {
        getShopCookie.value = getShopListCookie();
        checkedIngredients.value = getShopCheckedCookie();
        console.log(getShopCookie.value);
        console.log(checkedIngredients.value);

        loading.value = false;
    });

</script>
<style scoped lang="scss">
    .shop-list-main {
        width: 100%;
        max-width: 1000px;
        height: auto;
        padding: 20px 0;

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