<template>
    <div class="checkbox">
        <input type="checkbox"
            :name="data.name"
            :id="data.name"
        >
        <label :for="data.name">
            <div class="checkbox-icon">
                <Transition name="fade">
                    <Icon
                        :key="data.name"
                        name="check"
                        color="white"
                        size="s"
                    />
                </Transition>
            </div>
            <p>{{ data.name }}</p>
            <div class="text">
                <p class="bold">{{ data.quantity }}</p>
                <p class="medium">{{ data.unit }}</p>
            </div>
        </label>
    </div>
</template>
<script setup>
    const props = defineProps({
        data: {
            type: Object,
            require: true,
        }
    });
</script>
<style scoped lang="scss">
    .checkbox {
        width: fit-content;

        label {
            display: flex;
            flex-direction: row;
            align-items: center;
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

                & > div {
                    opacity: 0;
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
                        opacity: 1
                    }
                }
            }
        }
    }
    
</style>