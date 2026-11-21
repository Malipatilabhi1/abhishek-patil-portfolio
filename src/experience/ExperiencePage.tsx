import { Link } from 'react-router'
import { chapters, education, experience, getLink, projects, recognition, yearsOfExperience } from '../content'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { AwardIcon } from '../icons'
import { queries, useMediaQuery } from '../useMediaQuery'
import { CountUp } from './CountUp'
import { Timeline } from './Timeline'

const chapter = chapters.find(({ path }) => path === '/experience')

export function ExperiencePage() {
  const reduceMotion = useMediaQuery(queries.reducedMotion)
  const resume = getLink('resume')
  // Same source as experienceLabel(): whole years since profile.careerStart, shown as "5+".
  const stats = [
    { label: 'Years of experience', value: yearsOfExperience(), suffix: '+' },
    { label: 'Companies', value: experience.length },
    { label: 'Client projects', value: projects.filter((project) => project.kind === 'Professional').length },
  ]

  return (
    <div className="page site-width experience-page">
      <PageHeader title={chapter?.title ?? 'Experience'} eyebrow={chapter?.eyebrow} intro={chapter?.intro} />

      <dl className="stats">
        {stats.map(({ label, value, suffix }, index) => (
          // Reveal renders the group <div> itself, keeping <dl> > <div> > <dt>/<dd> valid.
          <Reveal key={label} delay={index * 0.08} className="glass-card stat">
            <dt className="stat-label">{label}</dt>
            <dd className="stat-value"><CountUp value={value} suffix={suffix} reduceMotion={reduceMotion} /></dd>
          </Reveal>
        ))}
      </dl>

      <Section title="Where I've worked" eyebrow="Timeline">
        <Timeline reduceMotion={reduceMotion} />
      </Section>

      <div className="experience-extras">
        <Section title="Education" eyebrow="Background">
          <Reveal>
            <div className="glass-card info-card">
              <h3 className="info-title">{education.degree}</h3>
              <p className="info-text">{education.school}</p>
              <p className="info-meta">{education.start} – {education.end}</p>
            </div>
          </Reveal>
        </Section>

        <Section title="Recognition" eyebrow="Awards">
          <ul className="recognition-list">
            {recognition.map(({ title, org, year }, index) => (
              <li key={`${title}-${year}`}>
                <Reveal delay={index * 0.08}>
                  <div className="glass-card info-card recognition-card">
                    <AwardIcon className="recognition-icon" />
                    <p className="info-text">{[title, org, year].join(' · ')}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Want the full picture?" className="cta-panel">
        <p className="page-intro">See the projects behind these roles, or get in touch to talk through them.</p>
        <div className="page-actions cta-panel-actions">
          {resume && <a className="button button-primary" href={resume} download>Download Resume</a>}
          <Link className={resume ? 'button button-secondary' : 'button button-primary'} to="/contact">Get in touch</Link>
        </div>
      </Section>
    </div>
  )
}
