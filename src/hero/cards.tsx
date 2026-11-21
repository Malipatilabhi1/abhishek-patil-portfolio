import { useEffect, useRef, useState } from 'react'
import { siReact, siThreedotjs, siTypescript, siVite } from 'simple-icons'
import { profile } from '../content'
import { BrandIcon } from '../icons'

type Token = { text: string; kind?: 'kw' | 'fn' | 'attr' | 'str' | 'punct' }

const string = (value: string): Token => ({ text: `"${value}"`, kind: 'str' })

/** `profile.ts` source, generated from content.ts so the card never drifts from the real data. */
const snippet: Token[] = [
  { text: 'export const ', kind: 'kw' },
  { text: 'abhishek', kind: 'fn' },
  { text: ' = {\n', kind: 'punct' },
  { text: '  role', kind: 'attr' },
  { text: ': ', kind: 'punct' },
  string(profile.role),
  { text: ',\n', kind: 'punct' },
  { text: '  stack', kind: 'attr' },
  { text: ': [', kind: 'punct' },
  ...profile.stack.flatMap(({ short }, index): Token[] => (
    index > 0 ? [{ text: ', ', kind: 'punct' }, string(short)] : [string(short)]
  )),
  { text: '],\n', kind: 'punct' },
  { text: '};', kind: 'punct' },
]

const source = snippet.map(({ text }) => text).join('')
const totalLength = source.length
const longestLine = Math.max(...source.split('\n').map((line) => line.length))
const tokenStarts = [0]
for (const { text } of snippet) tokenStarts.push((tokenStarts.at(-1) ?? 0) + text.length)

/** Mini editor that types `profile.ts` once, then rests with a blinking caret. */
export function ProfileCard({ reduceMotion, active }: { reduceMotion: boolean; active: boolean }) {
  const [progress, setTyped] = useState(0)
  const position = useRef(0)
  const typed = reduceMotion ? totalLength : progress

  useEffect(() => {
    if (reduceMotion || !active || position.current >= totalLength) return
    let timer = 0
    function typeNext() {
      if (document.hidden) return
      position.current += 1
      setTyped(position.current)
      if (position.current < totalLength) timer = window.setTimeout(typeNext, 22)
    }
    timer = window.setTimeout(typeNext, position.current === 0 ? 900 : 22)
    return () => window.clearTimeout(timer)
  }, [active, reduceMotion])

  return (
    <div className="code-card">
      <div className="card-chrome">
        <i /><i /><i />
        <span>profile.ts</span>
      </div>
      <pre style={{ inlineSize: `${longestLine + 1}ch` }}>
        <code>
          {snippet.map(({ text, kind }, index) => {
            const visible = text.slice(0, Math.max(0, typed - tokenStarts[index]))
            return visible && <span key={index} className={kind ? `tok-${kind}` : undefined}>{visible}</span>
          })}
          <span className="caret" />
        </code>
      </pre>
    </div>
  )
}

const tools = [
  { name: 'React', icon: siReact },
  { name: 'TypeScript', label: 'TS', icon: siTypescript },
  { name: 'Vite', icon: siVite },
  { name: 'Three.js', icon: siThreedotjs },
] as const

export function BuildCard() {
  return (
    <div className="build-card">
      <span className="build-title">Built with</span>
      <ul className="build-tools" aria-label="Portfolio technologies">
        {tools.map((tool) => (
          <li key={tool.name} className="build-tool">
            <span className="build-icon"><BrandIcon icon={tool.icon} /></span>
            <span className="build-label">
              {'label' in tool ? <><span aria-hidden="true">{tool.label}</span><span className="sr-only">{tool.name}</span></> : tool.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TechBadge() {
  return (
    <div className="tech-badge">
      <span className="tech-badge-dot" />
      <span>
        <strong>React 19 + R3F</strong>
        <small>TypeScript · Vite</small>
      </span>
    </div>
  )
}
