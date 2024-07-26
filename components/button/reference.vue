<template>
    <div class="btn-reference-wrap">
        <Icon
            name="cancel"
            color="white"
            size="m"
        />
        <div class="text-wrap">
            <p>
                <span
                    v-for="(ingredient,index) in ingredientsSelected"
                    :key="ingredient + index"    
                >
                    {{ ingredient }}
            </span>
            </p>
        </div>
        
    </div>
</template>
<script setup>
    const props = defineProps({
        ingredientsSelected: {
            type: Object,
            require: true,
        }
    });
</script>
<style scoped lang="scss">
    .btn-reference-wrap {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 6px;
        padding: 0 10px 0 8px;
        background-color: color(accent, 300);
        border-radius: 100px;

        @include transition-default(.2s);

        .text-wrap {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: nowrap;
            max-width: calc(100% - (20px + 6px + 20px));
            gap: 2px;
            color: color(greyscale, 100);

            p {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                span {
                    font-weight: $font-weight-regular;

                    &::after {
                        content: ',';
                        padding-right: 3px;
                    }
                    &:nth-last-child(2)::after {
                        content: 'y';
                        padding-right: 3px;
                        padding-left: 3px;
                    }
                    &:last-child::after {
                        content: '';
                    }
                }
            }
        }

        @media (hover: hover) and (pointer: fine) {
            cursor: pointer;
            &:hover {
                background-color: color(accent, 400);
            }   
        }
    }
</style>