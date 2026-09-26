// Prints resume/resume.html to assets/Bibek-Gupta-Resume.pdf with a real text layer.
// Needs the `playwright` package (npm i playwright); uses the system Chromium if PW_CHROMIUM is set.
import { chromium } from 'playwright'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {})
const page = await browser.newPage()
await page.goto(pathToFileURL(path.join(root, 'resume', 'resume.html')).href)
await page.pdf({ path: path.join(root, 'assets', 'Bibek-Gupta-Resume.pdf'), format: 'A4', printBackground: false, preferCSSPageSize: true })
await browser.close()
console.log('wrote assets/Bibek-Gupta-Resume.pdf')
