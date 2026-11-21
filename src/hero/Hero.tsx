import { Fragment, useLayoutEffect, useRef } from 'react'
import { motion, type Variants } from 'motion/react'
import { Link } from 'react-router'
import { home, profile } from '../content'
import { ArrowIcon } from '../icons'
import { HeroVisual } from '../scene/HeroVisual'
import { usePageVisibility } from '../usePageVisibility'
import { queries, useMediaQuery } from '../useMediaQuery'
import { MagneticButton } from './MagneticButton'
import { TechMarquee } from './TechMarquee'
import { useHeroPointer } from './useHeroPointer'

const ease = [0.22, 1, 0.36, 1] as const

const headline: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}

const word: Variants = {
  hidden: { opacity: 0, y: '0.45em', filter: 'blur(8px)' },
  shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease } },
}

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const visual = useRef<HTMLDivElement>(null)
  const reduceMotion = useMediaQuery(queries.reducedMotion)
  const pageVisible = usePageVisibility()
  const finePointer = useMediaQuery(queries.finePointer)
  const pointerMotion = finePointer && !reduceMotion && pageVisible
  const pointer = useHeroPointer(section, visual, pointerMotion)
  const skipEntrance = reduceMotion || !pageVisible

  useLayoutEffect(() => {
    if (pageVisible) return
    // CSS keyframes are paused by the page visibility selector. Hold the
    // browser animations created by Motion at their current progress too.
    const animations = section.current?.getAnimations({ subtree: true }).filter((animation) =>
      animation.playState === 'running' && !('animationName' in animation) && !('transitionProperty' in animation),
    ) ?? []
    for (const animation of animations) animation.pause()
    return () => {
      for (const animation of animations) {
        if (animation.playState === 'paused') animation.play()
      }
    }
  }, [pageVisible])

  // Entrance for supporting copy. The H1 is never hidden, so it paints instantly (good LCP).
  function entrance(order: number, from = 0) {
    return {
      initial: skipEntrance ? false as const : { opacity: from, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.55, delay: 0.05 + order * 0.08, ease },
    }
  }

  return (
    <section ref={section} className="hero" aria-labelledby="hero-heading">
      <div className="hero-grid site-width">
        <div className="hero-copy">
          <motion.p className="status-pill" {...entrance(0)}>
            <span className="status-dot" aria-hidden="true" />
            {profile.available ? 'Available for work' : 'Developer portfolio'}
          </motion.p>

          <h1 className="hero-name" id="hero-heading">{home.greeting}</h1>
          <motion.p className="hero-role" {...entrance(1)}>{home.role}</motion.p>

          <motion.p className="hero-headline" variants={headline} initial={skipEntrance ? false : 'hidden'} animate="shown">
            {home.headline.map((line, lineIndex) => (
              <span key={lineIndex} className="hero-headline-line">
                {line.map(({ text, highlight }, index) => (
                  <Fragment key={index}>
                    {index > 0 && ' '}
                    <motion.span className={highlight ? 'word highlight' : 'word'} variants={word}>{text}</motion.span>
                  </Fragment>
                ))}
              </span>
            ))}
          </motion.p>

          <motion.p className="hero-description" {...entrance(3, 0.6)}>{home.description}</motion.p>

          <motion.div className="hero-actions" {...entrance(4)}>
            <MagneticButton className="hero-action" active={pointerMotion}>
              <Link className="button button-primary button-glow" to="/work">
                View Projects
                <ArrowIcon className="button-icon" />
              </Link>
            </MagneticButton>
            <MagneticButton className="hero-action" strength={0.18} active={pointerMotion}>
              <Link className="button button-secondary" to="/about">About Me</Link>
            </MagneticButton>
          </motion.div>

          <motion.div className="hero-stack" {...entrance(5)}>
            <TechMarquee />
          </motion.div>
        </div>

        <motion.div className="hero-visual-wrap"
          initial={skipEntrance ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
        >
          <HeroVisual frame={visual} pointer={pointer} reduceMotion={reduceMotion} pageVisible={pageVisible} />
        </motion.div>
      </div>
    </section>
  )
}
