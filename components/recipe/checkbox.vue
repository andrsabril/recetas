<template>
    <div class="checkbox">
        <input type="checkbox"
            :name="id"
            :id="id"
            v-model="checked"
        >
        <label :for="id" :class="{'shop-list' : !defaultPerPerson && !actualPerPerson}">
            <div class="checkbox-icon">
                <Icon
                    :key="id"
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
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        defaultPerPerson: {
            type: Number,
            required: false,
        },
        actualPerPerson: {
            type: Number,
            required: false,
        },
        resetSignal: {
            type: Number,
            required: false,
        },
        checked: {
            type: Boolean,
            required: false,
        }
    });
    const checked = ref(props.checked ? props.checked : false);

    const quantityPerPerson = computed(() => {
        if(props.actualPerPerson && props.defaultPerPerson) {
            const value = Math.round((props.actualPerPerson / props.defaultPerPerson) * props.data.quantity);
            return value;
        }
        else {
            return props.data.quantity;
        }
        
    });

    watch(checked, (newValue) => {
        emit('is-checked', { ingredient: props.data, quantity: quantityPerPerson.value, id: props.id, checked: newValue });
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

            &.shop-list {
                p {
                    position: relative;

                    &::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%);
                        width: 0;
                        height: 1px;
                        background-color: color(greyscale, 600);

                        @include transition-default(.2s);
                    }
                }
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

                &.shop-list {
                    p::before {
                        width: 100%;
                    }
                }
            }
        }
    }
    
</style>