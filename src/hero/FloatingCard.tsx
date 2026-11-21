import { useEffect, type ReactNode } from 'react'
import { motion, useSpring, useTransform, type MotionValue } from 'motion/react'

type FloatingCardProps = {
  children: ReactNode
  className?: string
  /** Parallax travel in px at the edge of the pointer range; negative values move against the cursor. */
  depth: number
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  /** Entrance delay in seconds. */
  delay?: number
  reduceMotion: boolean
  pageVisible: boolean
  decorative?: boolean
}

/** A glassmorphism card that drifts with the pointer to suggest depth. */
export function FloatingCard({ children, className, depth, pointerX, pointerY, delay = 0, reduceMotion, pageVisible, decorative = true }: FloatingCardProps) {
  const spring = { stiffness: 90, damping: 18, mass: 0.6 }
  const x = useSpring(useTransform(pointerX, (value) => value * depth), spring)
  const y = useSpring(useTransform(pointerY, (value) => value * depth), spring)
  const parallax = pageVisible && !reduceMotion

  useEffect(() => {
    if (parallax) return
    x.jump(0)
    y.jump(0)
  }, [parallax, x, y])

  return (
    <motion.div
      className={`floating-card ${className ?? ''}`}
      style={parallax ? { x, y } : undefined}
      aria-hidden={decorative || undefined}
      initial={reduceMotion || !pageVisible ? false : { opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="floating-card-bob">{children}</div>
    </motion.div>
  )
}
