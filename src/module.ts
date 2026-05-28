import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'

export interface ModuleOptions {
  multiLang?: boolean
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
    name: 'gothamutils',
    configKey: 'gothamutils',
  },
  defaults: {
    multiLang: false
  },
  setup(_options, _nuxt) {
    _nuxt.options.runtimeConfig.gothamutils = { ..._options }
    _nuxt.options.runtimeConfig.public.gothamutils = { ..._options }

    const resolver = createResolver(import.meta.url)
    addPlugins(resolver)
    addComposables(resolver)
  },
})
