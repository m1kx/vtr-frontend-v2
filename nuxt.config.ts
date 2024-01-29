// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  devtools: { enabled: false },
  ssr: false,
  routeRules: {
    '*': { prerender: false, ssr: false },
    '/auth/*': { prerender: false, ssr: false }
  }
});
