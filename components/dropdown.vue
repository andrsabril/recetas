<template>
    <div class="drop-down">
        <div class="title">
            <h2>{{ title }}</h2>
            <Icon
                name="arrow-down"
                color="black"
                size="m"
                :class="{'active': isOpen}"
            />
        </div>
        <div class="hide-wrap" :style="{ height: isOpen ? `${slotRef.clientHeight }px` : '0px' }">
            <div class="slot" ref="slotRef">
                <div class="list" v-if="display === 'list'">
                    <Checkbox
                        v-for="(ingredient, index) in data"
                        :key="ingredient + index"
                        :data="ingredient"
                    />
                    <div
                        class="reset-list"
                    >
                        <Icon name="refresh" color="black" size="s" />
                        Limpiar
                    </div>
                </div>
                <div class="text" v-if="display === 'text'">
                    <div
                        class="step"
                         v-for="(step,index) in data"
                        :key="step.title + index"
                    >
                        <h3>{{ step.title }}</h3>
                        <div
                            class="description"
                            v-for="(description,index) in step.description"
                            :key="'description-' + step.title + index"
                        >   
                            <p v-if="description.sentence">{{ description.sentence }}</p>
                            <img v-if="description.image" :src="'/images/' + url + '/' + formatToLink(description.image) + '.jpg'" :alt="description.image"/>
                        </div>
                    </div>   
                </div>
            </div> 
        </div>
    </div>
</template>
<script setup>
    const { formatToLink } = useFormatter();

    const props = defineProps ({
        title: {
            type: [ String, Boolean ],
            required: true,
        },
        display: {
            type: String,
            default: 'text',
        },
        data: {
            type: [ Object, Boolean],
            require: true,
        },
        url: {
            type: String,
            require: true,
        },
        isOpen: {
            type: Boolean,
            default: false,
        }
    });

    const slotRef = ref();
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
            padding: 20px 0;
            border-top: solid 1px color(greyscale, 200);

            h2 {
                font-size: fontSize(title, m);
            }

            & > div {
                transform: rotate(90deg);

                &.active {
                    transform: rotate(0);
                }
            }
        }
        .hide-wrap {
            width: 100%;
            height: 0;
            overflow: hidden;

            @include transition-default(.4s);

            .slot {
                width: 100%;
                height: auto;
                padding: 10px 0 26px 0;

                .list {
                    width: 100%;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
            }
        }
    }
</style>