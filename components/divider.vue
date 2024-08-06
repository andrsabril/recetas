<template>
    <div class="divider-wrap" :class="{ 'padding': isPadding }">
        <div class="divider"></div>
    </div>
    
</template>
<script setup>
    const props = defineProps({
        isPadding: {
            type: Boolean,
            default: false,
        }
    });
</script>
<style scoped lang="scss">
    .divider-wrap {
        width: 100%;
        
        &.padding {
            padding: 0 $page-margin;
        }
        .divider {
            width: 100%;
            height: 1px;
            background-color: color(greyscale, 200);
        }
    }
    
</style>