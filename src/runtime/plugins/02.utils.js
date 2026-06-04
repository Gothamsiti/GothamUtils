import { defineNuxtPlugin } from '#app'
import { useLanguage, useRoute, useRuntimeConfig, useStoryblokEditor } from '#imports'

export default defineNuxtPlugin({
  async setup() {
    return {
      provide: {
        __url: (u) => {
          if (!u) return undefined
          if (u == '#' || u.substring(0, 4) == 'http') return u
          const { languages, currentLanguage, slugList } = useLanguage()
          u = u.substring(0, 1) == '/' ? u : '/' + u
          if (languages.value.length < 2) return u
          u = u.replace(/([^:])\/\//g, '$1/')
          const founded = slugList.value.find(s => (u == s.fullslug || u == '/' + s.fullslug))
          if (founded?.slugs) {
            const sp = u.split('/')
            sp[sp.length - 1] = founded?.slugs[currentLanguage.value]
            u = sp.join('/')
          }
          const prefix = '/' + currentLanguage.value + '/'
          const startString = u.substring(0, 4)
          if (prefix != startString) u = prefix + u
          u = u.replace(/([^:])\/\//g, '$1/')
          return u
        },
        __filename: (str) => {
          return str.replace(/^.*[\\/]/, '')
        },
        __formatDate: d => (new Date(d)).toLocaleDateString('IT-it', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        __clearCache: async (query) => {
          const { sbEditor } = useStoryblokEditor()
          if (sbEditor.value) {
            await $fetch('/api/storyblok/clearCache', { query })
          }
        },
      },
    }
  },
})
