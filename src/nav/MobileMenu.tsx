import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { NavLink, useLocation } from 'react-router'
import { home } from '../content'
import { CloseIcon, MenuIcon } from '../icons'
import { queries, useMediaQuery } from '../useMediaQuery'
import { navigation } from './navigation'
import { ThemeToggle } from './ThemeToggle'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
const DESKTOP = '(min-width: 900px)'
type Phase = 'closed' | 'open' | 'closing'

export function MobileMenu({ focusMain, focusDesktopNavigation }: {
  focusMain: () => void
  focusDesktopNavigation: () => void
}) {
  const [phase, setPhase] = useState<Phase>('closed')
  const toggle = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const openedAt = useRef<string | null>(null)
  const location = useLocation()
  const reduceMotion = useMediaQuery(queries.reducedMotion)
  const modalActive = phase !== 'closed'

  function close() {
    setPhase((current) => current === 'open' ? 'closing' : current)
  }

  useLayoutEffect(() => {
    if (!modalActive) return
    const page = document.getElementById('root')
    const rootStyle = document.documentElement.style
    const previousOverflow = rootStyle.overflow
    const previousInert = page?.inert ?? false
    if (page) page.inert = true
    rootStyle.overflow = 'hidden'

    return () => {
      if (page) page.inert = previousInert
      rootStyle.overflow = previousOverflow
    }
  }, [modalActive])

  useLayoutEffect(() => {
    if (phase === 'open') closeButton.current?.focus({ preventScroll: true })
  }, [phase])

  useEffect(() => {
    if (phase !== 'open') return
    const desktop = window.matchMedia(DESKTOP)
    function closeOnDesktop() {
      if (desktop.matches) close()
    }
    desktop.addEventListener('change', closeOnDesktop)
    closeOnDesktop()
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [phase])

  useEffect(() => {
    if (phase === 'open' && openedAt.current !== location.key) close()
  }, [location.key, phase])

  useEffect(() => {
    if (phase !== 'closed' || openedAt.current === null) return
    const navigated = openedAt.current !== location.key
    openedAt.current = null
    if (navigated) focusMain()
    else if (window.matchMedia(DESKTOP).matches) focusDesktopNavigation()
    else toggle.current?.focus({ preventScroll: true })
  }, [focusDesktopNavigation, focusMain, location.key, phase])

  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation()
      close()
      return
    }
    if (event.key !== 'Tab' || !dialog.current) return
    const items = [...dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    const first = items[0]
    const last = items.at(-1)
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const list = {
    hidden: {},
    shown: { transition: { staggerChildren: reduceMotion ? 0 : 0.05, delayChildren: reduceMotion ? 0 : 0.12 } },
  }
  const item = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
    shown: { opacity: 1, y: 0 },
  }

  return (
    <>
      <button ref={toggle} className="icon-button menu-toggle" type="button"
        aria-label="Open navigation" aria-expanded={modalActive}
        aria-controls={modalActive ? 'mobile-menu' : undefined} aria-haspopup="dialog"
        onClick={() => {
          openedAt.current = location.key
          setPhase('open')
        }}
      >
        <MenuIcon />
      </button>
      {createPortal(
        <AnimatePresence onExitComplete={() => setPhase('closed')}>
          {phase === 'open' && (
            <motion.div
              ref={dialog}
              id="mobile-menu"
              className="mobile-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              onKeyDown={trapFocus}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'circle(0% at calc(100% - 44px) 40px)' }}
              animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 44px) 40px)' }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'circle(0% at calc(100% - 44px) 40px)' }}
              transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-sheet-bar site-width">
                <span className="brand" aria-hidden="true">
                  <span className="brand-mark">A</span>
                  <span>{home.name}</span>
                </span>
                <div className="header-actions">
                  <ThemeToggle />
                  <button ref={closeButton} type="button" className="icon-button" aria-label="Close navigation" onClick={close}>
                    <CloseIcon />
                  </button>
                </div>
              </div>
              <motion.nav aria-label="Primary" className="mobile-sheet-nav site-width"
                initial="hidden" animate="shown" variants={list}
              >
                {navigation.map(({ path, title }, index) => (
                  <motion.div key={path} variants={item} transition={{ duration: 0.35, ease: 'easeOut' }}>
                    <NavLink to={path} end={path === '/'}>
                      <span className="mobile-sheet-index" aria-hidden="true">0{index + 1}</span>
                      {title}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
