<template>
    <NuxtLink class="card-container" :to="recipeImage">
        <div class="card-image" :style="{backgroundImage: `url('/images/${recipeImage}/cover.jpg')`}">
            <div class="card-info">
                <h3>{{ title }}</h3>
                <div class="cook-time">
                    <p>{{ cookingTime }} min</p>
                </div>
            </div>
        </div>
    </NuxtLink> 
</template>
<script setup>
    const { formatToLink } = useFormatter();

    const props = defineProps ({
        title: {
            type: String,
            required: true,
        },
        cookingTime: {
            type: Number,
            required: true,
        }
    });

    const recipeImage = computed(() => {
        return formatToLink(props.title);
    });
</script>
<style lang="scss" scoped>
    .card-container {
        position: relative;
        width: 100%;
        aspect-ratio: 3/2;
        border-radius: $radii-m;
        overflow: hidden;

        .card-image {
            width: 100%;
            height: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }

        .card-info {
            position: absolute;
            width: 100%;
            height: auto;
            bottom: 0;
            left: 0;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            gap: 20px;
            padding: 40px 20px 16px 20px;
            color: color(greyscale, 100);
            background: linear-gradient(0, #000 3.66%, rgba(0, 0, 0, 0.00) 96.12%);

            h3 {
                font-size: fontSize(body, l);
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
</style>