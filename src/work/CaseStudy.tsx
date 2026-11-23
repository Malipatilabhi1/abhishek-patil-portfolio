import { Link, useLocation } from 'react-router'
import { getProjectLinks, type Project } from '../content'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { ArrowIcon } from '../icons'
import { MtmxStory } from './MtmxStory'
import { ProjectVisual } from './ProjectVisual'
import { TechChips } from './TechChips'
import { experienceFor, neighbours, readFrom, type WorkLocationState } from './workModel'

export function CaseStudy({ project }: { project: Project }) {
  const location = useLocation()
  const from = readFrom(location.state)
  const state: WorkLocationState = { from }
  const role = experienceFor(project)
  const links = getProjectLinks(project)
  const { previous, next } = neighbours(project.slug)
  const isMtmx = project.slug === 'mtmx'

  const meta = [
    { term: 'Organisation', detail: project.org ?? 'Personal project' },
    { term: 'Type', detail: project.kind },
    { term: 'Category', detail: project.category },
    ...(role ? [{ term: 'Role', detail: role.role }] : []),
  ]

  return (
    <article className={`page site-width case-study${isMtmx ? ' mtmx-case-study' : ''}`}>
      <Link className="back-link" to={`/work${from}`}>
        <ArrowIcon className="back-link-icon" />
        All work
      </Link>

      <PageHeader title={project.title} eyebrow={project.subtitle} intro={project.summary} />

      <dl className="case-meta">
        {meta.map(({ term, detail }) => (
          <div key={term} className="case-meta-item">
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>

      {isMtmx ? <MtmxStory /> : <ProjectVisual project={project} size="large" />}

      <div className="case-body">
        {project.overview && (
          <Section title="Overview">
            <p className="case-text">{project.overview}</p>
          </Section>
        )}

        {!isMtmx && (
          <Section title="What I did">
            <ul className="highlight-list">
              {project.highlights.map((highlight, index) => (
                <li key={highlight}>
                  <Reveal delay={index * 0.07}>{highlight}</Reveal>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="Tech stack">
          <TechChips items={project.tech} />
        </Section>

        {(links.live || links.code) && (
          <div className="page-actions case-links">
            {links.live && (
              <a className="button button-primary" href={links.live} target="_blank" rel="noopener noreferrer">
                View live<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {links.code && (
              <a className="button button-secondary" href={links.code} target="_blank" rel="noopener noreferrer">
                View code<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
      </div>

      {project.confidential && (
        <aside className="glass-card case-note" aria-label="About confidentiality">
          <p>
            This is client work, so code, screenshots and data stay private. Happy to walk through it in an interview.
          </p>
          <Link className="button button-secondary button-small" to="/contact">Get in touch</Link>
        </aside>
      )}

      <nav className="case-pager" aria-label="More projects">
        {previous && (
          <Link className="glass-card case-pager-link" to={`/work/${previous.slug}`} state={state} rel="prev">
            <span className="case-pager-label"><ArrowIcon className="back-link-icon" />Previous project</span>
            <span className="case-pager-title">{previous.title}</span>
          </Link>
        )}
        {next && (
          <Link className="glass-card case-pager-link case-pager-next" to={`/work/${next.slug}`} state={state} rel="next">
            <span className="case-pager-label">Next project<ArrowIcon /></span>
            <span className="case-pager-title">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  )
}
