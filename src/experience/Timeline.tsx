import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { Link } from 'react-router'
import { experience, formatPeriod, type Experience } from '../content'
import { Reveal } from '../components/Reveal'
import { TechChips } from '../work/TechChips'
import { projectsFor } from '../work/workModel'

type TimelineItemProps = {
  role: Experience
  reduceMotion: boolean
}

function TimelineItem({ role, reduceMotion }: TimelineItemProps) {
  const item = useRef<HTMLLIElement>(null)
  // 0 while the card's top is below the middle of the viewport, 1 once it has passed it.
  // useScroll measures on mount and emits 'change', so the initial state needs no effect.
  const { scrollYProgress } = useScroll({ target: item, offset: ['start 52%', 'start 48%'] })
  const [reached, setReached] = useState(false)
  const current = role.end === null
  const related = projectsFor(role.company)

  useMotionValueEvent(scrollYProgress, 'change', (progress) => setReached(progress > 0.5))

  const lit = reduceMotion || reached

  return (
    <li className="timeline-item" ref={item}>
      <span className="timeline-node" data-lit={lit} data-current={current} aria-hidden="true" />
      <Reveal>
        <article className="glass-card timeline-card">
          <p className="timeline-period">
            <span>{formatPeriod(role.start, role.end)}</span>
            {current && <span className="timeline-badge">Current</span>}
          </p>
          <h3 className="timeline-role">{role.role}</h3>
          <p className="timeline-company">
            <strong>{role.company}</strong>
            <span aria-hidden="true"> · </span>
            <span className="sr-only">, </span>
            {role.focus}
            <span aria-hidden="true"> · </span>
            <span className="sr-only">, </span>
            {role.location}
          </p>
          <ul className="timeline-highlights">
            {role.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
          <TechChips items={role.tech} label={`Tech used at ${role.company}`} />
          {related.length > 0 && (
            <p className="related-work">
              <span className="related-work-label">Related work:</span>{' '}
              {related.map((project, index) => (
                <span key={project.slug}>
                  {index > 0 && ', '}
                  <Link to={`/work/${project.slug}`}>{project.title}</Link>
                </span>
              ))}
            </p>
          )}
        </article>
      </Reveal>
    </li>
  )
}

/**
 * Roles, newest first. The accent line draws from top to bottom as the list
 * scrolls past the middle of the viewport; under reduced motion it is fully drawn.
 */
export function Timeline({ reduceMotion }: { reduceMotion: boolean }) {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: container, offset: ['start 50%', 'end 50%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  return (
    <div className="timeline" ref={container}>
      <div className="timeline-track" aria-hidden="true" />
      <motion.div className="timeline-fill" style={{ scaleY: reduceMotion ? 1 : progress }} aria-hidden="true" />
      <ol className="timeline-list">
        {experience.map((role) => <TimelineItem key={`${role.company}-${role.start}`} role={role} reduceMotion={reduceMotion} />)}
      </ol>
    </div>
  )
}
