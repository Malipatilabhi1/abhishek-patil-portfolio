import { ClockIcon } from '../icons'
import { formatTime, useNow } from '../useNow'

type LocalTimeProps = {
  /** IANA zone, e.g. "Asia/Kolkata". */
  timeZone: string
  /** Short zone label shown after the time, e.g. "IST". */
  zoneLabel: string
  place: string
}

/**
 * Live local time (via useNow: minute ticks, paused in hidden tabs). Not a live region,
 * so screen readers are never interrupted by the minute changing.
 */
export function LocalTime({ timeZone, zoneLabel, place }: LocalTimeProps) {
  const now = useNow()

  return (
    <span className="portrait-chip">
      <ClockIcon />
      <span className="sr-only">Local time in {place}: </span>
      <time dateTime={now.toISOString()}>{formatTime(now, timeZone)}</time>
      <span>{zoneLabel}</span>
    </span>
  )
}
