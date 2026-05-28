import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'

// Module options TypeScript interface definition
interface IubendaOptions {
  widgetId: undefined | string
}
interface CloudFlareOptions {
  zoneID: string | undefined
  apiKey: string | undefined
}
interface AnalyticsOptions {
  trackingId: string | undefined
  apiSecret: string | undefined
}
interface CacheOptions {
  expire: number
}
interface StoryblokOptions {
  version: 'draft' | 'published' | undefined
  key?: string | undefined
}
export interface ModuleOptions {
  cache: CacheOptions
  storyblok: StoryblokOptions | undefined
  analytics: AnalyticsOptions | undefined
  cloudflare: CloudFlareOptions | undefined
  iubenda: IubendaOptions | undefined
}

const addPlugins = (resolver: Resolver) => {
  addPlugin(resolver.resolve('./runtime/plugins/01.setupLanguages'))
  addPlugin(resolver.resolve('./runtime/plugins/02.utils'))
}
const addComposables = (resolver: Resolver) => {
  addImportsDir(resolver.resolve('runtime/composables'))
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'gothamstoryblok',
    configKey: 'gothamstoryblok',
  },
  defaults: {
    cache: {
      expire: 1,
    },
    storyblok: {
      version: 'draft',
    },
  },
  setup(_options, _nuxt) {
    _nuxt.options.runtimeConfig.gothamstoryblok = { ..._options }
    _nuxt.options.runtimeConfig.public.gothamstoryblok = { storyblok: { version: _options.storyblok?.version || 'draft' } }
    const resolver = createResolver(import.meta.url)
    addPlugins(resolver)
    addComposables(resolver)
  },
})
