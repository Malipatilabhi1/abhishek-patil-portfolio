import { experience, projects, type Experience, type Project, type ProjectCategory } from '../content'

export type CategoryFilter = 'all' | Lowercase<ProjectCategory>

export const filterOptions: readonly { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'banking', label: 'Banking' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'personal', label: 'Personal' },
]

/** Reads ?category=…; anything missing or unknown falls back to "all". */
export function parseCategory(value: string | null): CategoryFilter {
  const match = filterOptions.find((option) => option.value === value?.toLowerCase())
  return match?.value ?? 'all'
}

export function matchesFilter(project: Project, filter: CategoryFilter) {
  return filter === 'all' || project.category.toLowerCase() === filter
}

export function countFor(filter: CategoryFilter) {
  return projects.filter((project) => matchesFilter(project, filter)).length
}

/** Featured first, otherwise keeping content.ts order. */
export function orderProjects(list: readonly Project[]): Project[] {
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
}

/**
 * Desktop bento on a 6-track grid, filled row by row so there are never holes:
 * - odd count: the first project is a full-width "lead" tile;
 * - then pairs: featured + featured = half/half, featured + standard = wide/narrow.
 */
export type TileSize = 'lead' | 'half' | 'wide' | 'narrow'

export function bentoSizes(list: readonly Project[]): TileSize[] {
  const sizes: TileSize[] = []
  let index = 0
  if (list.length % 2 === 1) {
    sizes.push('lead')
    index = 1
  }
  for (; index < list.length; index += 2) {
    const first = list[index]
    const second = list[index + 1]
    if (!first || !second) break
    if (first.featured === second.featured) sizes.push('half', 'half')
    else sizes.push(first.featured ? 'wide' : 'narrow', first.featured ? 'narrow' : 'wide')
  }
  return sizes
}

/** "Finonyx" matches "Finonyx Software Solutions"; "JK Tech" matches exactly. */
export function orgMatches(company: string, org: string | undefined) {
  return !!org && (company === org || company.startsWith(`${org} `))
}

/** The role this project was delivered under, matched by organisation. */
export function experienceFor(project: Project): Experience | undefined {
  return experience.find((entry) => orgMatches(entry.company, project.org))
}

/** Case studies delivered at this company. */
export function projectsFor(company: string): Project[] {
  return projects.filter((project) => orgMatches(company, project.org))
}

export function neighbours(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug)
  const count = projects.length
  return {
    previous: projects[(index - 1 + count) % count],
    next: projects[(index + 1) % count],
  }
}

/** Router state carried from /work to case studies so "All work" restores the filter. */
export type WorkLocationState = { from: string }

export function readFrom(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const { from } = state as { from: unknown }
    if (typeof from === 'string' && from.startsWith('?')) return from
  }
  return ''
}

export function projectBadge(project: Project) {
  if (project.confidential) return 'Client work · confidential'
  return project.kind === 'Personal' ? 'Personal' : 'Client work'
}
