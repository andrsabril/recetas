<template>
    <div id="page-layout">
      <Toast />
      <NavMenu class="nav" />
      <NuxtPage />
      <Transition name="go-top">
        <div class="btn-go-top" v-if="showGoTopButton">
          <ButtonIcon
            icon-name="arrow-up"
            color="black"
            @click="goTop"
          />
        </div>
      </Transition>
      <Transition name="go-top">
        <CookiesMessage
          v-if="showCookiesMessage"
          @close-cookies-message="closeCookiesMessage"
        />
      </Transition>
      
    </div>
</template>
<script setup>
  import Cookies from 'js-cookie';

  // Helper to convert cookie string to boolean
  const stringToBoolean = (str) => str === 'true';
  const showCookiesMessage = ref(null);
  const showGoTopButton = ref(false);

  // Cerrar mensaje de cookies
  const closeCookiesMessage = () => {
    showCookiesMessage.value = false;
    Cookies.set('cookies-message', showCookiesMessage.value.toString());
  };

  // Acción Botón go to top
  const goTop = () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  };

  const scrollActions = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;

    showGoTopButton.value = scrollPosition > viewportHeight * 0.6;
  };

  onMounted(() => {
    window.addEventListener('scroll', scrollActions);
    showCookiesMessage.value = stringToBoolean(Cookies.get('cookies-message') || 'true');
  });
  onUnmounted(() => {
    window.removeEventListener('scroll', scrollActions);
  });
</script>
<style scoped lang="scss">
  .btn-go-top {
      position: fixed;
      right: 16px;
      bottom: calc(16px + (16px / 2) + 50px);
      z-index: 1;

      @media (min-width: $break-mobile) {
          bottom: 16px;
      }
      @media (min-width: $break-width) {
          right: calc(((100% - (1200px - 40px)) / 2));
          transform: translateX(calc(100% + 20px));
      }
      @media (hover: hover) and (pointer: fine) and (min-width: $break-mobile) {
          cursor: pointer;
      }
  }
</style>
