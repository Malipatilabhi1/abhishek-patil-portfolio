import { useEffect, useRef, useState } from 'react'
import { contact, getLink, getSocialLinks, profile, type SocialLink } from '../content'
import { LocalTime } from '../about/LocalTime'
import { ArrowIcon, CheckIcon, CopyIcon, PinIcon } from '../icons'
import { socialIcons } from '../socialIcons'
import { hourIn, useNow } from '../useNow'
import { socialHandle } from './contactModel'

const socialNames: Record<SocialLink['key'], string> = { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email' }

function EmailCard({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const address = useRef<HTMLAnchorElement>(null)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setAnnouncement(contact.copy.announce)
    } catch {
      // Clipboard blocked or unavailable: select the address so it can be copied manually.
      const node = address.current
      const selection = window.getSelection()
      if (node && selection) {
        const range = document.createRange()
        range.selectNodeContents(node)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      setAnnouncement(contact.copy.selected)
    }
    // Clearing the message lets the next copy be announced again.
    timer.current = window.setTimeout(() => {
      setCopied(false)
      setAnnouncement('')
    }, 2000)
  }

  return (
    <section className="glass-card contact-card" aria-labelledby="contact-email-title">
      <h2 className="contact-card-title" id="contact-email-title">{contact.emailTitle}</h2>
      <div className="email-row">
        <a className="email-address" href={`mailto:${email}`} ref={address}>{email}</a>
        <button type="button" className="button button-secondary button-small copy-button" onClick={copy} data-copied={copied}>
          {copied ? <CheckIcon className="button-icon" /> : <CopyIcon className="button-icon" />}
          {copied ? contact.copy.done : contact.copy.idle}
          <span className="sr-only"> email address</span>
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </section>
  )
}

function TimeCard() {
  const now = useNow()
  const hour = hourIn(now, profile.timeZone)
  const working = hour >= contact.workingHours.start && hour < contact.workingHours.end

  return (
    <section className="glass-card contact-card" aria-labelledby="contact-time-title">
      <h2 className="contact-card-title" id="contact-time-title">{contact.timeTitle}</h2>
      <div className="time-row">
        <span className="portrait-chip"><PinIcon />{profile.location}</span>
        <LocalTime timeZone={profile.timeZone} zoneLabel="IST" place={profile.location} />
      </div>
      <p className="time-status" data-state={working ? 'working' : 'outside'}>
        <span className="time-status-dot" aria-hidden="true" />
        {working ? contact.timeStatus.working : contact.timeStatus.outside}
      </p>
    </section>
  )
}

export function ContactInfo() {
  const email = getLink('email')
  const resume = getLink('resume')
  const socials = getSocialLinks()

  return (
    <aside className="contact-info" aria-label="Contact details">
      {email && <EmailCard email={email} />}

      {socials.length > 0 && (
        <section className="glass-card contact-card" aria-labelledby="contact-social-title">
          <h2 className="contact-card-title" id="contact-social-title">{contact.socialTitle}</h2>
          <ul className="social-rows">
            {socials.map(({ key, href, external }) => {
              const Icon = socialIcons[key]
              return (
                <li key={key}>
                  <a className="social-row" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <span className="social-row-icon" aria-hidden="true"><Icon /></span>
                    <span className="social-row-text">
                      <span className="social-row-name">{socialNames[key]}</span>
                      <span className="social-row-handle">{socialHandle(href)}</span>
                    </span>
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                    <ArrowIcon className="social-row-arrow" aria-hidden="true" />
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <TimeCard />

      {(profile.available || resume) && (
        <div className="contact-extras">
          {profile.available && (
            <p className="contact-available"><span className="status-dot" aria-hidden="true" />{contact.availableText}</p>
          )}
          {resume && <a className="button button-secondary" href={resume} download>{contact.resumeLabel}</a>}
        </div>
      )}
    </aside>
  )
}
