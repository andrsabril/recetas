<template>
    <Carousel ref="carousel" v-model="currentSlide">
        <Slide v-for="(slide, index) in data" :key="slide + index">
            <div class="carousel__item">
                <img :src="'/images/' + url + '/' + formatToLink(slide.image) + '.jpg'" :alt="slide.image"/>
            </div>
        </Slide>
    </Carousel>
    <div class="btns-wrap">
        <div class="btns">
            <div
                class="btn"
                v-for="(slide, index) in data"
                :key="index"
                :class="{ 'active': currentSlide === index }"
            >
            </div>
            <div
                class="btn-active"
                ref="btnSizeRef"
                :style="{left: (8*2) * currentSlide + 'px' }"
            ></div>
        </div>
    </div>
</template>

<script setup>
    const { formatToLink } = useFormatter();

    const props = defineProps({
        data: {
            type: Array,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    })

    const currentSlide = ref(0);
</script>
  
<style scoped lang="scss">
    .carousel__slide {
        padding: 0 $page-margin;
    }
    .carousel__item {
        width: 100%;
        height: auto;

        img {
            width: 100%;
            height: auto;
            border-radius: $radii-m;
            overflow: hidden;
        }
    }
    .btns-wrap {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding-top: 12px;

        .btns {
            position: relative;
            width: auto;
            height: auto;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 8px;

            .btn {
                width: 8px;
                height: 8px;
                border-radius: $radii-m;
                background-color: color(greyscale, 300);
            }
            .btn-active {
                position: absolute;
                left: 0;
                width: 8px;
                height: 8px;
                border-radius: $radii-m;
                background-color: color(greyscale, 600);

                @include transition-default(.2s);
            }
        }
    }
    
</style>
  