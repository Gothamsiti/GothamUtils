import { useState } from '#imports'

export type MwResponsiveRule = {
  breakpoint: number
  className: string
  css: string
}

export const MW_RESPONSIVE_STATE_KEY = 'gothamutils:mw-responsive-rules'

const clientRules = new Map<string, MwResponsiveRule>()

let styleElement: HTMLStyleElement | null = null

function getStyleElement() {
  if (typeof document === 'undefined') {
    return null
  }

  if (!styleElement) {
    styleElement = document.querySelector(
      'style[data-mw-responsive]',
    )

    if (!styleElement) {
      styleElement = document.createElement('style')

      styleElement.setAttribute(
        'data-mw-responsive',
        '',
      )

      document.head.appendChild(styleElement)
    }
  }

  return styleElement
}

let renderScheduled = false

function scheduleRender() {
  if (renderScheduled || typeof window === 'undefined') {
    return
  }

  renderScheduled = true

  queueMicrotask(() => {
    renderScheduled = false
    renderRules()
  })
}

export function renderMwResponsiveRules(
  rules: MwResponsiveRule[],
) {
  const sortedRules = [...rules].sort(
    (a, b) => {
      if (a.breakpoint !== b.breakpoint) {
        return b.breakpoint - a.breakpoint
      }

      return a.className.localeCompare(
        b.className,
      )
    },
  )

  return sortedRules
    .map(rule => [
      `@media screen and (max-width: ${rule.breakpoint}px) {`,
      `\t.${rule.className}.${rule.className} {`,
      `\t\t${rule.css}`,
      `\t}`,
      `}`,
    ].join('\n')).join('\n')
}

function renderRules() {
  const style = getStyleElement()

  if (!style) {
    return
  }

  style.textContent = renderMwResponsiveRules(
    [...clientRules.values()],
  )
}

export function registerMwResponsiveRule(
  rule: MwResponsiveRule,
) {
  const key
    = `${rule.breakpoint}:${rule.className}`

  if (import.meta.server) {
    const rules = useState<MwResponsiveRule[]>(
      MW_RESPONSIVE_STATE_KEY,
      () => [],
    )

    if (rules.value.some(existing => (
      `${existing.breakpoint}:${existing.className}` === key
    ))) {
      return
    }

    rules.value = [...rules.value, rule]

    return
  }

  if (clientRules.has(key)) {
    return
  }

  clientRules.set(key, rule)

  scheduleRender()
}

export function registerMwResponsiveRules(
  newRules: MwResponsiveRule[],
) {
  if (import.meta.server) {
    newRules.forEach(registerMwResponsiveRule)

    return
  }

  let changed = false

  for (const rule of newRules) {
    const key
      = `${rule.breakpoint}:${rule.className}`

    if (clientRules.has(key)) {
      continue
    }

    clientRules.set(key, rule)
    changed = true
  }

  if (changed) {
    scheduleRender()
  }
}

export function initMwResponsive() {
  if (typeof window === 'undefined') {
    return
  }

  const ssrRules = useState<MwResponsiveRule[]>(
    MW_RESPONSIVE_STATE_KEY,
    () => [],
  )

  for (const rule of ssrRules.value) {
    const key = `${rule.breakpoint}:${rule.className}`
    clientRules.set(key, rule)
  }

  getStyleElement()
  renderRules()
}
