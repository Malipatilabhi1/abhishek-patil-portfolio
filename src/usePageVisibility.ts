import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}

function isVisible() {
  return !document.hidden
}

export function usePageVisibility() {
  return useSyncExternalStore(subscribe, isVisible, () => true)
}
