<template>
    <div class="button-wrap" :class="color">
        <Icon :name="iconName" size="m" :color="colorIcon"/>
    </div>
</template>
<script setup>

    const props = defineProps({
        iconName: {
            type: String,
            default: 'filter',
        },
        color: {
            type: String,
            default: 'white',
        }
    })

    const colorIcon = computed(() => {
        if(props.color === 'white' || props.color === 'grey-light') {
            return 'black'
        }
        else {
            return 'white'
        }
    });
</script>
<style scoped lang="scss">
    .button-wrap {
        width: 60px;
        height: 50px;
        border-radius: 100px;

        display: flex;
        justify-content: center;
        align-items: center;

        &.white {
            background-color: color(greyscale, 100);
            box-shadow: 0px 8px 28px -8px rgba(0, 0, 0, 0.25);
        }
        &.grey-light {
            background-color: color(greyscale, 200);
            //box-shadow: 0px 8px 28px -8px rgba(0, 0, 0, 0.25);
        }
        &.black {
            background-color: color(greyscale, 600);
        }
    }
</style>