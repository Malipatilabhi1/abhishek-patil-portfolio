import type { ComponentType, SVGProps } from 'react'
import type { SocialLink } from './content'
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons'

/** One icon per social link key; shared by the footer and the Contact page. */
export const socialIcons: Record<SocialLink['key'], ComponentType<SVGProps<SVGSVGElement>>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: MailIcon,
}
