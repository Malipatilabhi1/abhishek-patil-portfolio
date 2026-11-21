import { useState } from 'react'
import { siNodedotjs, siReact, siThreedotjs, siTypescript, siVite } from 'simple-icons'
import { BrandIcon, PlaybackIcon } from '../icons'

const PAUSE_KEY = 'portfolio-marquee-paused'

const stack = [
  { name: 'React', icon: siReact },
  { name: 'TypeScript', icon: siTypescript },
  { name: 'Vite', icon: siVite },
  { name: 'Node.js', icon: siNodedotjs },
  { name: 'Three.js', icon: siThreedotjs },
] as const

function Items({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className="marquee-group" aria-label={duplicate ? undefined : 'Tech stack'} aria-hidden={duplicate || undefined}>
      {stack.map(({ name, icon }) => (
        <li key={name} className="tech-chip">
          <BrandIcon icon={icon} />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  )
}

/** Infinite CSS marquee; collapses to a static wrapped list under reduced motion. */
export function TechMarquee() {
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem(PAUSE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const action = paused ? 'Resume technology marquee' : 'Pause technology marquee'

  function togglePause() {
    const next = !paused
    setPaused(next)
    try {
      localStorage.setItem(PAUSE_KEY, String(next))
    } catch {
      // The control still works when storage is unavailable.
    }
  }

  return (
    <div className="marquee-controls">
      <div className="marquee" data-paused={paused}>
        <div className="marquee-track" id="technology-marquee">
          <Items />
          <Items duplicate />
        </div>
      </div>
      <button type="button" className="icon-button marquee-toggle" aria-controls="technology-marquee"
        aria-label={action} title={action} onClick={togglePause}
      >
        <PlaybackIcon paused={paused} />
      </button>
    </div>
  )
}
