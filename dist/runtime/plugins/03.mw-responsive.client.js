import { defineNuxtPlugin } from "#app";
import { initMwResponsive } from "../utils/mwResponsive.js";
export default defineNuxtPlugin(() => {
  initMwResponsive();
  function setViewportUnits() {
    document.documentElement.style.setProperty(
      "--vw",
      `${document.documentElement.clientWidth / 100}px`
    );
  }
  setViewportUnits();
  window.addEventListener("resize", setViewportUnits);
});
