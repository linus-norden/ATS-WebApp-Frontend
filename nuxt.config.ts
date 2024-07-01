// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    "/api/**": { proxy: import.meta.env.API_URL },
  },
  css: ['@/assets/main.css'],
});
