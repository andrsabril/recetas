<template>
    <NuxtLink
        class="card-container"
        :class="[{'list-display': !visualizationMode}, colorCard]"
        :to="recipeImage"
    >   <Transition name="fade">
            <div
                class="card-image"
                :style="{backgroundImage:  visualizationMode ? `url('${imageSrc}')` : ''}"
            >
            </div>
        </Transition>
        
        <div class="text-container">
            <div class="card-info">
                <Transition name="fade">
                    <h3>{{ title }}</h3>
                </Transition>
                <Transition name="fade-in">
                    <div class="cook-time" v-if="visualizationMode">
                        <p>{{ totalTimeConversion }} min</p>
                    </div>
                </Transition>
            </div>
            <Transition name="fade-in">
                <div class="card-description" v-if="description && !visualizationMode">
                    <p>{{ description }}</p>
                </div>
            </Transition>
        </div>
        <Transition name="go-top">
            <div class="card-data" v-if="!visualizationMode">
                <div class="item-data">
                    <Icon name="clock" :color="colorCard" size="m" />
                    <p>{{ totalTimeConversion }}</p>
                </div>
                <div class="item-data">
                    <Icon name="person" :color="colorCard" size="m" />
                    <p>{{ perPerson.min }} a {{ perPerson.max }}</p>
                </div>
                <div class="item-data">
                    <Icon name="ingredients" :color="colorCard" size="m" />
                    <p>{{ ingredientsLength }}</p>
                </div>
        </div>
        </Transition>
    </NuxtLink> 

</template>
<script setup>
    const { formatToLink } = useFormatter();

    const props = defineProps ({
        visualizationMode: {
            type: Boolean,
            default: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: [ String, Boolean ],
            
        },
        totalTime: {
            type: Number,
            required: true,
        },
        perPerson: {
            type: [ Object, Boolean],
        },
        ingredientsLength: {
            type: Number,
        },
    });

    const recipeImage = computed(() => {
        return formatToLink(props.title);
    });
    const imageSrc = computed(() => `/images/${recipeImage.value}/cover.jpg`);
    const totalTimeConversion = computed(() => {
        return props.totalTime < 121 ? props.totalTime : '+120';
    });
    
    const colorCard = computed(() => {
        if (totalTimeConversion.value <= 60) {
            return 'black'
        }
        else if(totalTimeConversion.value > 60 && totalTimeConversion.value <= 100) {
            return 'tip'
        }
        else if(totalTimeConversion.value > 100) {
            return 'link'
        }
    });

</script>
<style lang="scss" scoped>
    .card-container {
        position: relative;
        width: 100%;
        aspect-ratio: 3/2;
        display: block;
        border-radius: $radii-m;
        color: color(greyscale, 100);
        overflow: hidden;

        @include transition-default(.3s, background-color);

        .card-image {
            width: 100%;
            height: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            transform: scale(1);

            @include transition-default(.4s);

            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    transform: scale(1.2);
                }
            }
        }
        .text-container {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;

            .card-info {
                width: 100%;
                height: auto;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-end;
                gap: 20px;
                padding: 40px $page-margin 16px $page-margin;
                background: linear-gradient(0, #000 3.66%, rgba(0, 0, 0, 0.00) 96.12%);

                h3 {
                    font-size: fontSize(body, xl);
                    font-weight: $font-weight-medium;
                    line-height: $font-line-height-m;
                }
                .cook-time {
                    background-color: rgba(255,255,255,.2);
                    border-radius: $radii-m;
                    padding: 5px 10px 4px 10px;
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
                    margin-bottom: 2px;

                    p {
                        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
                        font-size: fontSize(body, s);
                        white-space: nowrap;
                    }
                }
            }
        }

        // List Display
        &.list-display {
            aspect-ratio: inherit;
            height: 100%;
            background-color: color(greyscale, 200);
            padding: 16px $page-margin;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            gap: 8px;

            &.black {
                background-color: color(greyscale, 200);
                color: color(greyscale, 600);
            }
            &.tip {
                background-color: color(tip, 300);
                color: color(tip, 500);
            }
            &.link {
                background-color: color(link, 300);
                color: color(link, 500);
            }


            @media (hover: hover) and (pointer: fine) {
                &.black:hover {
                    background-color: color(greyscale, 300);
                }
                &.tip:hover {
                    background-color: color(tip, 400);
                }
                &.link:hover {
                    background-color: color(link, 400);
                 }
            }

            .card-image {
                position: absolute;
                top: 0;
                left: 0;
                transform: scale(1.2);
                opacity: 0;
            }
            
            .text-container {
                position: relative;
                bottom: inherit;
                left: inherit;
                padding-bottom: 20px;
                
                .card-info {
                    align-items: flex-start;
                    padding: 0;
                    color: color(greyscale, 600);
                    background: none;

                    h3 {
                        font-size: fontSize(body, xl);
                    }
                }
                .card-description p {
                    font-size: fontSize(body, s);
                    max-width: 520px;
                    line-height: $font-line-height-m;
                }
            }

            .card-data {
                display: flex;
                flex-direction: row;
                gap: 22px;

                .item-data {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    gap: 4px;
                }
            }
        }
    }
</style>