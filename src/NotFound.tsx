import { Link } from 'react-router'
import { notFound } from './content'
import { PageHeader } from './components/PageHeader'

export function NotFound() {
  return (
    <div className="page site-width not-found">
      <p className="not-found-code" aria-hidden="true">404</p>
      <PageHeader title={notFound.title} intro={notFound.message}>
        <div className="page-actions">
          <Link className="button button-primary" to="/">Back to Home</Link>
          <Link className="button button-secondary" to="/work">View Projects</Link>
        </div>
      </PageHeader>
    </div>
  )
}
