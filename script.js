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

// Live Kathmandu clock
const clock = document.getElementById('ktm-time')

if (clock) {
  const format = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit' })
  const tick = () => { clock.textContent = format.format(new Date()) }
  tick()
  setInterval(tick, 15000)
}

// Career chart: position bars on a 2018 → next-January axis
const career = document.querySelector('.career')

if (career) {
  const now = new Date()
  const startYear = 2018
  const endYear = now.getFullYear() + 1
  const totalMonths = (endYear - startYear) * 12
  const monthIndex = (value) => {
    if (value === 'present') return (now.getFullYear() - startYear) * 12 + now.getMonth() + 1
    const [y, m] = value.split('-').map(Number)
    return (y - startYear) * 12 + m - 1
  }

  career.style.setProperty('--years', endYear - startYear)
  career.querySelectorAll('.bar').forEach((bar) => {
    const start = monthIndex(bar.dataset.start)
    const end = bar.dataset.end === 'present' ? monthIndex('present') : monthIndex(bar.dataset.end) + 1
    bar.style.left = `${(start / totalMonths) * 100}%`
    bar.style.width = `${((end - start) / totalMonths) * 100}%`
  })

  const axis = career.querySelector('.career-axis')
  for (let y = startYear; y < endYear; y++) {
    const label = document.createElement('span')
    label.textContent = y
    axis?.append(label)
  }
}

// Count-up for impact numbers
const countUp = (el) => {
  const target = Number(el.dataset.count)
  const started = performance.now()
  const step = (time) => {
    const progress = Math.min((time - started) / 1400, 1)
    el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// Scroll reveal (hero animates on load via CSS)
if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return
      target.classList.add('is-visible')
      target.querySelectorAll('[data-count]').forEach(countUp)
      observer.unobserve(target)
      setTimeout(() => {
        target.classList.remove('reveal-pending', 'is-visible')
        target.style.transitionDelay = ''
      }, 1800)
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

  document.querySelectorAll('.reveal').forEach((el) => {
    if (el.closest('.hero')) return
    const index = [...el.parentElement.children].indexOf(el)
    el.style.transitionDelay = `${(index % 4) * 80}ms`
    el.classList.add('reveal-pending')
    observer.observe(el)
  })
}
