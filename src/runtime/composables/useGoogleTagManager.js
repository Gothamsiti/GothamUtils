import { useRuntimeConfig, useHead } from '#imports'

/**
 * Snippet ufficiale del container GTM (id `GTM-XXXXXXX`): inizializza il
 * dataLayer con l'evento `gtm.js` (da cui dipendono i trigger Initialization /
 * Container Loaded) e aggiunge l'iframe di fallback noscript.
 */
const gtmContainerTags = trackingId => ({
  script: [
    {
      innerHTML: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${trackingId}');
      `,
      type: 'text/javascript',
    },
  ],
  noscript: [
    {
      innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${trackingId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
      tagPosition: 'bodyOpen',
    },
  ],
})

/**
 * Snippet gtag.js, per le property misurate direttamente (`G-`, `AW-`, `UA-`).
 */
const gtagTags = trackingId => ({
  script: [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${trackingId}`,
      type: 'text/javascript',
      async: true,
      body: true,
    },
    {
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}');
      `,
      type: 'text/javascript',
    },
  ],
})

export const useGoogleTagManager = () => {
  if (import.meta.server) {
    const config = useRuntimeConfig()
    const { analytics } = config.gothamutils
    if (analytics) {
      const { trackingId } = analytics
      if (trackingId) {
        const isContainer = /^GTM-/i.test(trackingId)
        useHead(isContainer ? gtmContainerTags(trackingId) : gtagTags(trackingId))
      }
    }
  }
}
