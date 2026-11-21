/**
 * Animated "Scroll" cue for the bottom of the hero. Not rendered yet: add
 * `<ScrollIndicator />` inside the hero <section> once there is content below it.
 * Styles live under "Scroll indicator" in index.css.
 */
export function ScrollIndicator() {
  return (
    <div className="scroll-indicator" aria-hidden="true">
      <span className="scroll-mouse"><i /></span>
      <span>Scroll</span>
    </div>
  )
}
