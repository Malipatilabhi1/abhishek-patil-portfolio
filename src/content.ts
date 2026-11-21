/**
 * Values still starting with this marker are treated as unset: helpers below
 * filter them out so no broken link ever renders.
 */
const TODO = 'TODO'

export const links = {
  github: 'https://github.com/malipatilabhi1',
  linkedin: 'https://www.linkedin.com/in/abhishek-patil-676393187',
  /** Plain address (no "mailto:"). */
  email: 'abhishekpatil12128@gmail.com',
  // TODO: add public/resume.pdf, then remove the "TODO: " prefix to enable resume links.
  resume: 'TODO: /resume.pdf',
} as const

export type LinkKey = keyof typeof links

export function isPlaceholder(value: string) {
  return value.trim().startsWith(TODO)
}

/** The configured value for a link, or null while it is still a TODO placeholder. */
export function getLink(key: LinkKey): string | null {
  const value = links[key]
  return isPlaceholder(value) ? null : value
}

export type SocialLink = {
  key: 'github' | 'linkedin' | 'email'
  label: string
  href: string
  external: boolean
}

/** Social links ready to render (href resolved, placeholders removed). */
export function getSocialLinks(): SocialLink[] {
  const email = getLink('email')
  const candidates: (SocialLink | null)[] = [
    toExternal('github', 'GitHub'),
    toExternal('linkedin', 'LinkedIn'),
    email ? { key: 'email', label: `Email ${email}`, href: `mailto:${email}`, external: false } : null,
  ]
  return candidates.filter((item): item is SocialLink => item !== null)
}

function toExternal(key: 'github' | 'linkedin', label: string): SocialLink | null {
  const href = getLink(key)
  return href ? { key, label, href, external: true } : null
}

export const site = {
  tagline: 'Full stack engineer building fast, accessible interfaces and the services behind them.',
  credit: 'Built with React, TypeScript & Three.js',
} as const

export const notFound = {
  title: 'Page not found',
  message: "This page wandered off. Let's get you back on track.",
} as const

/** "YYYY-MM", e.g. "2021-08". */
export type YearMonth = `${number}-${number}`

/** Single source of truth for the profile card and the hero role line. */
export const profile = {
  fullName: 'Abhishek Patil',
  role: 'Full Stack Engineer',
  location: 'Bengaluru, India',
  /** IANA zone, usable with Intl.DateTimeFormat for a live local-time display. */
  timeZone: 'Asia/Kolkata',
  careerStart: '2021-08' satisfies YearMonth,
  /** `short` labels keep the profile.ts card narrow (no line over ~32 characters). */
  stack: [
    { name: 'React', short: 'React' },
    { name: 'TypeScript', short: 'TS' },
    { name: 'Node.js', short: 'Node' },
  ],
  available: true,
} as const

function parseYearMonth(value: YearMonth) {
  const [year = 0, month = 1] = value.split('-').map(Number)
  return { year, month }
}

/** Whole years since profile.careerStart, so copy like "5+ years" stays current on its own. */
export function yearsOfExperience(now: Date = new Date()): number {
  const { year, month } = parseYearMonth(profile.careerStart)
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month)
  return Math.max(0, Math.floor(months / 12))
}

/** e.g. "5+ years". */
export function experienceLabel(now?: Date): string {
  return `${yearsOfExperience(now)}+ years`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

function formatYearMonth(value: YearMonth): string {
  const { year, month } = parseYearMonth(value)
  return `${MONTHS[month - 1] ?? ''} ${year}`.trim()
}

/** "Aug 2021 – Jul 2025", or "Aug 2025 – Present" when end is null. */
export function formatPeriod(start: YearMonth, end: YearMonth | null): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : 'Present'}`
}

export type Experience = {
  company: string
  role: string
  focus: string
  location: string
  start: YearMonth
  /** null while this is the current role. */
  end: YearMonth | null
  highlights: readonly string[]
  tech: readonly string[]
}

/** Newest first. */
export const experience: readonly Experience[] = [
  {
    company: 'Finonyx Software Solutions',
    role: 'Staff Developer',
    focus: 'Full Stack Development',
    location: 'Bengaluru',
    start: '2025-08',
    end: null,
    highlights: [
      'Build React and TypeScript interfaces, Node.js services and Oracle database changes for enterprise banking products.',
      'Migrating product interfaces from Chakra UI to Material UI with reusable, responsive components.',
      'Work onsite with client teams through UAT, fixes, deployments and releases.',
      'Trace API and IBM MQ failures through logs and SQL, then ship and verify the fix.',
      'Package and deploy on Linux with Docker, NGINX and PM2, using Bitbucket PRs and Git release tags.',
      'Mentor junior frontend developers on React, TypeScript, reusable components and Git workflows.',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'Oracle', 'Material UI', 'IBM MQ', 'Docker', 'NGINX'],
  },
  {
    company: 'JK Tech',
    role: 'Associate Consultant',
    focus: 'Frontend Development',
    location: 'Bengaluru',
    start: '2021-08',
    end: '2025-07',
    highlights: [
      'Built enterprise interfaces in React and Angular with TypeScript, Material UI and Angular Material.',
      'Created reusable components, dynamic forms, routing, search and pagination.',
      'Managed state and data flow with React Hooks, Context API, Angular services and RxJS.',
      'Integrated REST APIs and WebSocket updates alongside backend teams.',
      'Delivered features for a knowledge-graph platform and a recruitment application.',
    ],
    tech: ['React', 'Angular', 'TypeScript', 'RxJS', 'Material UI', 'REST APIs', 'MySQL'],
  },
]

export type ProjectKind = 'Professional' | 'Personal'
export type ProjectCategory = 'Banking' | 'Enterprise' | 'Personal'

export type ProjectLinks = {
  live?: string
  code?: string
}

export type Project = {
  slug: string
  title: string
  subtitle: string
  /** Employer or client; omitted for personal projects. */
  org?: string
  kind: ProjectKind
  /** Used by the Work page filters. */
  category: ProjectCategory
  /** One sentence. */
  summary: string
  /** Case-study Overview, 2–3 sentences: context, the problem, my part. The section is hidden when unset. */
  overview?: string
  /** Letter on the generated project artwork; defaults to the title's first letter. */
  monogram?: string
  highlights: readonly string[]
  tech: readonly string[]
  featured: boolean
  /** Client work under NDA: no screenshots, code or live links. */
  confidential: boolean
  links: ProjectLinks
}

export const projects: readonly Project[] = [
  {
    slug: 'mtmx',
    title: 'MTMX',
    subtitle: 'SWIFT MT/MX & CBPR+ messaging',
    org: 'Finonyx',
    kind: 'Professional',
    category: 'Banking',
    summary: 'Conversion and processing of cross-border payment messages between SWIFT MT and ISO 20022 MX / CBPR+ formats.',
    overview: 'A Finonyx banking product for cross-border payments, where messages move between SWIFT MT and ISO 20022 MX / CBPR+ formats. Every message has to be mapped field by field, pass XML schema validation and behave correctly across regional configurations. I enhanced the conversion and processing workflows, worked on field mapping and schema validation, and linked return messages to their original payment references.',
    highlights: [
      'Enhanced MT/MX and CBPR+ conversion and processing workflows across regional configurations.',
      'Worked on payment-message field mapping and XML schema validation.',
      'Linked return messages to their original payment references.',
    ],
    tech: ['Node.js', 'Oracle', 'IBM MQ', 'XML Schema'],
    featured: true,
    confidential: true,
    links: {},
  },
  {
    slug: 'kuber',
    title: 'Kuber',
    subtitle: 'Banking messaging platform',
    org: 'Finonyx',
    kind: 'Professional',
    category: 'Banking',
    summary: 'Messaging platform for bank operations teams, from approvals to reconciliation.',
    overview: 'Kuber is a Finonyx messaging platform for bank operations teams. Those teams need controlled approvals, secure sign-in and a way to check that reported message counts match what was actually processed. I built frontend and API changes for BIC mapping, maker-checker approvals and 2FA/OTP, implemented GHUB messaging workflows, and developed the reconciliation report on top of inward and outward message-event recording.',
    highlights: [
      'Built frontend and API changes for BIC mapping, maker-checker approvals and 2FA/OTP.',
      'Implemented GHUB messaging workflows.',
      'Developed a reconciliation report comparing reported and actual message counts, backed by message-event recording for inward and outward processing.',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'Oracle', 'Material UI'],
    featured: true,
    confidential: true,
    links: {},
  },
  {
    slug: 'jiva',
    title: 'JIVA',
    subtitle: 'Knowledge graph application',
    org: 'JK Tech',
    kind: 'Professional',
    category: 'Enterprise',
    summary: 'Data exploration interface for structured and unstructured knowledge-graph data.',
    overview: 'JIVA is a knowledge-graph application at JK Tech for exploring structured and unstructured data. Users needed to search, page through, upload and download that data, with updates arriving in real time. I built the tables, search, pagination and file handling, integrated REST APIs and WebSocket updates, and developed responsive Next.js interfaces.',
    highlights: [
      'Built tables, search, pagination and file upload/download for data exploration.',
      'Integrated REST APIs and real-time WebSocket updates.',
      'Developed responsive Next.js interfaces.',
    ],
    tech: ['React', 'Angular', 'Next.js', 'TypeScript', 'WebSockets'],
    featured: true,
    confidential: true,
    links: {},
  },
  {
    slug: 'recruitment',
    title: 'Recruitment Platform',
    subtitle: 'Hiring workflow application',
    org: 'JK Tech',
    kind: 'Professional',
    category: 'Enterprise',
    summary: 'End-to-end hiring workflows from job posting to interview.',
    overview: 'A JK Tech application that runs hiring end to end, from job posting to interview. Each stage (postings, candidate screening, profiles and interviews) needed its own module and validated data entry. I built those Angular modules and their dynamic, validated forms, and integrated them with Node.js services and MySQL data operations.',
    highlights: [
      'Built Angular modules for job postings, candidate screening, profiles and interviews.',
      'Created dynamic, validated forms.',
      'Integrated Node.js services and MySQL data operations.',
    ],
    tech: ['Angular', 'TypeScript', 'RxJS', 'Node.js', 'MySQL'],
    featured: false,
    confidential: true,
    links: {},
  },
  {
    slug: 'portfolio',
    title: 'This Portfolio',
    subtitle: '3D, motion-rich personal site',
    kind: 'Personal',
    category: 'Personal',
    summary: "The site you're on: React 19, React Three Fiber and Motion, tuned for performance and accessibility.",
    overview: "My personal site, built with React, TypeScript, Three.js, Motion and Vite. The challenge was making it 3D and motion-rich without hurting load speed or accessibility, so the 3D hero is lazy-loaded and never blocks first paint, and the site supports light/dark themes and reduced motion. I designed and built it myself; the code is open on GitHub.",
    monogram: 'P',
    highlights: [
      'Lazy-loaded 3D hero that never blocks first paint.',
      'Multi-page routing, light/dark themes, reduced-motion support.',
      'Built to score high on Lighthouse with zero layout shift.',
    ],
    tech: ['React', 'TypeScript', 'Three.js', 'Motion', 'Vite'],
    featured: true,
    confidential: false,
    links: { code: 'https://github.com/malipatilabhi1/abhishek-patil-portfolio' },
  },
]

/** A project's links with TODO placeholders removed (same rule as getLink). */
export function getProjectLinks(project: Project): ProjectLinks {
  const resolved: ProjectLinks = {}
  if (project.links.live && !isPlaceholder(project.links.live)) resolved.live = project.links.live
  if (project.links.code && !isPlaceholder(project.links.code)) resolved.code = project.links.code
  return resolved
}

export type SkillGroup = {
  name: string
  items: readonly string[]
}

export const skills: readonly SkillGroup[] = [
  { name: 'Languages', items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SQL'] },
  { name: 'Frontend', items: ['React', 'Angular', 'Next.js', 'Material UI', 'Angular Material', 'Redux Toolkit', 'RxJS'] },
  { name: 'Backend & data', items: ['Node.js', 'Express', 'REST APIs', 'WebSockets', 'Oracle', 'MySQL'] },
  { name: 'Banking & messaging', items: ['IBM MQ', 'SWIFT MT/MX', 'CBPR+', 'GHUB'] },
  { name: 'Delivery & tools', items: ['Docker', 'NGINX', 'PM2', 'Linux', 'Git', 'Bitbucket', 'Postman'] },
]

export type Education = {
  degree: string
  school: string
  start: number
  end: number
}

export const education: Education = {
  degree: 'B.E. in Computer Science',
  school: 'Sir M. Visvesvaraya College of Engineering, Raichur',
  start: 2016,
  end: 2020,
}

export type Recognition = {
  title: string
  org: string
  year: number
}

export const recognition: readonly Recognition[] = [
  { title: 'Q2 Spot Award', org: 'Finonyx', year: 2026 },
]

export const spokenLanguages: readonly string[] = ['English', 'Hindi', 'Kannada', 'Telugu']

// Defined after `profile`: the Experience intro calls experienceLabel(), which reads it.
export const chapters = [
  {
    path: '/work',
    title: 'Work',
    eyebrow: 'Selected work',
    intro: `${experienceLabel()} building enterprise and banking software. Client projects are described without code or data; this portfolio is open to explore.`,
  },
  {
    path: '/about',
    title: 'About',
    eyebrow: 'About me',
    intro: 'Full stack engineer in Bengaluru. I like building interfaces people enjoy using, and making sure the systems behind them hold up.',
  },
  {
    path: '/experience',
    title: 'Experience',
    eyebrow: 'Experience',
    intro: `${experienceLabel()} building and supporting enterprise web applications, from React interfaces to Node.js services, Oracle and IBM MQ.`,
  },
  { path: '/contact', title: 'Contact', eyebrow: 'Get in touch', intro: 'Have a role, a project or a question? I usually reply within a day.' },
] as const

export type AboutPhoto = {
  /** Path under public/, e.g. "/abhishek.webp". */
  src: string
  /** Intrinsic size, so the browser reserves space and nothing shifts. */
  width: number
  height: number
  alt: string
}

export type AboutService = {
  icon: 'frontend' | 'backend' | 'delivery'
  title: string
  text: string
}

export const about = {
  /**
   * Set to { src: '/abhishek.webp', width, height, alt } once public/abhishek.webp exists.
   * While null, the page shows the monogram card instead.
   */
  photo: null as AboutPhoto | null,
  story: [
    `I'm ${profile.fullName}, a full stack engineer based in Bengaluru. For ${experienceLabel()} I've built and supported enterprise web applications, most recently banking platforms that process cross-border payment messages.`,
    'I started on the frontend at JK Tech, building React and Angular interfaces for a knowledge-graph platform and a recruitment app. At Finonyx I work across the whole stack: Node.js services, Oracle, IBM MQ and Linux deployments, often onsite with client teams through UAT and releases.',
    'I care about interfaces that are fast, accessible and pleasant to use, and code the next developer can understand. I also mentor junior developers on React, TypeScript and Git.',
  ],
  languagesLabel: 'Languages I speak',
  servicesTitle: 'What I do',
  services: [
    { icon: 'frontend', title: 'Frontend', text: 'React, Angular and TypeScript interfaces with reusable components, forms and data-heavy views.' },
    { icon: 'backend', title: 'Backend & data', text: 'Node.js and Express services, REST APIs and Oracle/MySQL behind them.' },
    { icon: 'delivery', title: 'Delivery', text: 'Docker, NGINX and PM2 on Linux, UAT with clients, and production troubleshooting.' },
  ] satisfies AboutService[],
  toolboxTitle: 'Toolbox',
  learningTitle: 'Currently learning',
  // Edit this list as your focus changes; the page renders whatever is here.
  learning: [
    '3D on the web with React Three Fiber',
    'Motion design and micro-interactions',
    'Web performance and Core Web Vitals',
  ],
  cta: {
    title: "Let's build something",
    text: "Have a product that needs a fast, accessible interface and solid services behind it? Let's talk.",
  },
} as const

export const contact = {
  /**
   * A form backend URL (e.g. Formspree) that accepts a JSON POST. While null, submitting
   * opens the visitor's email app with the message pre-filled (mailto: to links.email).
   */
  formEndpoint: null as string | null,
  formTitle: 'Send a message',
  subjects: ['Job opportunity', 'Freelance project', 'Just saying hi'],
  messageMin: 20,
  messageMax: 2000,
  labels: {
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    submit: 'Send message',
    submitMailto: 'Open in email app',
    sending: 'Sending…',
  },
  errors: {
    name: 'Please enter your name.',
    email: 'Please enter a valid email address, like name@example.com.',
    message: 'Your message needs at least 20 characters.',
  },
  mailtoNote: 'This opens your email app with your message ready to send.',
  status: {
    mailto: 'Opening your email app with your message ready to send.',
    sent: 'Message sent. Thank you!',
    failed: "Something went wrong and your message wasn't sent.",
  },
  success: {
    title: 'Thanks, your message is on its way.',
    text: "I'll get back to you within a day.",
    again: 'Send another',
  },
  fallbackLead: 'You can also email me directly at',
  emailTitle: 'Email me directly',
  copy: { idle: 'Copy', done: 'Copied!', announce: 'Email address copied to clipboard.', selected: 'Email address selected. Press Ctrl+C to copy.' },
  socialTitle: 'Elsewhere',
  timeTitle: 'Local time',
  /** IST working hours: [start, end) in 24h. */
  workingHours: { start: 9, end: 19 },
  timeStatus: {
    working: "Working hours, I'll reply soon",
    outside: "Outside working hours, I'll reply tomorrow",
  },
  availableText: 'Available for work',
  resumeLabel: 'Download Resume',
} as const

export type HeadlineWord = { text: string; highlight?: boolean }

export const home = {
  name: 'Abhishek',
  greeting: "Hi, I'm Abhishek",
  role: `${profile.role} · ${profile.stack.map(({ name }) => name).join(', ')}`,
  headline: [
    [{ text: 'Interfaces' }, { text: 'with' }, { text: 'purpose.', highlight: true }],
    [{ text: 'Experiences' }, { text: 'with' }, { text: 'personality.', highlight: true }],
  ] satisfies HeadlineWord[][],
  // Years come from experienceLabel() so the copy never goes stale.
  description:
    `I build fast, accessible web apps with React and TypeScript, plus the Node.js services and databases behind them. ${experienceLabel()} shipping enterprise and banking software, with a real love for motion and detail.`,
} as const
