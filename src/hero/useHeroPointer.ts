import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { useMotionValue, type MotionValue } from 'motion/react'

/** Shared pointer state read every frame by the 3D scene (no React re-renders). */
type PointerState = {
  /** -1 (left/top) to 1 (right/bottom), relative to the visual's centre. */
  x: number
  y: number
  engaged: boolean
}

export type HeroPointer = {
  state: RefObject<PointerState>
  x: MotionValue<number>
  y: MotionValue<number>
  subscribe: (listener: () => void) => () => void
}

const clamp = (value: number) => Math.max(-1, Math.min(1, value))

/**
 * Tracks the mouse across the whole hero section and normalises it around the
 * 3D visual's centre. Disabled for touch, coarse pointers and reduced motion.
 */
export function useHeroPointer(
  section: RefObject<HTMLElement | null>,
  visual: RefObject<HTMLElement | null>,
  enabled: boolean,
): HeroPointer {
  const state = useRef<PointerState>({ x: 0, y: 0, engaged: false })
  const listeners = useRef(new Set<() => void>())
  const subscribe = useCallback((listener: () => void) => {
    const subscribers = listeners.current
    subscribers.add(listener)
    return () => { subscribers.delete(listener) }
  }, [])
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const area = section.current
    if (!enabled || !area) return

    function move(event: PointerEvent) {
      const target = visual.current
      if (event.pointerType !== 'mouse' || !target || document.hidden) return
      const bounds = target.getBoundingClientRect()
      const nx = clamp((event.clientX - (bounds.left + bounds.width / 2)) / (window.innerWidth / 2))
      const ny = clamp((event.clientY - (bounds.top + bounds.height / 2)) / (window.innerHeight / 2))
      state.current.x = nx
      state.current.y = ny
      state.current.engaged = true
      x.set(nx)
      y.set(ny)
      for (const listener of listeners.current) listener()
    }

    function leave() {
      const changed = state.current.engaged
      state.current.engaged = false
      if (document.hidden) {
        x.jump(0)
        y.jump(0)
      } else {
        x.set(0)
        y.set(0)
      }
      if (changed) for (const listener of listeners.current) listener()
    }

    area.addEventListener('pointermove', move, { passive: true })
    area.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', leave)
    return () => {
      area.removeEventListener('pointermove', move)
      area.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', leave)
      leave()
    }
  }, [enabled, section, visual, x, y])

  return { state, x, y, subscribe }
}
