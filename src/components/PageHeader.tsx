import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { queries, useMediaQuery } from '../useMediaQuery'

type PageHeaderProps = {
  title: string
  eyebrow?: string
  intro?: string
  /** Optional content rendered under the intro (actions, meta, placeholders). */
  children?: ReactNode
  /** Heading id; Page-level landmarks can point at it with aria-labelledby. */
  id?: string
}

/**
 * The page's only H1. The heading is never hidden by animation so it paints
 * immediately (LCP); only the intro and extras fade up.
 */
export function PageHeader({ title, eyebrow, intro, children, id = 'page-heading' }: PageHeaderProps) {
  const reduceMotion = useMediaQuery(queries.reducedMotion)
  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false as const : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <header className="page-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 id={id} className="page-title">{title}</h1>
      {intro && <motion.p className="page-intro" {...fadeUp(0.08)}>{intro}</motion.p>}
      {children && <motion.div className="page-header-extra" {...fadeUp(0.16)}>{children}</motion.div>}
    </header>
  )
}
