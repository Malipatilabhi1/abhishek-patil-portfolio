import { contact } from '../content'

export type FieldName = 'name' | 'email' | 'message'

export type FormValues = {
  name: string
  email: string
  subject: string
  message: string
  /** Honeypot: hidden from people, often filled by bots. */
  website: string
}

export type FormErrors = Partial<Record<FieldName, string>>

/** Order used to focus the first invalid field on submit. */
export const fieldOrder: readonly FieldName[] = ['name', 'email', 'message']

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function emptyValues(): FormValues {
  return { name: '', email: '', subject: contact.subjects[0], message: '', website: '' }
}

export function validateField(field: FieldName, values: FormValues): string | undefined {
  switch (field) {
    case 'name':
      return values.name.trim() ? undefined : contact.errors.name
    case 'email':
      return EMAIL.test(values.email.trim()) ? undefined : contact.errors.email
    case 'message':
      return values.message.trim().length >= contact.messageMin ? undefined : contact.errors.message
  }
}

export function validateAll(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  for (const field of fieldOrder) {
    const error = validateField(field, values)
    if (error) errors[field] = error
  }
  return errors
}

/** mailto: link with subject and body pre-filled (URL-encoded). */
export function buildMailto(to: string, values: FormValues): string {
  const subject = `${values.subject}: from ${values.name.trim()}`
  const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** Short handle shown next to each social link. */
export function socialHandle(href: string): string {
  if (href.startsWith('mailto:')) return href.slice('mailto:'.length)
  try {
    return new URL(href).pathname.replace(/^\/+|\/+$/g, '')
  } catch {
    return href
  }
}
