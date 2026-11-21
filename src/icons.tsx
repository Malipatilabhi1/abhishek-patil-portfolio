import type { SVGProps } from 'react'
import { siGithub, type SimpleIcon } from 'simple-icons'

type IconProps = SVGProps<SVGSVGElement>

function Stroke({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}
    >
      {children}
    </svg>
  )
}

export function PlaybackIcon({ paused }: { paused: boolean }) {
  return (
    <Stroke>
      {paused ? <path d="m9 5 11 7-11 7V5Z" /> : <path d="M9 5v14m6-14v14" />}
    </Stroke>
  )
}

export function ArrowIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 12h14m0 0-5.5-5.5M19 12l-5.5 5.5" />
    </Stroke>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2m0 15v2M2.5 12h2m15 0h2M5.28 5.28 6.7 6.7m10.6 10.6 1.42 1.42m0-13.44L17.3 6.7M6.7 17.3l-1.42 1.42" />
    </Stroke>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M20.8 15.1A8.7 8.7 0 0 1 8.9 3.2 9 9 0 1 0 20.8 15.1Z" />
    </Stroke>
  )
}

export function MenuIcon(props: IconProps) {
  return <Stroke {...props}><path d="M4 8h16M4 16h16" /></Stroke>
}

export function CloseIcon(props: IconProps) {
  return <Stroke {...props}><path d="m6 6 12 12M18 6 6 18" /></Stroke>
}

/** Renders a Simple Icons brand glyph in the current text color. */
export function BrandIcon({ icon, ...props }: IconProps & { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d={icon.path} />
    </svg>
  )
}

/** Simple Icons has no LinkedIn glyph (brand request), so it is drawn here. */
export function LinkedInIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </Stroke>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Stroke>
  )
}

/** Award medal: ribbon tails and a ringed disc with a small star. */
export function AwardIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m8.2 13.6-1.7 7.4 5.5-2.8 5.5 2.8-1.7-7.4" />
      <circle cx="12" cy="8.5" r="6" />
      <path d="m12 5.6.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3.9-1.9Z" />
    </Stroke>
  )
}

/** Frontend: a browser window with a code chevron. */
export function FrontendIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="M2.5 8.5h19" />
      <path d="m9.5 12-2.5 2.5 2.5 2.5M14.5 12l2.5 2.5-2.5 2.5" />
    </Stroke>
  )
}

/** Backend & data: a stacked database cylinder. */
export function DatabaseIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v6.5c0 1.66 3.58 3 8 3s8-1.34 8-3V5.5" />
      <path d="M4 12v6.5c0 1.66 3.58 3 8 3s8-1.34 8-3V12" />
    </Stroke>
  )
}

/** Delivery: a shipping box with an upward release arrow. */
export function DeliveryIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3.5 8.5 12 4l8.5 4.5v8L12 21l-8.5-4.5v-8Z" />
      <path d="M3.5 8.5 12 13l8.5-4.5M12 13v8" />
    </Stroke>
  )
}

export function PinIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </Stroke>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </Stroke>
  )
}

/** GitHub mark from simple-icons, sized like the other icons. */
export function GitHubIcon(props: IconProps) {
  return <BrandIcon icon={siGithub} {...props} />
}

export function CopyIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
      <path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" />
    </Stroke>
  )
}

export function CheckIcon(props: IconProps) {
  return <Stroke {...props}><path d="m5 12.5 4.5 4.5L19 7.5" /></Stroke>
}

export function ChevronDownIcon(props: IconProps) {
  return <Stroke {...props}><path d="m6 9 6 6 6-6" /></Stroke>
}

export function AlertIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </Stroke>
  )
}
