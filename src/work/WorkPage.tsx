import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useLocation, useSearchParams } from 'react-router'
import { chapters, projects } from '../content'
import { PageHeader } from '../components/PageHeader'
import { queries, useMediaQuery } from '../useMediaQuery'
import { ProjectCard } from './ProjectCard'
import { bentoSizes, countFor, filterOptions, matchesFilter, orderProjects, parseCategory, type CategoryFilter } from './workModel'

const chapter = chapters.find(({ path }) => path === '/work')

export function WorkPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const reduceMotion = useMediaQuery(queries.reducedMotion)
  const active = parseCategory(searchParams.get('category'))
  const visible = orderProjects(projects.filter((project) => matchesFilter(project, active)))
  const sizes = bentoSizes(visible)
  const activeLabel = filterOptions.find(({ value }) => value === active)?.label ?? 'All'
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }

  function select(value: CategoryFilter) {
    if (value === active) return
    // Pushes a history entry, so back/forward walk through filters and refresh keeps it.
    setSearchParams(value === 'all' ? {} : { category: value })
  }

  return (
    <div className="page site-width work-page">
      <PageHeader title={chapter?.title ?? 'Work'} eyebrow={chapter?.eyebrow} intro={chapter?.intro} />

      <LayoutGroup id="work-filter">
        <div className="filter-bar" role="group" aria-label="Filter projects by category">
          {filterOptions.map(({ value, label }) => {
            const pressed = value === active
            return (
              <button key={value} type="button" className="filter-button" aria-pressed={pressed} onClick={() => select(value)}>
                {pressed && (
                  <motion.span
                    className="filter-pill"
                    layoutId="work-filter-pill"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                    aria-hidden="true"
                  />
                )}
                <span className="filter-label">{label}</span>
                <span className="filter-count"><span className="sr-only">(</span>{countFor(value)}<span className="sr-only"> projects)</span></span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      <p className="sr-only" role="status" aria-live="polite">
        {`Showing ${visible.length} ${visible.length === 1 ? 'project' : 'projects'}${active === 'all' ? '' : ` in ${activeLabel}`}`}
      </p>

      {visible.length === 0 ? (
        <div className="glass-card work-empty">
          <p>No projects in {activeLabel} yet.</p>
          <button type="button" className="button button-secondary" onClick={() => select('all')}>Show all projects</button>
        </div>
      ) : (
        <ul className="bento">
          {/* initial={false}: the first paint is the final layout (no shift); animations run on filter changes only. */}
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((project, index) => (
              <motion.li
                key={project.slug}
                className="bento-item"
                data-size={sizes[index]}
                layout={reduceMotion ? false : 'position'}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={transition}
              >
                <ProjectCard project={project} size={sizes[index] ?? 'half'} from={location.search} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
