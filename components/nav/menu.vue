<template>
    <nav>
        <NavButton
            type="primary"
            path="/"
            icon="home"
            :notice="false"
        />
        <NavButton
            type="primary"
            path="/lista-de-la-compra"
            icon="shop-list"
            :notice="checkedIngredientsCookie.length"
        />
    </nav>
</template>
<script setup>
    import { useShopListStore } from '@/stores/shop-list';

    const shopListStore = useShopListStore();
    const checkedIngredientsCookie = ref([]);

    // Cargar la lista de la tienda cuando se monta el componente
    onMounted(() => {
        shopListStore.loadShopList(); // Cargar los datos de las cookies al store
        checkedIngredientsCookie.value = shopListStore.shopList; // Sincronizar localmente con el store
    });

    // Observa cambios en el store y actualiza la referencia local
    watch(() => shopListStore.shopList, (newList) => {
        checkedIngredientsCookie.value = newList;
    }, { immediate: true });
</script>
<style lang="scss" scoped>
    nav {
        width: 100%;
        max-width: 1200px;
        overflow: hidden;
        padding: $page-margin;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 12px;
    }
</style>