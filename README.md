# GothamUtils

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Modulo Nuxt 4 che fornisce composables, middleware e plugin utili per semplificare lo sviluppo di applicazioni Nuxt. Contiene strumenti per la gestione multilingue, SEO, analytics e componenti reattivi.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- ⛰ &nbsp;Composables auto-importati per linguaggio, SEO, analytics e dimensioni
- 🚠 &nbsp;Middleware globale per il reindirizzamento della lingua
- 🌲 &nbsp;Supporto integrato per Google Tag Manager e Iubenda
- 📐 &nbsp;Monitoraggio reattivo delle dimensioni della finestra e dello scroll
- 🌐 &nbsp;Helper globali per URL, date e parsing di endpoint

## Installazione

```bash
npm install gothamutils
# oppure
pnpm add gothamutils
```

## Configurazione

Aggiungi il modulo al tuo `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['gothamutils'],
  gothamutils: {
    multiLang: false,  // abilita il supporto multilingue
    analytics: {       // opzionale: configurazione Google Tag Manager
      trackingId: 'GTM-XXXXXXX'
    },
    iubenda: {         // opzionale: configurazione Iubenda
      widgetId: 'your-widget-id'
    }
  }
})
```

## Opzioni

### `multiLang`
- **Tipo:** `boolean`
- **Default:** `false`
- **Descrizione:** Abilita il supporto per i siti multilingue. Quando attivato, il middleware di reindirizzamento del linguaggio e i composables di gestione della lingua vengono configurati per gestire più lingue.

### `analytics`
- **Tipo:** `AnalyticsOptions`
- **Default:** `undefined`
- **Descrizione:** Configurazione di Google Tag Manager. Se fornita, il composable `useGoogleTagManager()` inietta automaticamente gli script GTM.
- **Sottoproprietà:**
  - `trackingId`: ID di tracciamento GTM (es. `GTM-XXXXXXX`)
  - `apiSecret`: Secret API (opzionale)

### `iubenda`
- **Tipo:** `IubendaOptions`
- **Default:** `undefined`
- **Descrizione:** Configurazione di Iubenda. Se fornita, il composable `useIubenda()` inietta automaticamente il widget.
- **Sottoproprietà:**
  - `widgetId`: ID del widget Iubenda

## Composables Inclusi

### `useLanguage()`
Gestisce lo stato delle lingue dell'applicazione. Viene inizializzato automaticamente dal plugin setupLanguages.

```typescript
const { 
  languages,        // Array delle lingue disponibili
  currentLanguage,  // Lingua attualmente attiva (derivata dal primo parametro della route)
  defaultLanguage,  // Lingua predefinita dello spazio Storyblok
  slugList          // Array degli slug multilingue
} = useLanguage()
```

### `useSeo(story)`
Gestisce i metadati SEO basati su contenuti Storyblok.

```typescript
const { 
  richText  // Funzione per renderizzare testo ricco (@storyblok/js)
} = useSeo(story)
```

**Parametri:**
- `story`: Oggetto contenente i dati della storia Storyblok

### `useGoogleTagManager()`
Configura Google Tag Manager automaticamente dal runtime config. Eseguito solo server-side. Richiede la configurazione di `gothamutils.analytics.trackingId`.

```typescript
useGoogleTagManager()

// Nel nuxt.config.ts:
export default defineNuxtConfig({
  gothamutils: {
    analytics: {
      trackingId: 'GTM-XXXXXXX'
    }
  }
})
```

### `useIubenda()`
Integra il widget Iubenda per la gestione dei cookie. Lo script principale viene caricato server-side. Richiede la configurazione di `gothamutils.iubenda.widgetId`.

```typescript
const { iubendaInit } = useIubenda()

// Nel nuxt.config.ts:
export default defineNuxtConfig({
  gothamutils: {
    iubenda: {
      widgetId: 'your-widget-id'
    }
  }
})

// Inizializza Iubenda manualmente se necessario
iubendaInit()
```

### `useSizes()`
Monitorizza le dimensioni della finestra e dello scroll, fornendo utilità di calcolo. Richiede la chiamata di `init()` per attivare i listener.

```typescript
const {
  sizes,           // Stato reattivo: { width, height, fr }
  scroll,          // Stato reattivo: { top, left }
  mw(size),        // Calcola larghezza in base a unità griglia (80 fr per 100%)
  mh(size),        // Calcola altezza in percentuale
  reference,       // Riferimento all'elemento da monitorare (default: window)
  init,            // Inizializza i listener di resize e scroll
  resizeListener,  // Listener manuale per resize
  scrollListener,  // Listener manuale per scroll
  observe(el, fn), // Osserva un elemento con IntersectionObserver (threshold: 0.1)
} = useSizes()

onMounted(() => {
  useSizes().init()
})
```

## Middleware

### `language-redirect` (globale)
Middleware automatico che gestisce il reindirizzamento basato sulla lingua. Viene registrato globalmente quando il modulo viene caricato.

## Plugin

Il modulo carica automaticamente due plugin in ordine:

1. **setupLanguages** (01) - Inizializza la configurazione multilingue
   - Fetcha lo spazio Storyblok dal server per recuperare lingue disponibili e lingua predefinita
   - Imposta lo stato globale delle lingue
   - Eseguito solo server-side

2. **utils** (02) - Fornisce funzioni di utilità globali disponibili tramite `$__` nel template:
   - `$__url(url)` - Converte URL relative in URL multilingue con prefisso della lingua attuale
   - `$__filename(str)` - Estrae il nome del file da un percorso
   - `$__formatDate(date)` - Formatta una data nel formato italiano (gg/mm/yyyy)
   - `$__clearCache(query)` - Pulisce la cache di Storyblok

## Uso in Componenti

I composables sono auto-importati e disponibili in tutti i componenti:

```vue
<script setup>
// I composables sono auto-importati
const { languages, currentLanguage } = useLanguage()
const { iubendaInit } = useIubenda()
const { sizes, init } = useSizes()

// Inizializza useSizes
onMounted(() => {
  init()
})

// Usa le funzioni globali nel template
const internalUrl = $__url('/about')
const filename = $__filename('/path/to/file.pdf')
const formattedDate = $__formatDate(new Date())
</script>

<template>
  <div>
    <p>Lingua attuale: {{ currentLanguage }}</p>
    <a :href="internalUrl">About</a>
    <p>Larghezza: {{ sizes.width }}px</p>
  </div>
</template>
```

## Dipendenze

### Richieste
- `@nuxt/kit`: ^4.2.2

### Opzionali
- `gothamstoryblok`: Richiesto se usi `multiLang: true`, poiché `useLanguage()` fetcha i dati dello spazio Storyblok tramite `/api/storyblok/space`
- `@storyblok/js`: Utilizzato da `useSeo()` per il rendering del rich text

## Contribuire

<details>
  <summary>Sviluppo locale</summary>
  
  ```bash
  # Installa le dipendenze
  pnpm install
  
  # Genera type stubs
  pnpm run dev:prepare
  
  # Sviluppa con il playground
  pnpm run dev
  
  # Compila il playground
  pnpm run dev:build
  
  # Esegui ESLint
  pnpm run lint
  
  # Esegui Vitest
  pnpm run test
  pnpm run test:watch
  
  # Rilascia una nuova versione
  pnpm run release
  ```

</details>

## Licenza

MIT

## Supporto

Per bug report e feature request, visita il [repository](https://github.com/Gothamsiti/gothamutils).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/gothamutils/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/gothamutils

[npm-downloads-src]: https://img.shields.io/npm/dm/gothamutils.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/gothamutils

[license-src]: https://img.shields.io/npm/l/gothamutils.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/gothamutils

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
