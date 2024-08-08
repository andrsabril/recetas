<template>
    <div class="toast-container">
        <TransitionGroup name="toast" tag="div">
            <NuxtLink
                :to="toast.link ? '/' + toast.link : ''"
                v-for="toast in toasts"
                :key="toast.id"
                class="toast-wrap"
                :class="toast.color"
                @click="handleToastClick(toast.id)"
            >
                <Icon :name="toast.icon" :color="toast.color" size="xxl"/>
                <div class="text">
                    <p>
                        {{ toast.text }}
                        <span v-if="toast.link" class="see-more">Ver más</span>
                    </p>
                </div>
                
            </NuxtLink>
        </TransitionGroup>
    </div>
</template>
<script setup>
    import { useToastStore } from '~/stores/toast';

    const toastStore = useToastStore();
    const toasts = computed(() => toastStore.toasts);

    const handleToastClick = (id) => {
        toastStore.removeToast(id);
    };
</script>
<style scoped lang="scss">
    .toast-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
        z-index: 12;

        .toast-wrap {
            width: calc(100% - $page-margin);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            padding: 20px;
            margin: calc($page-margin / 2) calc($page-margin / 2) 0 calc($page-margin / 2);
            border-radius: $radii-m;
            
            .text {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                gap: 0px;

                p {
                    line-height: $font-line-height-s;
                    font-size: fontSize(body, s);
                    font-weight: $font-weight-regular;

                    span.see-more {
                        text-decoration: underline;
                        opacity: .6;
                    }
                }
            }

            &.black {
                background-color: color(greyscale, 600);
                color: color(greyscale, 100);
            }
            &.tip {
                background-color: color(tip, 400);
                color: color(tip, 500);
            }
            &.link {
                background-color: color(link, 400);
                color: color(link, 500);
            }
        }
    }
</style>