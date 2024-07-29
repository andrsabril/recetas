<template>
    <div class="drop-down">
        <div class="title" @click="isOpen = !isOpen">
            <h2>{{ title }}</h2>
            <Icon
                name="arrow-down"
                color="black"
                size="m"
                :class="{'active': isOpen}"
            />
        </div>
        <div class="hide-wrap" :style="{ height: isOpen ? `${slotRef.clientHeight}px` : '0px' }">
            <div class="slot" ref="slotRef">
                <slot></slot>
            </div> 
        </div>
    </div>
</template>
<script setup>
    const props = defineProps ({
        title: {
            type: [ String, Boolean ],
            required: true,
        },
    });

    const slotRef = ref();
    const isOpen = ref(false);
</script>
<style scoped lang="scss">
    .drop-down {
        width: 100%;
        height: auto;

        .title {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            h2 {
                font-size: fontSize(title, m);
            }

            .active {
                transform: rotate(90deg);
            }
        }
        .hide-wrap {
            width: 100%;
            height: 0;
            overflow: hidden;

            @include transition-default(.2s);

            .slot {
                width: 100%;
                height: auto;
                padding-top: 20px;
            }
        }
    }
</style>