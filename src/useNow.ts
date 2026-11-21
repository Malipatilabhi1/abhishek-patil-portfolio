import { useEffect, useState } from 'react'
import { usePageVisibility } from './usePageVisibility'

/**
 * The current time, refreshed on each minute boundary. Stops entirely while the tab is
 * hidden and resyncs as soon as it is shown again.
 */
export function useNow() {
  const visible = usePageVisibility()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!visible) return
    let timer = 0
    function tick() {
      setNow(new Date())
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
    }
    // Deferred so returning to the tab resyncs without a synchronous setState in the effect.
    timer = window.setTimeout(tick, 0)
    return () => window.clearTimeout(timer)
  }, [visible])

  return now
}

export function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
}

/** The hour (0–23) in a given IANA time zone. */
export function hourIn(date: Date, timeZone: string) {
  const hour = new Intl.DateTimeFormat('en-GB', { timeZone, hour: 'numeric', hourCycle: 'h23' })
    .formatToParts(date)
    .find((part) => part.type === 'hour')?.value
  return Number(hour ?? 0)
}
