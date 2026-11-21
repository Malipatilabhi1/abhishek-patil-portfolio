import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { queries, useMediaQuery } from '../useMediaQuery'

type RevealProps = {
  children: ReactNode
  /** Extra delay in seconds, e.g. `index * 0.08` to stagger a list. */
  delay?: number
  /** Distance in px the content rises while fading in. */
  offset?: number
  className?: string
}

/** Fades and slides its children up once, the first time they scroll into view. */
export function Reveal({ children, delay = 0, offset = 16, className }: RevealProps) {
  const reduceMotion = useMediaQuery(queries.reducedMotion)

  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
