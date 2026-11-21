import { useId, type ReactNode } from 'react'

type SectionProps = {
  title: string
  eyebrow?: string
  children: ReactNode
  className?: string
  /** Optional stable id for in-page links (e.g. "#projects"). */
  id?: string
}

/** A labelled page section: <section aria-labelledby> with an H2 and optional eyebrow. */
export function Section({ title, eyebrow, children, className, id }: SectionProps) {
  const headingId = `${useId()}-heading`

  return (
    <section id={id} className={['section', className].filter(Boolean).join(' ')} aria-labelledby={headingId}>
      <div className="section-heading">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={headingId} className="section-title">{title}</h2>
      </div>
      {children}
    </section>
  )
}
