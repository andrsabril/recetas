// plugins/vue3-carousel.js
import { defineNuxtPlugin } from '#app'
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Carousel', Carousel)
  nuxtApp.vueApp.component('Slide', Slide)
  nuxtApp.vueApp.component('Navigation', Navigation)
  nuxtApp.vueApp.component('Pagination', Pagination)
})