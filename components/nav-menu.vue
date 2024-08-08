<template>
    <nav>
        <NuxtLink :class="{'disabled': route.path == '/'}" class="icon-wrap" to="/">
            <Icon name="home" size="m" :color="route.path == '/' ? 'grey' : 'black'"/>
        </NuxtLink>
        <NuxtLink :class="{'disabled': route.path == '/lista-de-la-compra'}" class="icon-wrap" to="/lista-de-la-compra">
            <Icon name="shop-list" size="m" :color="route.path == '/lista-de-la-compra' ? 'grey' : 'black'"/>
            <div class="notice" v-if="checkedIngredientsCookie.length > 0">{{ checkedIngredientsCookie.length }}</div>
        </NuxtLink>
    </nav>
</template>
<script setup>
    import { useRoute } from 'vue-router';
    import { useShopListStore } from '@/stores/shop-list';

    const route = useRoute();
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
    .icon-wrap {
        position: relative;
        background-color: color(greyscale, 100);
        border: solid 1px color(greyscale, 600);
        border-radius: 100px;
        padding: 12px;
        box-sizing: content-box;

        @include transition-default(.2s);

        &.disabled {
            opacity: .8;
            pointer-events: none;
            background-color: color(greyscale, 200);
            border: solid 1px color(greyscale, 200);
        }

        .notice {
            position: absolute;
            top: -4px;
            right: -4px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 18px;
            height: 18px;
            font-size: fontSize(body, xs);
            background-color: color(accent, 300);
            color: color(greyscale, 100);
            border-radius: 100%;
        }
    }
</style>