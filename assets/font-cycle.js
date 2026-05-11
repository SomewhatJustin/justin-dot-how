;(function () {
  const presetCount = 11
  const storageKey = "justin-font-preset"
  const root = document.documentElement
  const indicator = document.createElement("div")

  indicator.className = "font-preset-indicator"
  indicator.setAttribute("aria-live", "polite")
  document.body.appendChild(indicator)

  const readPreset = () => {
    const stored = Number.parseInt(window.localStorage.getItem(storageKey), 10)
    return Number.isInteger(stored) && stored >= 0 && stored < presetCount ? stored : 0
  }

  const setPreset = (preset) => {
    const normalized = (preset + presetCount) % presetCount
    root.dataset.fontPreset = String(normalized)
    window.localStorage.setItem(storageKey, String(normalized))
    indicator.textContent = String(normalized + 1)
  }

  const isTypingTarget = (target) => {
    if (!(target instanceof HTMLElement)) {
      return false
    }

    return target.isContentEditable || ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)
  }

  setPreset(readPreset())

  window.addEventListener("keydown", (event) => {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      isTypingTarget(event.target)
    ) {
      return
    }

    if (event.key === "ArrowRight") {
      event.preventDefault()
      setPreset(readPreset() + 1)
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault()
      setPreset(readPreset() - 1)
    }
  })
})()
