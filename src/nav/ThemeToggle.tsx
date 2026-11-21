import { MoonIcon, SunIcon } from '../icons'
import { setTheme, useTheme } from '../theme'

export function ThemeToggle() {
  const theme = useTheme()
  const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'

  return (
    <button type="button" className="icon-button" aria-label={label} title={label}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}
