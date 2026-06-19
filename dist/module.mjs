import { defineNuxtModule, createResolver, addPlugin, addRouteMiddleware, addImportsDir } from '@nuxt/kit';

const addPlugins = (resolver) => {
  addPlugin(resolver.resolve("./runtime/plugins/01.setupLanguages"));
  addPlugin(resolver.resolve("./runtime/plugins/02.utils"));
};
const addMiddlewares = (resolver) => {
  addRouteMiddleware({
    name: "language-redirect",
    path: resolver.resolve("./runtime/middleware/languageRedirect.global"),
    global: true
  });
};
const addComposables = (resolver) => {
  addImportsDir(resolver.resolve("runtime/composables"));
};
const module$1 = defineNuxtModule({
  meta: {
    name: "gothamutils",
    configKey: "gothamutils"
  },
  defaults: {
    multiLang: false,
    analytics: void 0,
    iubenda: void 0
  },
  setup(_options, _nuxt) {
    _nuxt.options.runtimeConfig.gothamutils = { ..._options };
    _nuxt.options.runtimeConfig.public.gothamutils = {
      ..._options,
      analytics: _options.analytics ? { trackingId: _options.analytics.trackingId } : void 0
    };
    const resolver = createResolver(import.meta.url);
    addPlugins(resolver);
    addMiddlewares(resolver);
    addComposables(resolver);
  }
});

export { module$1 as default };
