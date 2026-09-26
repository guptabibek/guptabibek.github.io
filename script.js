const root = document.documentElement
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const year = document.getElementById('year')

if (year) {
  year.textContent = new Date().getFullYear()
}

// Theme toggle: explicit choice is stored; otherwise follow the system setting.
const themeToggle = document.querySelector('.theme-toggle')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const currentTheme = () => root.dataset.theme || (prefersDark.matches ? 'dark' : 'light')
const syncThemeToggle = () => themeToggle?.setAttribute('aria-pressed', String(currentTheme() === 'dark'))

themeToggle?.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark'
  root.dataset.theme = next
  try { localStorage.setItem('theme', next) } catch {}
  syncThemeToggle()
})
prefersDark.addEventListener?.('change', syncThemeToggle)
syncThemeToggle()

// Mobile menu: links collapse behind a Menu button on small screens.
const header = document.querySelector('.site-header')
const menuToggle = document.querySelector('.menu-toggle')
const siteNav = document.getElementById('site-nav')
const setMenu = (open) => {
  header?.classList.toggle('menu-open', open)
  menuToggle?.setAttribute('aria-expanded', String(open))
  if (menuToggle) menuToggle.textContent = open ? 'Close' : 'Menu'
}

menuToggle?.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')))
siteNav?.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false) })
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header?.classList.contains('menu-open')) {
    setMenu(false)
    menuToggle?.focus()
  }
})

// Live Kathmandu clock
const clock = document.getElementById('ktm-time')

if (clock) {
  const format = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit' })
  const tick = () => { clock.textContent = `${format.format(new Date())} local time · UTC+5:45` }
  tick()
  setInterval(tick, 15000)
}

// Scroll reveal (hero animates on load via CSS)
if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return
      target.classList.add('is-visible')
      observer.unobserve(target)
      setTimeout(() => {
        target.classList.remove('reveal-pending', 'is-visible')
        target.style.transitionDelay = ''
      }, 1600)
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

  document.querySelectorAll('.reveal').forEach((el) => {
    if (el.closest('.hero')) return
    const index = [...el.parentElement.children].indexOf(el)
    el.style.transitionDelay = `${(index % 4) * 70}ms`
    el.classList.add('reveal-pending')
    observer.observe(el)
  })
}
