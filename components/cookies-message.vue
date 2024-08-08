<template>
    <div class="pop-up-container">
        <div class="pop-up-wrap">
            <p>Esta página usa cookies para mejorar tu experiencia. No recogemos ningún dato personal del usuario.</p>
            <NuxtLink to="/cookies">
                <ButtonAction
                    text="Saber más"
                    :number="false"
                    color="inline"
                    :icon="false"
                    @click="closeCookiesMessage"
                />
            </NuxtLink>
            <ButtonAction
                text="Aceptar"
                :number="false"
                color="accent"
                :icon="false"
                @click="closeCookiesMessage"
            />
        </div>
    </div>
</template>
<script setup>
    const emit = defineEmits(['close-cookies-message']);
    const closeCookiesMessage = () => {
        emit('close-cookies-message', {});
    };
</script>
<style scoped lang="scss">
    p {
        color: color(greyscale, 200);
        font-size: fontSize(body, s);
        line-height: $font-line-height-m;
        padding: 10px;
    }
</style>