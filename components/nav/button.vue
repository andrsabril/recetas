<template>
    <NuxtLink
        v-if="path"
        :class="[{ 'disabled': route.path == path }, type]"
        class="icon-wrap"
        :to="path"
    >
        <Icon
            :name="icon"
            size="m"
            :color="colorIcon"
        />
        <div class="notice" v-if="notice">
            <p v-if="notice > 0" isNumber>{{ notice }}</p>
        </div>
    </NuxtLink>
    <div
        v-else
        class="icon-wrap"
        :class="type"
    >
        <Icon
            :name="icon"
            size="m"
            :color="colorIcon"
        />
    </div>
</template>
<script setup>
    const route = useRoute();

    const props = defineProps({
        type: {
            type: String,
            default: 'primary'
        },
        path: {
            type: [ String, Boolean ],
            default: false,
        },
        icon: {
            type: String,
            require: true,
        },
        notice: {
            type: [ Boolean, Number, String ],
            default: false,
        },
    });

    const colorIcon = computed(() => {
        if(props.type === 'primary') {
            return route.path == props.path ? 'grey' : 'black';
        }
        else if (props.type === 'secondary') {
            return 'tip';
        }
        else if (props.type === 'tertiary') {
            return 'tip';
        }
        
    });
</script>
<style scoped lang="scss">
    .icon-wrap {
        position: relative;
        border-radius: 100px;
        padding: 12px;
        box-sizing: content-box;

        @include transition-default(.2s);

        &.primary {
            background-color: color(greyscale, 100);
            border: solid 1px color(greyscale, 600);
        }
        &.secondary {
            //background-color: color(tip, 300);
            border: solid 1px color(tip, 400);
        }
        &.tertiary {
            background-color: color(tip, 300);
            border: solid 1px color(tip, 300);
        }

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