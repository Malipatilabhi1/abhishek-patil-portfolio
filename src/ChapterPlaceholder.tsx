import { Link } from 'react-router'
import { PageHeader } from './components/PageHeader'

type ChapterPlaceholderProps = {
  title: string
  eyebrow?: string
  intro?: string
}

// Temporary chapter screen until the individual chapter is designed.
export function ChapterPlaceholder({ title, eyebrow, intro }: ChapterPlaceholderProps) {
  return (
    <div className="page site-width">
      <PageHeader title={title} eyebrow={eyebrow} intro={intro}>
        <div className="page-actions">
          <Link className="button button-secondary" to="/">Back to Home</Link>
        </div>
      </PageHeader>
    </div>
  )
}
