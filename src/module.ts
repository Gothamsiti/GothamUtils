import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
  multiLang: boolean | undefined,
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
    multiLang: false
  },
  setup(_options, _nuxt) {
    _nuxt.options.runtimeConfig.gothamstoryblok = { ..._options }
    _nuxt.options.runtimeConfig.public.gothamstoryblok = { storyblok: { version: _options.storyblok?.version || 'draft' } }
    const resolver = createResolver(import.meta.url)
    addPlugins(resolver)
    addComposables(resolver)
  },
})
