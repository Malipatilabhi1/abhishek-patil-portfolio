import type { ComponentType, SVGProps } from 'react'
import { Link } from 'react-router'
import { about, chapters, skills, spokenLanguages, type AboutService } from '../content'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { BrandIcon, DatabaseIcon, DeliveryIcon, FrontendIcon } from '../icons'
import { Portrait } from './Portrait'
import { skillIcons } from './skillIcons'

const chapter = chapters.find(({ path }) => path === '/about')

const serviceIcons: Record<AboutService['icon'], ComponentType<SVGProps<SVGSVGElement>>> = {
  frontend: FrontendIcon,
  backend: DatabaseIcon,
  delivery: DeliveryIcon,
}

export function AboutPage() {
  return (
    <div className="page site-width about-page">
      <PageHeader title={chapter?.title ?? 'About'} eyebrow={chapter?.eyebrow} intro={chapter?.intro} />

      <Section title="My story" eyebrow="Story">
        <div className="story-grid">
          <Reveal className="story-portrait">
            <Portrait />
          </Reveal>
          <div className="story-text">
            {about.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="story-languages">
              <span className="story-languages-label">{about.languagesLabel}:</span> {spokenLanguages.join(', ')}
            </p>
          </div>
        </div>
      </Section>

      <Section title={about.servicesTitle} eyebrow="Focus">
        <ul className="service-grid">
          {about.services.map(({ icon, title, text }, index) => {
            const Icon = serviceIcons[icon]
            return (
              <li key={title}>
                <Reveal delay={index * 0.08} className="glass-card service-card">
                  <span className="service-icon" aria-hidden="true"><Icon /></span>
                  <h3 className="service-title">{title}</h3>
                  <p className="service-text">{text}</p>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section title={about.toolboxTitle} eyebrow="Skills">
        <ul className="toolbox">
          {skills.map((group, index) => (
            <li key={group.name}>
              <Reveal delay={index * 0.05} className="glass-card toolbox-group">
                <h3 className="toolbox-name">{group.name}</h3>
                <ul className="chip-list" aria-label={group.name}>
                  {group.items.map((item) => {
                    const icon = skillIcons[item]
                    return (
                      <li key={item} className="chip skill-chip">
                        {icon && <BrandIcon icon={icon} />}
                        {item}
                      </li>
                    )
                  })}
                </ul>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={about.learningTitle} eyebrow="Now">
        <Reveal className="glass-card learning-card">
          <ul className="learning-list">
            {about.learning.map((item) => (
              <li key={item}>
                <span>{item}</span>
                <span className="learning-bar" aria-hidden="true"><span className="learning-bar-fill" /></span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section title={about.cta.title} className="cta-panel">
        <p className="page-intro">{about.cta.text}</p>
        <div className="page-actions cta-panel-actions">
          <Link className="button button-primary" to="/work">View Projects</Link>
          <Link className="button button-secondary" to="/contact">Get in touch</Link>
        </div>
      </Section>
    </div>
  )
}
