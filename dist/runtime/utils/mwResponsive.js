import { useState } from "#imports";
export const MW_RESPONSIVE_STATE_KEY = "gothamutils:mw-responsive-rules";
const clientRules = /* @__PURE__ */ new Map();
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
let renderScheduled = false;
function scheduleRender() {
  if (renderScheduled || typeof window === "undefined") {
    return;
  }
  renderScheduled = true;
  queueMicrotask(() => {
    renderScheduled = false;
    renderRules();
  });
}
export function renderMwResponsiveRules(rules) {
  const sortedRules = [...rules].sort(
    (a, b) => {
      if (a.breakpoint !== b.breakpoint) {
        return b.breakpoint - a.breakpoint;
      }
      return a.className.localeCompare(
        b.className
      );
    }
  );
  return sortedRules.map((rule) => [
    `@media screen and (max-width: ${rule.breakpoint}px) {`,
    `	.${rule.className} {`,
    `		${rule.css}`,
    `	}`,
    `}`
  ].join("\n")).join("\n");
}
function renderRules() {
  const style = getStyleElement();
  if (!style) {
    return;
  }
  style.textContent = renderMwResponsiveRules(
    [...clientRules.values()]
  );
}
export function registerMwResponsiveRule(rule) {
  const key = `${rule.breakpoint}:${rule.className}`;
  if (import.meta.server) {
    const rules = useState(
      MW_RESPONSIVE_STATE_KEY,
      () => []
    );
    if (rules.value.some((existing) => `${existing.breakpoint}:${existing.className}` === key)) {
      return;
    }
    rules.value = [...rules.value, rule];
    return;
  }
  if (clientRules.has(key)) {
    return;
  }
  clientRules.set(key, rule);
  scheduleRender();
}
export function registerMwResponsiveRules(newRules) {
  if (import.meta.server) {
    newRules.forEach(registerMwResponsiveRule);
    return;
  }
  let changed = false;
  for (const rule of newRules) {
    const key = `${rule.breakpoint}:${rule.className}`;
    if (clientRules.has(key)) {
      continue;
    }
    clientRules.set(key, rule);
    changed = true;
  }
  if (changed) {
    scheduleRender();
  }
}
export function initMwResponsive() {
  if (typeof window === "undefined") {
    return;
  }
  getStyleElement();
  renderRules();
}
