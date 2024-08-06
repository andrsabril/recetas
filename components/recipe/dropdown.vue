<template>
    <div class="drop-down">
        <div class="title" @click="$emit('toggle-dropdown')">
            <div class="title-border">
                <h2>{{ title }}</h2>
                <Icon
                    name="arrow-down"
                    color="black"
                    size="m"
                    :class="{'active': isOpen}"
                />
            </div>
        </div>
        <div class="hide-wrap" :style="{ height: isOpen ? `${openDropdownHeight}px` : '0px' }">
            <div class="slot" ref="slotRef">
                <div class="list" v-if="display === 'list'">
                    <RecipeCheckbox
                        v-for="(ingredient, index) in data"
                        :key="ingredient + index"
                        :id="generateUniqueId()"
                        :data="ingredient"
                        :actual-per-person="actualPerPerson"
                        :default-per-person="defaultPerPerson"
                        @is-checked="handleIsChecked"
                        :reset-signal="resetSignal"
                    />
                    <div class="buttons" v-if="checkedIngredients.length > 0">
                        <div class="add-list" @click="addToShopList">
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
                        <h3>{{ index + 1 }}. {{ step.title }}</h3>
                        <div
                            class="description"
                            v-for="(description,index) in step.description"
                            :key="'description-' + step.title + index"
                        >   
                            <div class="description-padding" :class="{ 'padding': !description.carousel }">
                                <p v-if="description.sentence">{{ description.sentence }}</p>
                                <img v-if="description.image" :src="'/images/' + url + '/' + formatToLink(description.image) + '.jpg'" :alt="description.image"/>
                                <CarouselImages v-if="description.carousel" :url="url" :data="description.carousel" />
                            </div>
                        </div>
                    </div>   
                </div>
            </div> 
        </div>
    </div>
</template>
<script setup>
    import Cookies from 'js-cookie';
    import { useShopListStore } from '@/stores/shop-list';
    const emit = defineEmits(['toggle-dropdown']);
    import { useToastStore } from '~/stores/toast';
    const toastStore = useToastStore();
    const { formatToLink } = useFormatter();

    function generateUniqueId() {
        return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    }

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

    // Checked unchecked
    const handleIsChecked = ({ ingredient, quantity, id, checked }) => {
        if (checked) {
            let ingredientData = {
                id: id,
                name: ingredient.name,
                quantity: quantity,
                unit: ingredient.unit
            };
            checkedIngredients.value.push(ingredientData);
        } else {
            const index = checkedIngredients.value.findIndex(i => i.id === ingredient.id);
            checkedIngredients.value.splice(index, 1);
        }
    };

    const shopListStore = useShopListStore();
    // Añadir a la lista de la compra
    const addToShopList = () => {

        // TODO
        // Ajustar la funcionalidad


        const existingList = getShopCookie();
        const updatedList = [...existingList];

        const checkedShopList = getShopCheckedCookie();

        checkedIngredients.value.forEach(newItem => {

            const existingItemIndex = updatedList.findIndex(item => item.name === newItem.name);
            const checkedItemIndex = checkedShopList.findIndex(item => item.name === newItem.name);

            const existingNames = new Set(existingList.map(item => item.name));
            const checkedNames = new Set(checkedShopList.map(item => item.name));

            const commonNames = [...existingNames].filter(name => checkedNames.has(name));

            if (existingItemIndex !== -1) {
                // Si el ingrediente ya existe (nombre), sumamos las cantidades
            
                    if (checkedItemIndex !== -1) {
                        // Si añadimos un ingrediente con el mismo nombre que esté checked en la lista de la compra
                        if(commonNames) {
                            updatedList[existingItemIndex].quantity += newItem.quantity;
                        }
                        else{
                            updatedList.push(newItem);
                        }
                    }
                    else {
                        updatedList[existingItemIndex].quantity += newItem.quantity;
                    }
 
            } else {
                // Si el ingrediente no existe (nombre), lo añadimos a la lista
                updatedList.push(newItem);
            }

            shopListStore.updateShopList(updatedList);
        });

        // Actualizar la lista de ingredientes en la lista
        const jsonStringShopList = JSON.stringify(updatedList);
        Cookies.set('shopList', jsonStringShopList, { expires: 7 });

        // Actualizar la lista de ingredientes seleccionados en las cookies
        const updatedCheckedShopListJsonString = JSON.stringify(checkedShopList);
        Cookies.set('shopCheckedList', updatedCheckedShopListJsonString, { expires: 7 });

        //console.log(getShopCookie());
        toastStore.addToast(
            'Has añadido ' + checkedIngredients.value.length + ' ingrediente/s a tu lista de la compra!',
            'tip',
            'shop-list',
            'lista-de-la-compra'
        );

        resetChecked();
    };

    function getShopCookie() {
        const jsonString = Cookies.get('shopList');
        return jsonString ? JSON.parse(jsonString) : [];
    }
    function getShopCheckedCookie() {
        const jsonString = Cookies.get('shopCheckedList');
        return jsonString ? JSON.parse(jsonString) : [];
    }
    // Reset de los elementos checked
    const resetChecked = () => {
        checkedIngredients.value.length = 0;
        resetSignal.value += 1;
    };

    // Filtrar elementos con referencia
    const hasReferenceData = computed(() => {
        return props.data.filter(reference => reference.hasReference);
    });

    // Función Altura
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
            padding: 0 $page-margin;

            .title-border {
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
                    padding: 0 $page-margin;

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
                .text {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;

                    .step {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        gap: 16px;

                        h3 {
                            font-size: fontSize(body, m);
                            font-weight: $font-weight-medium;
                            padding: 0 $page-margin;
                        }

                        .description .description-padding {
                            &.padding {
                                padding: 0 $page-margin;
                            }
                            img{
                                width: 100%;
                                height: auto;
                                border-radius: $radii-m;
                            }
                        }
                    }
                }
            }
        }
    }
</style>