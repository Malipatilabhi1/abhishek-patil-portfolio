import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode, type RefObject } from 'react'
import { BuildCard, ProfileCard } from '../hero/cards'
import { FloatingCard } from '../hero/FloatingCard'
import type { HeroPointer } from '../hero/useHeroPointer'
import { useTheme } from '../theme'
import { queries, useMediaQuery } from '../useMediaQuery'

// Loaded after first paint so the text (LCP) never waits on three.js.
const HeroScene = lazy(() => import('./HeroScene'))

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onFailure()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

/**
 * Mounts the WebGL scene on the visitor's first interaction, or once the page has
 * loaded and settled, whichever comes first. The static "A" holds the space until then,
 * so three.js never competes with the text for the main thread during load.
 */
function useDeferredMount(active: boolean, delayAfterLoad = 2500) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!active || ready) return
    const events = ['pointermove', 'pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'] as const
    let timer = 0
    let idle = 0
    function mount() {
      if (document.hidden) return
      cleanup()
      setReady(true)
    }
    function afterLoad() {
      timer = window.setTimeout(() => {
        if ('requestIdleCallback' in window) idle = window.requestIdleCallback(mount, { timeout: 1000 })
        else mount()
      }, delayAfterLoad)
    }
    function cleanup() {
      for (const name of events) window.removeEventListener(name, mount)
      window.removeEventListener('load', afterLoad)
      window.clearTimeout(timer)
      if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle)
    }
    for (const name of events) window.addEventListener(name, mount, { passive: true, once: true })
    if (document.readyState === 'complete') afterLoad()
    else window.addEventListener('load', afterLoad, { once: true })
    return cleanup
  }, [active, delayAfterLoad, ready])
  return ready
}

function useInView(target: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const element = target.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true), { rootMargin: '80px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [target])
  return inView
}

type HeroVisualProps = {
  frame: RefObject<HTMLDivElement | null>
  pointer: HeroPointer
  reduceMotion: boolean
  pageVisible: boolean
}

export function HeroVisual({ frame, pointer, reduceMotion, pageVisible }: HeroVisualProps) {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])
  const handleFailure = useCallback(() => setFailed(true), [])
  const inView = useInView(frame)
  const light = useTheme() === 'light'
  const webgl = typeof WebGL2RenderingContext !== 'undefined'
  const active = inView && pageVisible
  const mountScene = useDeferredMount(active && webgl && !failed)
  const mobile = useMediaQuery(queries.mobile)

  return (
    <div className="hero-visual" ref={frame} data-motion={!reduceMotion && inView}>
      <div className="visual-glow" aria-hidden="true" />
      <div className="visual-grid" aria-hidden="true" />
      <div className="visual-orbit visual-orbit-outer" aria-hidden="true" />
      <div className="visual-orbit visual-orbit-inner" aria-hidden="true" />
      <div className="visual-stand-in" data-visible={!ready || failed} aria-hidden="true">
        <span>A</span>
      </div>
      {webgl && !failed && mountScene && (
        <SceneBoundary onFailure={handleFailure}>
          <Suspense fallback={null}>
            <HeroScene frame={frame} pointer={pointer} active={active}
              light={light} onReady={handleReady} onFailure={handleFailure}
            />
          </Suspense>
        </SceneBoundary>
      )}
      <FloatingCard className="card-code" depth={-12} pointerX={pointer.x} pointerY={pointer.y} delay={0.5} reduceMotion={reduceMotion} pageVisible={pageVisible}>
        <ProfileCard reduceMotion={reduceMotion} active={active && !mobile} />
      </FloatingCard>
      <FloatingCard className="card-build" depth={14} pointerX={pointer.x} pointerY={pointer.y} delay={0.7} reduceMotion={reduceMotion} pageVisible={pageVisible} decorative={false}>
        <BuildCard />
      </FloatingCard>
    </div>
  )
}
