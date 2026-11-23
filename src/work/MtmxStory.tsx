import { Fragment, useId, useRef, useState, type KeyboardEvent } from 'react'
import { mtmxChapters } from '../content'
import './mtmx-story.css'

export function MtmxStory() {
  const id = useId()
  const tabs = useRef<HTMLButtonElement[]>([])
  const [selected, setSelected] = useState(0)

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = mtmxChapters.length - 1
    let next: number
    switch (event.key) {
      case 'ArrowLeft':
        next = index === 0 ? last : index - 1
        break
      case 'ArrowRight':
        next = index === last ? 0 : index + 1
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = last
        break
      default:
        return
    }
    event.preventDefault()
    setSelected(next)
    tabs.current[next]?.focus()
  }

  return (
    <section className="mtmx-story" aria-labelledby={`${id}-heading`}>
      <h2 className="section-title" id={`${id}-heading`}>Explore my contributions</h2>
      <div className="mtmx-tabs" role="tablist" aria-labelledby={`${id}-heading`}>
        {mtmxChapters.map((chapter, index) => (
          <button
            key={chapter.id}
            ref={(element) => { if (element) tabs.current[index] = element }}
            type="button"
            role="tab"
            id={`${id}-${chapter.id}-tab`}
            aria-controls={`${id}-${chapter.id}-panel`}
            aria-selected={index === selected}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            {chapter.title}
          </button>
        ))}
      </div>

      {mtmxChapters.map((chapter, index) => (
        <div
          className="mtmx-panel"
          key={chapter.id}
          id={`${id}-${chapter.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-${chapter.id}-tab`}
          hidden={index !== selected}
          tabIndex={0}
        >
          <div className="mtmx-panel-content">
            <div className="mtmx-copy">
              <h3>{chapter.title}</h3>
              <p className="case-text">{chapter.explanation}</p>
              <div className="mtmx-contribution">
                <h4 className="eyebrow">My contribution</h4>
                <p>{chapter.contribution}</p>
              </div>
            </div>
            <figure className="project-visual mtmx-diagram" data-chapter={chapter.id}>
              <div className="pv-grid" aria-hidden="true" />
              <figcaption>Conceptual flow</figcaption>
              <div className="mtmx-flow" role="img" aria-label={chapter.flowDescription}>
                {chapter.flow.map((node, nodeIndex) => (
                  <Fragment key={node}>
                    {nodeIndex > 0 && (
                      <span className="mtmx-connector" aria-hidden="true">{chapter.id === 'conversion' ? '—' : '→'}</span>
                    )}
                    <span className="mtmx-node" aria-hidden="true">
                      <span className="mtmx-packet" />
                      {node}
                    </span>
                  </Fragment>
                ))}
              </div>
            </figure>
          </div>
        </div>
      ))}
    </section>
  )
}
