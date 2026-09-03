export type MwResponsiveRule = {
  breakpoint: number
  className: string
  css: string
}

const rules = new Map<string, MwResponsiveRule>()

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

function renderRules() {
  const style = getStyleElement()

  if (!style) {
    return
  }

  const sortedRules = [...rules.values()].sort(
    (a, b) => {
      if (a.breakpoint !== b.breakpoint) {
        return b.breakpoint - a.breakpoint
      }

      return a.className.localeCompare(
        b.className,
      )
    },
  )

  style.textContent = sortedRules
    .map(rule => [
      `@media screen and (max-width: ${rule.breakpoint}px) {`,
      `\t.${rule.className} {`,
      `\t\t${rule.css}`,
      `\t}`,
      `}`,
    ].join('\n')).join('\n')
}

export function registerMwResponsiveRule(
  rule: MwResponsiveRule,
) {
  const key
    = `${rule.breakpoint}:${rule.className}`

  if (rules.has(key)) {
    return
  }

  rules.set(key, rule)

  scheduleRender()
}

export function registerMwResponsiveRules(
  newRules: MwResponsiveRule[],
) {
  let changed = false

  for (const rule of newRules) {
    const key
      = `${rule.breakpoint}:${rule.className}`

    if (rules.has(key)) {
      continue
    }

    rules.set(key, rule)
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

  getStyleElement()
  renderRules()
}
