import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'

type CountUpProps = {
  value: number
  suffix?: string
  reduceMotion: boolean
}

/**
 * Counts from 0 to `value` once, the first time it scrolls into view.
 * The animating digits are aria-hidden; screen readers get the final value
 * straight away, so nothing is announced mid-count. Static under reduced motion.
 */
export function CountUp({ value, suffix = '', reduceMotion }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView || reduceMotion) return
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setCurrent(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, value])

  const shown = reduceMotion ? value : current

  return (
    <span className="count-up" ref={ref}>
      {/* Reserve the final width so the count never shifts layout. */}
      <span aria-hidden="true" style={{ minInlineSize: `${String(value).length}ch` }} className="count-up-digits">
        {shown}{suffix}
      </span>
      <span className="sr-only">{value}{suffix}</span>
    </span>
  )
}
