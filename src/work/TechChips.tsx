type TechChipsProps = {
  items: readonly string[]
  /** Show at most this many, then a "+N more" chip. */
  limit?: number
  label?: string
}

export function TechChips({ items, limit, label = 'Tech stack' }: TechChipsProps) {
  const shown = limit ? items.slice(0, limit) : items
  const hidden = items.length - shown.length

  return (
    <ul className="chip-list" aria-label={label}>
      {shown.map((item) => <li key={item} className="chip">{item}</li>)}
      {hidden > 0 && (
        <li className="chip chip-more">
          +{hidden} more<span className="sr-only">: {items.slice(shown.length).join(', ')}</span>
        </li>
      )}
    </ul>
  )
}
