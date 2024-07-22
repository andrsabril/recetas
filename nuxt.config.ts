// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  plugins: [
    '~/plugins/loadRecipes.js'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/var/imports.scss" as *; '
        }
      }
    },
  },
  css: ['~/assets/styles/main.scss'],
})
