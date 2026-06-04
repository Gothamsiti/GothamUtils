import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addRouteMiddleware } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'

interface IubendaOptions {
  widgetId?: undefined | string
}
interface AnalyticsOptions {
  trackingId?: string | undefined
  apiSecret?: string | undefined
}
export interface ModuleOptions {
  multiLang?: boolean
  analytics?: AnalyticsOptions | undefined
  iubenda?: IubendaOptions | undefined
}

const addPlugins = (resolver: Resolver) => {
  addPlugin(resolver.resolve('./runtime/plugins/01.setupLanguages'))
  addPlugin(resolver.resolve('./runtime/plugins/02.utils'))
}

const addMiddlewares = (resolver: Resolver) => {
  addRouteMiddleware({
    name: 'language-redirect',
    path: resolver.resolve('./runtime/middleware/languageRedirect.global'),
    global: true,
  })
}

const addComposables = (resolver: Resolver) => {
  addImportsDir(resolver.resolve('runtime/composables'))
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'gothamutils',
    configKey: 'gothamutils',
  },
  defaults: {
    multiLang: false,
    analytics: undefined,
    iubenda: undefined,
  },
  setup(_options: ModuleOptions, _nuxt) {
    _nuxt.options.runtimeConfig.gothamutils = { ..._options }
    _nuxt.options.runtimeConfig.public.gothamutils = {
      ..._options,
      analytics: _options.analytics ? { trackingId: _options.analytics.trackingId } : undefined,
    }

    const resolver = createResolver(import.meta.url)
    addPlugins(resolver)
    addMiddlewares(resolver)
    addComposables(resolver)
  },
})
