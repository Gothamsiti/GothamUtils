function setViewportUnits() {
  document.documentElement.style.setProperty(
    '--vw',
    `${document.documentElement.clientWidth / 100}px`,
  )
}

export default defineNuxtPlugin(() => {
  setViewportUnits()
  window.addEventListener('resize', setViewportUnits)
})
