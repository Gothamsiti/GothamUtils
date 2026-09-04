import { registerMwResponsiveRule } from "../utils/mwResponsive.js";
const NUMBER = "\\d+(?:\\.\\d+)?|\\.\\d+";
const SIDE_RE = new RegExp(`^(padding|margin)-(top|right|bottom|left|[trblxy])-(${NUMBER})$`);
const BASE_RE = new RegExp(`^(padding|margin|width|height)-(${NUMBER})$`);
const ZINDEX_RE = new RegExp(`^z-index-(${NUMBER})$`);
const FLEX_RE = new RegExp(`^flex-(${NUMBER})$`);
const FLEX_DIRECTION_RE = /^flex-(row|column|row-reverse|column-reverse)$/;
const AUTO_RE = /^(flex|width|height)-auto$/;
const GAP_RE = new RegExp(`^gap-(${NUMBER})$`);
const MAX_WIDTH_RE = new RegExp(`^max-width-(${NUMBER})$`);
const FONT_SIZE_RE = new RegExp(`^font-size-(${NUMBER})$`);
const RESPONSIVE_RE = new RegExp(`^(${NUMBER})-(.+)$`);
const SIDE_ALIASES = {
  top: "t",
  right: "r",
  bottom: "b",
  left: "l"
};
const BORDER_NONE_RE = /^border-(top|right|bottom|left)-none$/;
function getCssProperty(prop, dir) {
  if (prop === "padding") {
    if (dir === "x") {
      return "padding-inline";
    }
    if (dir === "y") {
      return "padding-block";
    }
    const cssDirections = {
      t: "top",
      r: "right",
      b: "bottom",
      l: "left"
    };
    return dir ? `padding-${cssDirections[dir] ?? dir}` : "padding";
  }
  if (prop === "margin") {
    if (dir === "x") {
      return "margin-inline";
    }
    if (dir === "y") {
      return "margin-block";
    }
    const cssDirections = {
      t: "top",
      r: "right",
      b: "bottom",
      l: "left"
    };
    return dir ? `margin-${cssDirections[dir] ?? dir}` : "margin";
  }
  return prop;
}
function parseToken(token) {
  const base = token.match(BASE_RE);
  if (base) {
    const [
      ,
      prop = "",
      value = ""
    ] = base;
    return {
      variable: `--${prop[0]}`,
      value,
      className: `has-${prop}`,
      property: getCssProperty(prop),
      type: "mw"
    };
  }
  const side = token.match(SIDE_RE);
  if (side) {
    const [
      ,
      prop = "",
      rawDir = "",
      value = ""
    ] = side;
    const dir = SIDE_ALIASES[rawDir] ?? rawDir;
    return {
      variable: `--${prop[0]}-${dir}`,
      value,
      className: `has-${prop}-${dir}`,
      property: getCssProperty(prop, dir),
      type: "mw"
    };
  }
  const zIndex = token.match(ZINDEX_RE);
  if (zIndex) {
    const [, value = ""] = zIndex;
    return {
      variable: "--z-index",
      value,
      className: "has-z-index",
      property: "z-index",
      type: "raw"
    };
  }
  const flex = token.match(FLEX_RE);
  if (flex) {
    const [, value = ""] = flex;
    return {
      variable: "--flex",
      value,
      className: "has-flex",
      property: "flex",
      type: "mw"
    };
  }
  const flexDirection = token.match(FLEX_DIRECTION_RE);
  if (flexDirection) {
    const [, value = ""] = flexDirection;
    return {
      variable: "",
      value,
      className: `has-flex-${value}`,
      property: "flex-direction",
      type: "literal"
    };
  }
  const auto = token.match(AUTO_RE);
  if (auto) {
    const [, prop = ""] = auto;
    return {
      variable: "",
      value: prop === "flex" ? "0 0 auto" : "auto",
      className: `has-${prop}-auto`,
      property: prop,
      type: "literal"
    };
  }
  const gap = token.match(GAP_RE);
  if (gap) {
    const [, value = ""] = gap;
    return {
      variable: "--gap",
      value,
      className: "has-gap",
      property: "gap",
      type: "mw"
    };
  }
  const maxWidth = token.match(MAX_WIDTH_RE);
  if (maxWidth) {
    const [, value = ""] = maxWidth;
    return {
      variable: "--max-width",
      value,
      className: "has-max-width",
      property: "max-width",
      type: "px"
    };
  }
  const fontSize = token.match(FONT_SIZE_RE);
  if (fontSize) {
    const [, value = ""] = fontSize;
    return {
      variable: "--font-size",
      value,
      className: "has-font-size",
      property: "font-size",
      type: "px"
    };
  }
  const borderNone = token.match(BORDER_NONE_RE);
  if (borderNone) {
    const [, direction = ""] = borderNone;
    return {
      variable: "",
      value: "none",
      className: `border-${direction}-none`,
      property: `border-${direction}`,
      type: "literal"
    };
  }
  return void 0;
}
function getResponsiveCss(parsed, variable) {
  switch (parsed.type) {
    case "mw":
      if (parsed.property === "flex") {
        return [
          "",
          "	flex: 0 0 calc(",
          `		var(--vw, 1vw) * 100 / 80 * var(${variable})`,
          "	) !important;",
          ""
        ].join("\n");
      }
      return [
        "",
        `	${parsed.property}: calc(`,
        `		var(--vw, 1vw) * 100 / 80 * var(${variable})`,
        "	) !important;",
        ""
      ].join("\n");
    case "px":
      return [
        "",
        `	${parsed.property}: calc(`,
        `		var(${variable}) * 1px`,
        "	) !important;",
        ""
      ].join("\n");
    case "raw":
      return `
	${parsed.property}: var(${variable}) !important;
`;
    case "literal":
      return `
	${parsed.property}: ${parsed.value} !important;
`;
  }
}
export function useMwClass(source) {
  const classField = typeof source === "function" ? source() : source;
  const tokens = (Array.isArray(classField) ? classField.join(" ") : classField ?? "").split(/\s+/).filter(Boolean);
  const style = {};
  const classes = [];
  for (const token of tokens) {
    const responsive = token.match(RESPONSIVE_RE);
    if (responsive) {
      const [
        ,
        breakpointRaw = "",
        responsiveToken = ""
      ] = responsive;
      const breakpoint = Number(breakpointRaw);
      if (Number.isFinite(breakpoint)) {
        const parsed2 = parseToken(responsiveToken);
        if (parsed2) {
          const responsiveVariable = `${parsed2.variable}-${breakpoint}`;
          const responsiveClass = `has-${breakpoint}-${parsed2.className.replace(
            /^has-/,
            ""
          )}`;
          if (parsed2.variable) {
            style[responsiveVariable] = parsed2.value;
          }
          registerMwResponsiveRule({
            breakpoint,
            className: responsiveClass,
            css: getResponsiveCss(
              parsed2,
              responsiveVariable
            )
          });
          classes.push(
            responsiveClass
          );
          continue;
        }
      }
    }
    const parsed = parseToken(token);
    if (parsed) {
      if (parsed.variable) {
        style[parsed.variable] = parsed.value;
      } else if (parsed.type === "literal") {
        style[parsed.property] = parsed.value;
      }
      classes.push(
        parsed.className
      );
      continue;
    }
    classes.push(token);
  }
  return {
    classes,
    style
  };
}
