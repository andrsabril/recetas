<template>
    <div class="checkbox">
        <input type="checkbox"
            :name="data.name"
            :id="data.name"
            v-model="checked"
        >
        <label :for="data.name">
            <div class="checkbox-icon">
                <Icon
                    :key="data.name"
                    name="check"
                    color="white"
                    size="s"
                />
            </div>
            <p>{{ data.name }}</p>
            <div class="text">
                <p class="bold">{{ quantityPerPerson }}</p>
                <p class="medium">{{ data.unit }}</p>
            </div>
        </label>
    </div>
</template>
<script setup>
    const emit = defineEmits(['is-checked']);
    const props = defineProps({
        data: {
            type: Object,
            require: true,
        },
        defaultPerPerson: {
            type: Number,
            require: false,
        },
        actualPerPerson: {
            type: Number,
            require: false,
        },
        resetSignal: {
            type: Number,
            required: true,
        }
    });
    const checked = ref(false);

    const quantityPerPerson = computed(() => {
        const value = Math.round((props.actualPerPerson / props.defaultPerPerson) * props.data.quantity);
        return value;
    });

    watch(checked, (newValue) => {
        emit('is-checked', { ingredient: props.data, checked: newValue });
    });

    watch(() => props.resetSignal, () => {
        checked.value = false;
    });
</script>
<style scoped lang="scss">
    .checkbox {
        width: fit-content;

        label {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 10px 10px 10px 0;
            font-size: fontSize(body, m);
            gap: 10px;

            .checkbox-icon {
                width: 20px;
                height: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 8px;
                border: solid 1px color(greyscale, 600);

                @include transition-default(.2s);

                & > div {
                    opacity: 0;
                    transform: scale(0);
                }
            }

            .text {
                display: flex;
                flex-direction: row;
                align-items: baseline;
                gap: 4px;
            }

            p.medium {
                font-weight: $font-weight-medium;
            }
            p.bold {
                font-weight: $font-weight-bold;
            }
        }
        input {
            display: none;

            &:checked + label,
            &.active + label {
                .checkbox-icon {
                    background-color: color(accent, 300);
                    border-color: color(accent, 300);

                    & > div {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            }
        }
    }
    
</style>