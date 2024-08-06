<template>
    <div>
        <input
            type="checkbox"
            :id="inputId"
            :checked="checked"
            name="ingredients"
            @change="onCheckboxChange"
            :data-checked="checked"
            :class="{'disabled': disabled}"
        >
        <label :for="inputId">
            <div class="icon">
                <Icon
                    name="cancel"
                    color="black"
                    size="m"
                />
            </div>
            <p>{{ name }}</p>
            <span>{{ quantity }}</span>
        </label>
    </div>
</template>
<script setup>
    const { formatToLink } = useFormatter();

    const emit = defineEmits(['update-active-ingredients']);

    const props = defineProps ({
        index: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        checked: {
            type: Boolean,
            required: true,
        },
        disabled: {
            type: Boolean,
            required: true,
        }
    });
    
    const onCheckboxChange = (event) => {
        emit('update-active-ingredients', { name: props.name, checked: event.target.checked });
    };

    const inputId = computed(() => formatToLink(props.name));

</script>
<style scoped lang="scss">
    label {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 6px;
        padding: 2px 14px 0 14px;
        height: 52px;
        border: solid 1px color(greyscale, 400);
        border-radius: 100px;
        color: color(greyscale, 100);

        @include transition-default(.2s);
        
        .icon {
            width: 0;
            height: 20px;

            opacity: 0;
            @include transition-default(.2s);

            @media (min-width: $break-mobile) {
                & > div {
                    filter: invert(1);
                }
            }
        }

        span {
            color: color(greyscale, 300);
            font-size: fontSize(body, s);
            vertical-align: super;
            margin-top: -4px;

            @include transition-default(.2s);

            @media (min-width: $break-mobile) {
                color: color(greyscale, 400);
            }
        }

        @media (min-width: $break-mobile) {
            border: solid 1px color(greyscale, 500);
            color: color(greyscale, 600);
        }

        @media (hover: hover) and (pointer: fine) and (min-width: $break-mobile) {
            cursor: pointer;
            &:hover {
                background-color: color(accent, 300);
                color: color(greyscale, 100);
                border-color: color(accent, 300);

                span {
                    color: color(greyscale, 200);
                }
            }
        }
    }
    input {
        display: none;

        &:checked + label {
            background-color: color(greyscale, 100);
            color: color(greyscale, 600);
            border-color: color(greyscale, 100);

            @media (min-width: $break-mobile) {
                border-color: color(greyscale, 600);
                background-color: color(greyscale, 600);
                color: color(greyscale, 100);
            }

            .icon {
                width: 20px;
                opacity: 1;
            }

            span {
               width: 0;
               opacity: 0;
            }
        }
        &.disabled + label {
            border-color: color(greyscale, 500);

            .icon, p {
                opacity: .7;
            }
            p, span {
                opacity: .4;
            }
        }
        &:checked.disabled + label {
            background-color: color(greyscale, 500);
            border-color: color(greyscale, 500);

            .icon, p {
                opacity: .7;
            }
            p {
                opacity: .4;
            }
            span {
                opacity: 0;
            }
        }
    }
</style>