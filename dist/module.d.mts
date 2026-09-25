import * as _nuxt_schema from '@nuxt/schema';

interface IubendaOptions {
    widgetId?: undefined | string;
}
interface AnalyticsOptions {
    trackingId?: string | undefined;
    apiSecret?: string | undefined;
}
interface ModuleOptions {
    multiLang?: boolean;
    analytics?: AnalyticsOptions | undefined;
    iubenda?: IubendaOptions | undefined;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

export { _default as default };
export type { ModuleOptions };
