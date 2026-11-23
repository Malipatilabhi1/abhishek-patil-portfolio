import { siNodedotjs, siReact, siThreedotjs, siTypescript, siVite } from 'simple-icons'
import { BrandIcon, PlaybackIcon } from '../icons'

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
export function TechMarquee({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  const action = paused ? 'Resume looping Home animations' : 'Pause looping Home animations'

  return (
    <div className="marquee-controls">
      <div className="marquee">
        <div className="marquee-track">
          <Items />
          <Items duplicate />
        </div>
      </div>
      <button type="button" className="icon-button marquee-toggle" aria-controls="home-hero"
        aria-label={action} title={action} onClick={onToggle}
      >
        <PlaybackIcon paused={paused} />
      </button>
    </div>
  )
}
