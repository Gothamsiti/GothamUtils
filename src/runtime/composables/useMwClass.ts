import { registerMwResponsiveRule } from '../utils/mwResponsive'

const NUMBER = '\\d+(?:\\.\\d+)?|\\.\\d+'

const SIDE_RE = new RegExp(`^(padding|margin)-(top|right|bottom|left|[trblxy])-(${NUMBER})$`)

const BASE_RE = new RegExp(`^(padding|margin|width|height)-(${NUMBER})$`)

const ZINDEX_RE = new RegExp(`^z-index-(${NUMBER})$`)

const FLEX_RE = new RegExp(`^flex-(${NUMBER})$`)

const GAP_RE = new RegExp(`^gap-(${NUMBER})$`)

const MAX_WIDTH_RE = new RegExp(`^max-width-(${NUMBER})$`)

const RESPONSIVE_RE = new RegExp(`^(${NUMBER})-(.+)$`)

const SIDE_ALIASES: Record<string, string> = {
  top: 't',
  right: 'r',
  bottom: 'b',
  left: 'l',
}

const BORDER_NONE_RE = /^border-(top|right|bottom|left)-none$/

type ClassField
  = | string
    | string[]
    | undefined

type MaybeGetter
  = | ClassField
    | (() => ClassField)

type ParsedToken = {
  variable: string
  value: string
  className: string
  property: string
  type: 'mw' | 'px' | 'raw' | 'literal'
}

function getCssProperty(
  prop: string,
  dir?: string,
) {
  if (prop === 'padding') {
    if (dir === 'x') {
      return 'padding-inline'
    }

    if (dir === 'y') {
      return 'padding-block'
    }

    const cssDirections: Record<string, string> = {
      t: 'top',
      r: 'right',
      b: 'bottom',
      l: 'left',
    }

    return dir
      ? `padding-${cssDirections[dir] ?? dir}`
      : 'padding'
  }

  if (prop === 'margin') {
    if (dir === 'x') {
      return 'margin-inline'
    }

    if (dir === 'y') {
      return 'margin-block'
    }

    const cssDirections: Record<string, string> = {
      t: 'top',
      r: 'right',
      b: 'bottom',
      l: 'left',
    }

    return dir
      ? `margin-${cssDirections[dir] ?? dir}`
      : 'margin'
  }

  return prop
}

function parseToken(
  token: string,
): ParsedToken | undefined {
  const base = token.match(BASE_RE)

  if (base) {
    const [
      ,
      prop = '',
      value = '',
    ] = base

    return {
      variable: `--${prop[0]}`,
      value,
      className: `has-${prop}`,
      property: getCssProperty(prop),
      type: 'mw',
    }
  }

  const side = token.match(SIDE_RE)

  if (side) {
    const [
      ,
      prop = '',
      rawDir = '',
      value = '',
    ] = side

    const dir
      = SIDE_ALIASES[rawDir] ?? rawDir

    return {
      variable: `--${prop[0]}-${dir}`,
      value,
      className: `has-${prop}-${dir}`,
      property: getCssProperty(prop, dir),
      type: 'mw',
    }
  }

  const zIndex = token.match(ZINDEX_RE)

  if (zIndex) {
    const [, value = ''] = zIndex

    return {
      variable: '--z-index',
      value,
      className: 'has-z-index',
      property: 'z-index',
      type: 'raw',
    }
  }

  const flex = token.match(FLEX_RE)

  if (flex) {
    const [, value = ''] = flex

    return {
      variable: '--flex',
      value,
      className: 'has-flex',
      property: 'flex',
      type: 'mw',
    }
  }

  const gap = token.match(GAP_RE)

  if (gap) {
    const [, value = ''] = gap

    return {
      variable: '--gap',
      value,
      className: 'has-gap',
      property: 'gap',
      type: 'mw',
    }
  }

  const maxWidth
    = token.match(MAX_WIDTH_RE)

  if (maxWidth) {
    const [, value = ''] = maxWidth

    return {
      variable: '--max-width',
      value,
      className: 'has-max-width',
      property: 'max-width',
      type: 'px',
    }
  }

  const borderNone = token.match(BORDER_NONE_RE)

  if (borderNone) {
    const [, direction = ''] = borderNone

    return {
      variable: '',
      value: 'none',
      className: `border-${direction}-none`,
      property: `border-${direction}`,
      type: 'literal',
    }
  }

  return undefined
}

function getResponsiveCss(
  parsed: ParsedToken,
  variable: string,
) {
  switch (parsed.type) {
    case 'mw':
      if (parsed.property === 'flex') {
        return [
          '',
          '\tflex: 0 0 calc(',
          `\t\tvar(--vw, 1vw) * 100 / 80 * var(${variable})`,
          '\t) !important;',
          '',
        ].join('\n')
      }

      return [
        '',
        `\t${parsed.property}: calc(`,
        `\t\tvar(--vw, 1vw) * 100 / 80 * var(${variable})`,
        '\t) !important;',
        '',
      ].join('\n')

    case 'px':
      return [
        '',
        `\t${parsed.property}: calc(`,
        `\t\tvar(${variable}) * 1px`,
        '\t) !important;',
        '',
      ].join('\n')

    case 'raw':
      return `\n\t${parsed.property}: var(${variable}) !important;\n`

    case 'literal':
      return `\n\t${parsed.property}: ${parsed.value} !important;\n`
  }
}

export function useMwClass(
  source: MaybeGetter,
) {
  const classField
    = typeof source === 'function'
      ? source()
      : source

  const tokens = (
    Array.isArray(classField)
      ? classField.join(' ')
      : (classField ?? '')
  )
    .split(/\s+/)
    .filter(Boolean)

  const style: Record<string, string> = {}
  const classes: string[] = []

  for (const token of tokens) {
    /*
     * Responsive
     *
     * 768-margin-left-1
     * 950-padding-x-10
     * 1200-width-50
     */
    const responsive
      = token.match(RESPONSIVE_RE)

    if (responsive) {
      const [
        ,
        breakpointRaw = '',
        responsiveToken = '',
      ] = responsive

      const breakpoint
        = Number(breakpointRaw)

      if (Number.isFinite(breakpoint)) {
        const parsed = parseToken(responsiveToken)

        if (parsed) {
          const responsiveVariable
            = `${parsed.variable}-${breakpoint}`

          const responsiveClass
            = `has-${breakpoint}-${parsed.className.replace(
              /^has-/,
              '',
            )}`

          if (parsed.variable) {
            style[responsiveVariable] = parsed.value
          }

          registerMwResponsiveRule({
            breakpoint,
            className: responsiveClass,
            css: getResponsiveCss(
              parsed,
              responsiveVariable,
            ),
          })

          classes.push(
            responsiveClass,
          )

          continue
        }
      }
    }

    const parsed
      = parseToken(token)

    if (parsed) {
      style[parsed.variable]
        = parsed.value

      classes.push(
        parsed.className,
      )

      continue
    }

    classes.push(token)
  }

  return {
    classes,
    style,
  }
}
