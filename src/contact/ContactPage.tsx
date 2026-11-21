import { chapters } from '../content'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { ContactForm } from './ContactForm'
import { ContactInfo } from './ContactInfo'

const chapter = chapters.find(({ path }) => path === '/contact')

export function ContactPage() {
  return (
    <div className="page site-width contact-page">
      <PageHeader title={chapter?.title ?? 'Contact'} eyebrow={chapter?.eyebrow} intro={chapter?.intro} />
      <div className="contact-grid">
        <Reveal className="contact-form-col">
          <ContactForm />
        </Reveal>
        <Reveal className="contact-info-col" delay={0.08}>
          <ContactInfo />
        </Reveal>
      </div>
    </div>
  )
}
