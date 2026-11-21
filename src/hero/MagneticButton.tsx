import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

type MagneticButtonProps = {
  children: ReactNode
  /** How far (0–1) the element follows the cursor offset. */
  strength?: number
  className?: string
  active: boolean
}

/**
 * Wraps a link or button and pulls it gently toward the cursor.
 * Inert on touch devices and when reduced motion is requested.
 */
export function MagneticButton({ children, strength = 0.28, className, active }: MagneticButtonProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const spring = { stiffness: 260, damping: 18, mass: 0.4 }
  const x = useSpring(useMotionValue(0), spring)
  const y = useSpring(useMotionValue(0), spring)

  useEffect(() => {
    if (active) return
    x.jump(0)
    y.jump(0)
  }, [active, x, y])

  return (
    <motion.div
      ref={wrapper}
      className={['magnetic', className].filter(Boolean).join(' ')}
      style={active ? { x, y } : undefined}
      onPointerMove={active ? (event) => {
        const bounds = wrapper.current?.getBoundingClientRect()
        if (!bounds || event.pointerType !== 'mouse') return
        x.set((event.clientX - bounds.left - bounds.width / 2) * strength)
        y.set((event.clientY - bounds.top - bounds.height / 2) * strength)
      } : undefined}
      onPointerLeave={active ? () => {
        x.set(0)
        y.set(0)
      } : undefined}
    >
      {children}
    </motion.div>
  )
}
