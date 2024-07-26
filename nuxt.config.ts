// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader';
export default defineNuxtConfig({
  app: {
    baseURL: process.env.BASE_URL || '/'
  },
  runtimeConfig: {
    public: {
      host: process.env.NUXT_HOST || 'localhost',
      port: process.env.NUXT_PORT ? String(process.env.NUXT_PORT) : '3000'
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
  plugins: [
    '~/plugins/loadRecipes.js',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/var/imports.scss" as *; '
        }
      }
    },
    plugins: [
      svgLoader()
    ],
  },
  css: ['~/assets/styles/main.scss'],
})
