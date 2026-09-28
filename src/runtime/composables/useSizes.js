import { effectScope, useState, watch } from '#imports'

let referenceWatched = false

export const useSizes = () => {
  const gridCount = 80
  const reference = useState('reference', () => undefined)

  const mw = (size) => {
    if (size) return sizes.value.fr * size
    return 0
  }

  const mh = (size) => {
    if (size) return sizes.value.height / 100 * size
    return 0
  }

  const sizes = useState('sizes', () => ({ width: 0, height: 0, fr: 0 }))
  const scroll = useState('scroll', () => ({ top: 0, left: 0, direction: 0 }))

  const resizeListener = () => {
    reference.value = reference.value ?? window
    // se mi riferisco alla window devo recuperare la inner altrimenti recupero la client
    const width = (reference.value.clientWidth ?? reference.value.innerWidth)
    const height = (reference.value.clientHeight ?? reference.value.innerHeight)

    sizes.value.fr = width / gridCount
    sizes.value.width = width
    sizes.value.height = height
  }
  const scrollListener = () => {
    const top = reference.value.scrollY !== undefined ? reference.value.scrollY : reference.value.scrollTop
    const left = reference.value.scrollY !== undefined ? reference.value.scrollX : reference.value.scrollLeft
    scroll.value.direction = top > scroll.value.top ? 1 : -1
    scroll.value.top = top
    scroll.value.left = left
  }

  // un solo watcher per app: registrato a ogni chiamata ne creava uno per componente,
  // e a ogni cambio di reference resizeListener girava N volte. Lo scope staccato evita
  // che venga fermato all'unmount del primo componente che ha chiamato useSizes
  if (import.meta.client && !referenceWatched) {
    referenceWatched = true
    effectScope(true).run(() => {
      watch(reference, () => {
        resizeListener()
      })
    })
  }

  // scroll e resize arrivano anche più volte per frame: si aggiorna lo stato al massimo una volta per frame,
  // così chi dipende da `sizes` e `scroll` (header, watcher) non ricalcola a ogni evento
  const perFrame = (fn) => {
    let frame = 0
    return () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        fn()
      })
    }
  }

  const init = () => {
    if (import.meta.client) {
      resizeListener()
      window.addEventListener('resize', perFrame(resizeListener), { passive: true })
      window.addEventListener('scroll', perFrame(scrollListener), { passive: true })
    }
  }

  const observer = useState('observer', () => null)
  const observerFunctions = useState('observerFunctions', () => [])
  if (import.meta.client && !observer.value) {
    observer.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = entry.target.dataset.functionIndex
          const fn = observerFunctions.value[index]
          fn()
        }
      })
    }, { threshold: 0.1 })
  }
  const observe = (el, fn) => {
    observer.value.observe(el)
    observerFunctions.value.push(fn)
    el.dataset.functionIndex = observerFunctions.value.indexOf(fn)
  }

  return { reference, sizes, scroll, observe, mw, mh, init }
}
