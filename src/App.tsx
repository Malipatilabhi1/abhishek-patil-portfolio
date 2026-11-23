import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { chapters, home, profile, projects } from './content'
import { ChapterPlaceholder } from './ChapterPlaceholder'
import { Footer } from './components/Footer'
import { Navbar } from './nav/Navbar'
import { NotFound } from './NotFound'
import { usePageVisibility } from './usePageVisibility'

const Home = lazy(() => import('./Home').then((module) => ({ default: module.Home })))
const WorkPage = lazy(() => import('./work/WorkPage').then((module) => ({ default: module.WorkPage })))
const CaseStudy = lazy(() => import('./work/CaseStudy').then((module) => ({ default: module.CaseStudy })))
const ExperiencePage = lazy(() => import('./experience/ExperiencePage').then((module) => ({ default: module.ExperiencePage })))
const AboutPage = lazy(() => import('./about/AboutPage').then((module) => ({ default: module.AboutPage })))
const ContactPage = lazy(() => import('./contact/ContactPage').then((module) => ({ default: module.ContactPage })))

function Page({ title, children }: { title: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.title = title === 'Home' ? `${home.name} | ${profile.role}` : `${title} | ${home.name}`
  }, [title])

  return (
    <Suspense fallback={<p className="page site-width" role="status">Loading…</p>}>
      <motion.div
        initial={title === 'Home' || reduceMotion ? false : { opacity: 0.75, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </Suspense>
  )
}

function CaseStudyRoute() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return <Page title="Page not found"><NotFound /></Page>
  return <Page title={project.title}><CaseStudy project={project} /></Page>
}

function Portfolio() {
  const location = useLocation()
  const main = useRef<HTMLElement>(null)
  const previousPath = useRef(location.pathname)
  const pageVisible = usePageVisibility()
  const focusMain = useCallback(() => {
    main.current?.focus({ preventScroll: true })
  }, [])

  useLayoutEffect(() => {
    const root = document.documentElement
    root.toggleAttribute('data-page-hidden', !pageVisible)
    return () => root.removeAttribute('data-page-hidden')
  }, [pageVisible])

  useEffect(() => {
    if (previousPath.current === location.pathname) return
    previousPath.current = location.pathname
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (!main.current?.closest('[inert]')) focusMain()
  }, [focusMain, location.pathname])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar focusMain={focusMain} />
      <main id="main-content" ref={main} tabIndex={-1}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page title="Home"><Home /></Page>} />
          <Route path="/work" element={<Page title="Work"><WorkPage /></Page>} />
          <Route path="/work/:slug" element={<CaseStudyRoute />} />
          <Route path="/experience" element={<Page title="Experience"><ExperiencePage /></Page>} />
          <Route path="/about" element={<Page title="About"><AboutPage /></Page>} />
          <Route path="/contact" element={<Page title="Contact"><ContactPage /></Page>} />
          {/* Fallback for any future chapter that doesn't have its own page yet. */}
          {chapters.filter(({ path }) => !['/work', '/experience', '/about', '/contact'].includes(path)).map(({ path, title, eyebrow, intro }) => (
            <Route key={path} path={path} element={
              <Page title={title}><ChapterPlaceholder title={title} eyebrow={eyebrow} intro={intro} /></Page>
            } />
          ))}
          <Route path="*" element={<Page title="Page not found"><NotFound /></Page>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Portfolio />
      </BrowserRouter>
    </MotionConfig>
  )
}
