import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const listeners = new Set<() => void>()

function read(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f7f4ec' : '#151719')
  try {
    localStorage.setItem('portfolio-theme', theme)
  } catch {
    // The page can still change theme when storage is unavailable.
  }
  for (const listener of listeners) listener()
}

/** Shared theme state, so every toggle instance (header and mobile menu) stays in sync. */
export function useTheme() {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
    read,
    () => 'dark' as const,
  )
}
