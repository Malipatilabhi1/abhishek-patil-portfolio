import { about, profile } from '../content'
import { PinIcon } from '../icons'
import { LocalTime } from './LocalTime'

/** The photo when about.photo is set; otherwise a monogram card with location and live IST time. */
export function Portrait() {
  const photo = about.photo

  if (photo) {
    return (
      <img
        className="portrait-photo"
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <div className="glass-card portrait-card">
      <div className="visual-glow" aria-hidden="true" />
      <div className="visual-grid" aria-hidden="true" />
      <div className="portrait-orbit portrait-orbit-outer" aria-hidden="true" />
      <div className="portrait-orbit portrait-orbit-inner" aria-hidden="true" />
      <span className="portrait-monogram" aria-hidden="true">A</span>
      <div className="portrait-meta">
        <span className="portrait-chip">
          <PinIcon />
          {profile.location}
        </span>
        <LocalTime timeZone={profile.timeZone} zoneLabel="IST" place={profile.location} />
      </div>
    </div>
  )
}
