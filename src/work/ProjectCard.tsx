import type { PointerEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { Link } from 'react-router'
import type { Project } from '../content'
import { ArrowIcon } from '../icons'
import { queries, useMediaQuery } from '../useMediaQuery'
import { ProjectVisual } from './ProjectVisual'
import { TechChips } from './TechChips'
import { projectBadge, type TileSize, type WorkLocationState } from './workModel'

const MAX_TILT = 4

type ProjectCardProps = {
  project: Project
  size: TileSize
  /** Current ?query on /work, carried to the case study for its back link. */
  from: string
}

/**
 * One link per card (stretched over the whole tile), so keyboard users get a
 * single tab stop. Tilt + lift only for fine pointers without reduced motion.
 */
export function ProjectCard({ project, size, from }: ProjectCardProps) {
  const finePointer = useMediaQuery(queries.finePointer)
  const reduceMotion = useMediaQuery(queries.reducedMotion)
  const tilt = finePointer && !reduceMotion
  const spring = { stiffness: 220, damping: 22, mass: 0.5 }
  const rotateX = useSpring(useMotionValue(0), spring)
  const rotateY = useSpring(useMotionValue(0), spring)
  const lift = useSpring(useMotionValue(0), spring)
  const state: WorkLocationState = { from }

  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    rotateY.set(x * MAX_TILT * 2)
    rotateX.set(-y * MAX_TILT * 2)
    lift.set(-4)
  }

  function reset() {
    rotateX.set(0)
    rotateY.set(0)
    lift.set(0)
  }

  return (
    <motion.article
      className="project-card glass-card"
      data-size={size}
      style={tilt ? { rotateX, rotateY, y: lift, transformPerspective: 900 } : undefined}
      onPointerMove={tilt ? move : undefined}
      onPointerLeave={tilt ? reset : undefined}
    >
      <ProjectVisual project={project} />
      <p className="project-badge">{projectBadge(project)}</p>
      <div className="project-card-body">
        <p className="eyebrow">{project.subtitle}</p>
        <h2 className="project-card-title">
          <Link className="project-link" to={`/work/${project.slug}`} state={state}>
            {project.title}
            <ArrowIcon className="project-arrow" />
          </Link>
        </h2>
        <p className="project-card-summary">{project.summary}</p>
        <TechChips items={project.tech} limit={4} />
      </div>
    </motion.article>
  )
}
