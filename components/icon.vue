<template>
    <div class="icon" :class="size">
        <component
            :is="icon"
            class="fill-current"
            :class="[ color ]"
        />
    </div>
</template>
<script setup>
    import { defineAsyncComponent } from 'vue';

    const props = defineProps({
        name: {
            type: String,
            default: 'cancel',
        },
        size: {
            type: String,
            default: 'm',
        },
        color: {
            type: String,
            default: 'white',
        },
    });

    const icon = defineAsyncComponent(() =>
        import(`../assets/icons/${props.name}.svg`)
    );

</script>
<style lang="scss" scoped>
    .icon {
        @include transition-default(.2s);
    }
    // Size
    .s { @include icon-size(s); }
    .m { @include icon-size(m); }
    .l { @include icon-size(l); }
    .xl { @include icon-size(xl); }

    // Color
    .fill-current {
      display: block;
      width: 100%;
      height: 100%;

      &.white { fill: color(greyscale, 100); }
      &.black { fill: color(greyscale, 600); }
      &.tip { fill: color(tip, 500); }
      &.link { fill: color(link, 500); }


    }

</style>