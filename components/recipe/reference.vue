<template>
    <NuxtLink :to="'/recetas/' + formatToLink(data.hasReference)">
        <div class="reference-wrap">
            <div class="left">
                <Icon name="link" size="m" color="link"/>
                <p>{{ data.hasReference }}</p>  
                
            </div>
            <p class="underline">Ver receta</p>
        </div>
    </NuxtLink>
</template>
<script setup>
    const { formatToLink } = useFormatter();
    const props = defineProps({
        data: {
            type: Object,
            require: true,
        },
    });
</script>
<style scoped lang="scss">
    .reference-wrap {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: color(link, 300);
        border-radius: $radii-m;
        padding: 16px 22px 16px 16px;
        gap: 20px;

        .left {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            gap: 10px;
        }

        p {
            font-size: fontSize(body, m);
            color: color(link, 500);

            &.underline {
                white-space: nowrap;
                text-decoration: underline;
                font-size: fontSize(body, s);
                opacity: .4;
            }
        }

    }
</style>