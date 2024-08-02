<template>
    <div class="drop-down">
        <div class="title" @click="$emit('toggle-dropdown')">
            <h2>{{ title }}</h2>
            <Icon
                name="arrow-down"
                color="black"
                size="m"
                :class="{'active': isOpen}"
            />
        </div>
        <div class="hide-wrap" :style="{ height: isOpen ? `${openDropdownHeight}px` : '0px' }">
            <div class="slot" ref="slotRef">
                <div class="list" v-if="display === 'list'">
                    <RecipeCheckbox
                        v-for="(ingredient, index) in data"
                        :key="ingredient + index"
                        :data="ingredient"
                        :actual-per-person="actualPerPerson"
                        :default-per-person="defaultPerPerson"
                        @is-checked="handleIsChecked"
                        :reset-signal="resetSignal"
                    />
                    <div class="buttons" v-if="checkedIngredients.length > 0">
                        <div class="add-list">
                            <Icon name="shop-list" color="black" size="m"/>
                            <p>Añadir (<span>{{checkedIngredients.length}}</span>)</p>
                        </div>
                        <div class="reset-list" @click="resetChecked">
                            <Icon name="refresh" color="black" size="m" />
                        </div>
                    </div>
                    <div class="reference-container">
                        <div
                            class="reference-item"
                            v-for="(reference, index) in hasReferenceData"
                            :key="reference + index"
                        >
                            <RecipeReference :data="reference" />
                        </div>
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
    const emit = defineEmits(['toggle-dropdown']);
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
            type: [ Object, Boolean ],
            require: true,
        },
        defaultPerPerson: {
            type: [ Number, Boolean ],
            default: false,
        },
        actualPerPerson: {
            type: [ Number, Boolean ],
            default: false,
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
    const checkedIngredients = ref([]);
    const openDropdownHeight = ref(0);
    const resetSignal = ref(0);

    const handleIsChecked = ({ ingredient, checked }) => {
        if (checked) {
            checkedIngredients.value.push(ingredient);
        } else {
            const index = checkedIngredients.value.findIndex(i => i.id === ingredient.id);
            if (index !== -1) {
                checkedIngredients.value.splice(index, 1);
            }
        }
    };

    // Filtrar elementos con referencia
    const hasReferenceData = computed(() => {
        return props.data.filter(reference => reference.hasReference);
    });

    // Reset de los elementos checked
    const resetChecked = () => {
        checkedIngredients.value.length = 0;
        resetSignal.value += 1;
    };

    // Altura
    const updateDropdownHeight = () => {
        nextTick(() => {
            const slotHeight = slotRef.value ? slotRef.value.clientHeight : 0;
            openDropdownHeight.value = slotHeight;
        });
    };

    // Actualizar la altura cuando se abra el dropdown
    watch(() => props.isOpen, (newValue) => {
        if (newValue) {
            updateDropdownHeight();
        }
    });

    // Actualizar la altura cuando cambie el número de ingredientes chequeados
    watch(checkedIngredients.value, () => {
        updateDropdownHeight();
    });

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
                    gap: 2px;

                    .buttons {
                        $gap: 10px;
                        $padding-side: 22px;

                        display: flex;
                        flex-direction: row;
                        gap: $gap;
                        margin-top: 20px;
                        margin-bottom: 20px;

                        @include transition-default(.2s);

                        .add-list, .reset-list {
                            width: fit-content;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            padding: 14px $padding-side;
                            border-radius: $radii-m;   
                        }

                        .reset-list {
                            width: auto;
                            background-color: color(greyscale, 200);
                            color: color(greyscale, 600);
                        }
                        .add-list {
                            width: calc(100% - ($icon-size-m + $gap + ($padding-side * 2)));
                            border: solid 1px color(greyscale, 600);
                            color: color(greyscale, 600);
                            //background-color: color(accent, 300);
                            

                            @include transition-default(.2s);

                            p span {
                                font-weight: $font-weight-medium;
                            }
                        }
                    }    
                    .reference-container {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        margin-top: 20px;
                    }
                }
            }
        }
    }
</style>