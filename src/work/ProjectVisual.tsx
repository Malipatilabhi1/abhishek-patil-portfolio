import type { CSSProperties, ReactNode } from 'react'
import type { Project } from '../content'

/** FNV-1a: a stable number per slug, so each project gets its own look. */
function hash(text: string) {
  let value = 2166136261
  for (let index = 0; index < text.length; index++) {
    value ^= text.charCodeAt(index)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

function seeded(seed: number) {
  let state = seed || 1
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

/** Banking: message lanes with packets moving between two systems (MT ⇄ MX). */
function lanes(random: () => number) {
  return (
    <>
      <rect x="34" y="40" width="22" height="100" rx="6" className="pv-node" />
      <rect x="264" y="40" width="22" height="100" rx="6" className="pv-node" />
      {[0, 1, 2, 3].map((lane) => {
        const y = 56 + lane * 22
        const x = 78 + random() * 150
        return (
          <g key={lane}>
            <line x1="62" y1={y} x2="258" y2={y} className="pv-line" strokeDasharray="3 6" />
            <rect x={x} y={y - 5} width="26" height="10" rx="3" className={lane % 2 ? 'pv-dot' : 'pv-dot pv-strong'} />
          </g>
        )
      })}
    </>
  )
}

/** Enterprise: a small knowledge graph of connected nodes. */
function graph(random: () => number) {
  const nodes = Array.from({ length: 8 }, () => ({ x: 40 + random() * 240, y: 30 + random() * 120 }))
  return (
    <>
      {nodes.map((node, index) => {
        const target = nodes[(index + 1 + Math.floor(random() * 3)) % nodes.length] ?? node
        return <line key={`e${index}`} x1={node.x} y1={node.y} x2={target.x} y2={target.y} className="pv-line" />
      })}
      {nodes.map((node, index) => (
        <circle key={`n${index}`} cx={node.x} cy={node.y} r={index === 0 ? 7 : 4} className={index === 0 ? 'pv-dot pv-strong' : 'pv-dot'} />
      ))}
    </>
  )
}

/** Personal: orbit rings, echoing the hero's 3D scene. */
function orbits(random: () => number) {
  const tilt = -20 + random() * 40
  return (
    <g transform={`rotate(${tilt} 160 90)`}>
      {[110, 80, 52].map((rx, index) => (
        <ellipse key={rx} cx="160" cy="90" rx={rx} ry={rx * 0.38} className="pv-line" strokeDasharray={index === 1 ? '4 6' : undefined} />
      ))}
      <circle cx="270" cy="90" r="5" className="pv-dot pv-strong" />
      <circle cx="80" cy="90" r="4" className="pv-dot" />
    </g>
  )
}

const motifs: Record<Project['category'], (random: () => number) => ReactNode> = {
  Banking: lanes,
  Enterprise: graph,
  Personal: orbits,
}

type ProjectVisualProps = {
  project: Project
  size?: 'card' | 'large'
}

/**
 * Abstract, generated artwork for a project. Client work is confidential, so this
 * deliberately never imitates a screenshot: hue, angle and motif come from the slug
 * and category.
 */
export function ProjectVisual({ project, size = 'card' }: ProjectVisualProps) {
  const seed = hash(project.slug)
  const style: CSSProperties & Record<`--${string}`, string> = {
    '--pv-h': String(160 + (seed % 46)),
    '--pv-angle': `${seed % 360}deg`,
  }

  return (
    <div className={`project-visual project-visual-${size}`} style={style} aria-hidden="true">
      <div className="pv-grid" />
      <svg className="pv-motif" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        {motifs[project.category](seeded(seed))}
      </svg>
      <span className="pv-initial">{project.monogram ?? project.title.charAt(0)}</span>
    </div>
  )
}
