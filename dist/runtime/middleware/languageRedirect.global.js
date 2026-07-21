import { defineNuxtRouteMiddleware, useLanguage, navigateTo, useRuntimeConfig, useRequestEvent } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  if (!config.public?.gothamutils?.multiLang) return
  const { defaultLanguage, languages } = useLanguage()

  if (to.fullPath.includes('/api')) return

  // Nuxt strips the `_payload.json` suffix from `to.fullPath` before this middleware
  // runs, so redirecting here would drop it from the target URL. Payload requests
  // are for an already-resolved route, so they never need a language redirect.
  if (import.meta.server) {
    const event = useRequestEvent()
    if (event?.path?.includes('_payload.')) return
  }

  const paths = to.fullPath.replace(/^\/+/, '').split('/')
  const sentToCorrectUrl = (lang) => {
    return navigateTo(`/${lang}${to.fullPath}`)
  }
  if (paths.length < 1 || paths[0].length != 2 || !languages.value.includes(paths[0])) {
    return sentToCorrectUrl(defaultLanguage.value)
  }
})
