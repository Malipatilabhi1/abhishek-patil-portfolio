import { useRef, useState } from 'react'
import { LayoutGroup, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Link, NavLink } from 'react-router'
import { home } from '../content'
import { MobileMenu } from './MobileMenu'
import { navigation } from './navigation'
import { ThemeToggle } from './ThemeToggle'

const SCROLLED_AT = 8
const HIDE_AFTER = 140

export function Navbar({ focusMain }: { focusMain: () => void }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const focusWithin = useRef(false)
  const brand = useRef<HTMLAnchorElement>(null)
  const desktopNav = useRef<HTMLElement>(null)

  function focusDesktopNavigation() {
    const activeLink = desktopNav.current?.querySelector<HTMLAnchorElement>('a[aria-current="page"]')
    const target = activeLink ?? brand.current
    target?.focus({ preventScroll: true })
  }

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(current > SCROLLED_AT)
    // Hide on scroll down, reveal on scroll up; never hide while a header control has focus.
    if (focusWithin.current || current < HIDE_AFTER) setHidden(false)
    else if (Math.abs(current - previous) > 4) setHidden(current > previous)
  })

  return (
    <motion.header
      className="site-header"
      data-scrolled={scrolled}
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onFocus={() => {
        focusWithin.current = true
        setHidden(false)
      }}
      onBlur={(event) => {
        focusWithin.current = event.currentTarget.contains(event.relatedTarget)
      }}
    >
      <div className="header-inner site-width">
        <Link className="brand" to="/" ref={brand}>
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>{home.name}<span className="sr-only">, Home</span></span>
        </Link>
        <LayoutGroup>
          <nav className="desktop-nav" aria-label="Primary" ref={desktopNav}>
            {navigation.map(({ path, title }) => (
              <NavLink key={path} to={path} end={path === '/'}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        className="nav-indicator"
                        layoutId="active-navigation"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="nav-label">{title}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </LayoutGroup>
        <div className="header-actions">
          <Link className="button button-small button-secondary header-cta" to="/contact">Let's talk</Link>
          <ThemeToggle />
          <MobileMenu focusMain={focusMain} focusDesktopNavigation={focusDesktopNavigation} />
        </div>
      </div>
    </motion.header>
  )
}
