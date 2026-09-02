const rules = /* @__PURE__ */ new Map();
let styleElement = null;
function getStyleElement() {
  if (typeof document === "undefined") {
    return null;
  }
  if (!styleElement) {
    styleElement = document.querySelector(
      "style[data-mw-responsive]"
    );
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.setAttribute(
        "data-mw-responsive",
        ""
      );
      document.head.appendChild(styleElement);
    }
  }
  return styleElement;
}
function renderRules() {
  const style = getStyleElement();
  if (!style) {
    return;
  }
  const sortedRules = [...rules.values()].sort(
    (a, b) => {
      if (a.breakpoint !== b.breakpoint) {
        return b.breakpoint - a.breakpoint;
      }
      return a.className.localeCompare(
        b.className
      );
    }
  );
  style.textContent = sortedRules.map((rule) => [
    `@media screen and (max-width: ${rule.breakpoint}px) {`,
    `	.${rule.className} {`,
    `		${rule.css}`,
    `	}`,
    `}`
  ].join("\n")).join("\n");
}
export function registerMwResponsiveRule(rule) {
  const key = `${rule.breakpoint}:${rule.className}`;
  if (rules.has(key)) {
    return;
  }
  rules.set(key, rule);
  if (typeof window !== "undefined") {
    renderRules();
  }
}
export function registerMwResponsiveRules(newRules) {
  let changed = false;
  for (const rule of newRules) {
    const key = `${rule.breakpoint}:${rule.className}`;
    if (rules.has(key)) {
      continue;
    }
    rules.set(key, rule);
    changed = true;
  }
  if (changed && typeof window !== "undefined") {
    renderRules();
  }
}
export function initMwResponsive() {
  if (typeof window === "undefined") {
    return;
  }
  getStyleElement();
  renderRules();
}
