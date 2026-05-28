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
    multiLang: false // opzionale
  }
})
```

## Opzioni

### `multiLang`
- **Tipo:** `boolean`
- **Default:** `false`
- **Descrizione:** Abilita il supporto per i siti multilingue. Quando attivato, il middleware di reindirizzamento del linguaggio e i composables di gestione della lingua vengono configurati per gestire più lingue.

## Composables Inclusi

### `useLanguage()`
Gestisce lo stato delle lingue dell'applicazione.

```typescript
const { 
  languages,      // Array delle lingue disponibili
  currentLanguage, // Lingua attualmente attiva
  defaultLanguage, // Lingua predefinita
  slugList         // Array degli slug multilingue
} = useLanguage()
```

### `useSeo(story)`
Gestisce i metadati SEO basati su contenuti Storyblok.

```typescript
const { 
  richText  // Funzione per renderizzare testo ricco
} = useSeo(story)
```

**Parametri:**
- `story`: Oggetto contenente i dati della storia Storyblok

### `useGoogleTagManager()`
Configura Google Tag Manager automaticamente dal runtime config. Richiede la configurazione di `gothamstoryblok.analytics.trackingId`.

```typescript
const {} = useGoogleTagManager()
```

### `useIubenda()`
Integra il widget Iubenda per la gestione dei cookie. Richiede la configurazione di `gothamstoryblok.iubenda.widgetId`.

```typescript
const { iubendaInit } = useIubenda()

// Inizializza Iubenda manualmente se necessario
iubendaInit()
```

### `useSizes()`
Monitorizza le dimensioni della finestra e fornisce utilità di calcolo relative.

```typescript
const {
  sizes,       // Stato reattivo: { width, height, fr }
  scroll,      // Stato reattivo: { top, left }
  mw(size),    // Calcola larghezza in base a unità griglia
  mh(size),    // Calcola altezza in percentuale
  reference,   // Riferimento all'elemento da monitorare (default: window)
  resizeListener,  // Listener per resize
  scrollListener   // Listener per scroll
} = useSizes()
```

## Middleware

### `language-redirect` (globale)
Middleware automatico che gestisce il reindirizzamento basato sulla lingua. Viene registrato globalmente quando il modulo viene caricato.

## Plugin

Il modulo carica automaticamente due plugin:
1. **setupLanguages** - Inizializza la configurazione multilingue
2. **utils** - Fornisce funzioni di utilità globali, inclusi helper per URL e parsing degli endpoint

## Uso in Componenti

```vue
<script setup>
// I composables sono auto-importati
const { languages, currentLanguage } = useLanguage()
const { iubendaInit } = useIubenda()
const { sizes } = useSizes()
</script>
```

## Dipendenze

- `@nuxt/kit`: ^4.2.2

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
