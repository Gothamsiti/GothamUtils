import { defineNuxtRouteMiddleware, useLanguage, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const { defaultLanguage, languages } = useLanguage()

  const paths = to.fullPath.replace(/^\/+/, '').split('/')
  if (to.fullPath.includes('/api')) return
  const sentToCorrectUrl = (lang) => {
    return navigateTo(`/${lang}${to.fullPath}`)
  }
  if (paths.length < 1 || paths[0].length != 2 || !languages.value.includes(paths[0])) {
    return sentToCorrectUrl(defaultLanguage.value)
  }
})
