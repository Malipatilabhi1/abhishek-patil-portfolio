import { Link, NavLink } from 'react-router'
import { getSocialLinks, home, site } from '../content'
import { navigation } from '../nav/navigation'
import { socialIcons } from '../socialIcons'

// Computed once per page load; a footer year never needs to change mid-session.
const year = new Date().getFullYear()

export function Footer() {
  const socials = getSocialLinks()

  return (
    <footer className="site-footer">
      <div className="site-width">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand" to="/">
              <span className="brand-mark" aria-hidden="true">A</span>
              <span>{home.name}<span className="sr-only">, Home</span></span>
            </Link>
            <p className="footer-tagline">{site.tagline}</p>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            <ul>
              {navigation.map(({ path, title }) => (
                <li key={path}><NavLink to={path} end={path === '/'}>{title}</NavLink></li>
              ))}
            </ul>
          </nav>

          {socials.length > 0 && (
            <ul className="footer-social" aria-label="Social links">
              {socials.map(({ key, label, href, external }) => {
                const Icon = socialIcons[key]
                const name = external ? `${label} (opens in a new tab)` : label
                return (
                  <li key={key}>
                    <a className="icon-button" href={href} aria-label={name} title={label}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <Icon />
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="footer-bottom">
          <p>© {year} {home.name}</p>
          <p>{site.credit}</p>
        </div>
      </div>
    </footer>
  )
}
