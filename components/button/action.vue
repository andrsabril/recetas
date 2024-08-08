<template>
    <div class="button-wrap" :class="[{ 'disabled' : isDisabled }, color]">
        <Icon
            v-if="icon"
            :name="icon"
            :color="colorIcon" 
            size="m"
        />
        <p>{{ text }}<span v-if="number"> ({{ number }})</span></p>
    </div>
</template>
<script setup>
    const props = defineProps({
        text: {
            type: String,
            required: true
        },
        number: {
            type: [Number, Boolean],
            default: false,
        },
        color: {
            type: String,
            default: 'grey',
        },
        icon: {
            type: [String , Boolean],
            default: 'refresh'
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
    });

    const colorIcon = computed(() => {
        if(props.color === 'white' || props.color === 'grey-light') {
            return 'black'
        }
        else if(props.color === 'tip') {
            return 'tip'
        }
        else if(props.color === 'link') {
            return 'link'
        }
        else {
            return 'white'
        }
    });
</script>
<style scoped lang="scss">
    .button-wrap {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border-radius: 100px;
        padding: 2px 16px 0 16px;

        @include transition-default(.2s);

        p span {
            font-size: fontSize(body, s);
        }

        &.white {
           color: color(greyscale, 600);
           background-color: color(greyscale, 100);
        }
        &.black {
           color: color(greyscale, 100);
           background-color: color(greyscale, 600);
        }
        &.grey {
           color: color(greyscale, 100);
           background-color: color(greyscale, 500);
        }
        &.grey-light {
           color: color(greyscale, 600);
           background-color: color(greyscale, 200);
        }
        &.accent {
            color: color(greyscale, 100);
            background-color: color(accent, 300);
        }
        &.tip {
            color: color(tip, 500);
            background-color: color(tip, 300);
        }
        &.link {
            color: color(link, 500);
            background-color: color(link, 300);
        }
        &.inline {
            color: color(greyscale, 100);
            border: 1px solid color(greyscale, 400);
        }
        &.disabled {
            color: color(greyscale, 200);
            background-color: color(greyscale, 400);
            pointer-events: none;
            opacity: .4;
        }

        @media (hover: hover) and (pointer: fine) {
            cursor: pointer;

            &.white {
                &:hover {
                    color: color(greyscale, 100);
                    background-color: color(greyscale, 600);

                    & > div {
                        filter: invert(1);
                    }
                }
            }
            &.black {
                &:hover {
                    color: color(greyscale, 600);
                    background-color: color(greyscale, 100);

                    & > div {
                        filter: invert(1);
                    }
                }
            }
            &.grey {
                &:hover {
                    color: color(greyscale, 100);
                    background-color: color(greyscale, 400);
                }
            }
            &.grey-light {
                &:hover {
                    color: color(greyscale, 100);
                    background-color: color(greyscale, 600);

                    & > div {
                        filter: invert(1);
                    }
                }
            }
            &.accent {
                &:hover {
                    background-color: color(accent, 400);
                }
            }
            &.tip {
                &:hover {
                    background-color: color(tip, 400);
                }
            }
            &.link {
                &:hover {
                    background-color: color(link, 400);
                }
            }
        }
    }
</style>