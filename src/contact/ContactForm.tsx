import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { contact, getLink } from '../content'
import { AlertIcon, CheckIcon, ChevronDownIcon } from '../icons'
import { buildMailto, emptyValues, fieldOrder, validateAll, validateField, type FieldName, type FormErrors, type FormValues } from './contactModel'

type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'mailto'

/** Opens a mailto: link via a detached anchor, so no page navigation is involved. */
function openMailto(href: string) {
  const link = document.createElement('a')
  link.href = href
  link.click()
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [announcement, setAnnouncement] = useState('')
  const [lockedHeight, setLockedHeight] = useState<number | null>(null)
  const card = useRef<HTMLDivElement>(null)
  const successHeading = useRef<HTMLHeadingElement>(null)
  const fields = useRef<Partial<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const email = getLink('email')
  const endpoint = contact.formEndpoint
  const sending = status === 'sending'

  function update(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  // Validate on blur (and on submit), never on every keystroke.
  function blur(field: FieldName) {
    setErrors((current) => ({ ...current, [field]: validateField(field, values) }))
  }

  function showSuccess() {
    // Keep the card the same height when the form is swapped for the thank-you state.
    setLockedHeight(card.current?.offsetHeight ?? null)
    setStatus('sent')
    setAnnouncement(contact.status.sent)
    requestAnimationFrame(() => successHeading.current?.focus())
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    // Honeypot filled: almost certainly a bot. Pretend it worked and send nothing.
    if (values.website) {
      showSuccess()
      return
    }

    const found = validateAll(values)
    setErrors(found)
    const firstInvalid = fieldOrder.find((field) => found[field])
    if (firstInvalid) {
      fields.current[firstInvalid]?.focus()
      return
    }

    if (!endpoint) {
      if (!email) return
      openMailto(buildMailto(email, values))
      setStatus('mailto')
      setAnnouncement(contact.status.mailto)
      return
    }

    setStatus('sending')
    setAnnouncement(contact.labels.sending)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: values.name.trim(), email: values.email.trim(), subject: values.subject, message: values.message.trim() }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      showSuccess()
    } catch {
      setStatus('failed')
      setAnnouncement(contact.status.failed)
    }
  }

  function reset() {
    setValues(emptyValues())
    setErrors({})
    setStatus('idle')
    setAnnouncement('')
    setLockedHeight(null)
    requestAnimationFrame(() => fields.current.name?.focus())
  }

  const describedBy = (field: FieldName, ...extra: string[]) =>
    [...extra, errors[field] ? `contact-${field}-error` : ''].filter(Boolean).join(' ') || undefined

  const errorText = (field: FieldName) => errors[field] && (
    <p className="field-error" id={`contact-${field}-error`}>
      <AlertIcon aria-hidden="true" />
      {errors[field]}
    </p>
  )

  return (
    <div className="glass-card contact-form-card" ref={card} style={lockedHeight ? { minBlockSize: lockedHeight } : undefined}>
      {/* Persists across states so every status change is announced. */}
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      {status === 'sent' ? (
        <div className="form-success">
          <span className="form-success-icon" aria-hidden="true"><CheckIcon /></span>
          <h2 className="contact-card-title" ref={successHeading} tabIndex={-1}>{contact.success.title}</h2>
          <p>{contact.success.text}</p>
          <button type="button" className="button button-secondary" onClick={reset}>{contact.success.again}</button>
        </div>
      ) : (
        <form className="contact-form" noValidate onSubmit={submit} aria-labelledby="contact-form-title">
          <h2 className="contact-card-title" id="contact-form-title">{contact.formTitle}</h2>

          <div className="form-row">
            <div className="field">
              <label htmlFor="contact-name">{contact.labels.name}</label>
              <input
                id="contact-name" name="name" type="text" autoComplete="name" required
                className="input" value={values.name} onChange={update} onBlur={() => blur('name')}
                aria-invalid={errors.name ? true : undefined} aria-describedby={describedBy('name')}
                ref={(element) => { fields.current.name = element }}
              />
              {errorText('name')}
            </div>

            <div className="field">
              <label htmlFor="contact-email">{contact.labels.email}</label>
              <input
                id="contact-email" name="email" type="email" autoComplete="email" inputMode="email" spellCheck={false} required
                className="input" value={values.email} onChange={update} onBlur={() => blur('email')}
                aria-invalid={errors.email ? true : undefined} aria-describedby={describedBy('email')}
                ref={(element) => { fields.current.email = element }}
              />
              {errorText('email')}
            </div>
          </div>

          <div className="field">
            <label htmlFor="contact-subject">{contact.labels.subject}</label>
            <div className="select-wrap">
              <select id="contact-subject" name="subject" autoComplete="off" className="input" value={values.subject} onChange={update}>
                {contact.subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
              </select>
              <ChevronDownIcon className="select-chevron" aria-hidden="true" />
            </div>
          </div>

          <div className="field">
            <div className="field-head">
              <label htmlFor="contact-message">{contact.labels.message}</label>
              <span className="char-count" id="contact-message-count" data-near={values.message.length > contact.messageMax * 0.9}>
                {values.message.length} / {contact.messageMax}
              </span>
            </div>
            <textarea
              id="contact-message" name="message" required rows={7} maxLength={contact.messageMax}
              className="input" value={values.message} onChange={update} onBlur={() => blur('message')}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy('message', 'contact-message-hint')}
              ref={(element) => { fields.current.message = element }}
            />
            <p className="field-hint" id="contact-message-hint">At least {contact.messageMin} characters, up to {contact.messageMax}.</p>
            {errorText('message')}
          </div>

          {/* Honeypot: off-screen and skipped by keyboard and assistive tech. */}
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={update} />
          </div>

          {status === 'failed' && email && (
            <div className="form-alert">
              <AlertIcon aria-hidden="true" />
              <p>
                {contact.status.failed} {contact.fallbackLead} <a href={`mailto:${email}`}>{email}</a>.
              </p>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="button button-primary form-submit" disabled={sending} aria-disabled={sending || undefined}>
              {sending && <span className="spinner" aria-hidden="true" />}
              {sending ? contact.labels.sending : endpoint ? contact.labels.submit : contact.labels.submitMailto}
            </button>
            {!endpoint && <p className="form-note">{contact.mailtoNote}</p>}
          </div>
        </form>
      )}
    </div>
  )
}
