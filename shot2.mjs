import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
const dir = '/tmp/claude-0/-home-user-padellink/ad645ccc-6beb-5db1-9c4f-5bbb8b7f2610/scratchpad'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const p = await b.newPage({ viewport: { width: 430, height: 800 } })
const errs = []
p.on('pageerror', e => errs.push('PAGEERR: '+e.message))
await p.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 15000 })
await p.waitForTimeout(1500)
await p.screenshot({ path: dir + '/auth2-signin.png', fullPage: true })
await p.click('text=Créer un compte')
await p.waitForTimeout(400)
await p.screenshot({ path: dir + '/auth2-signup.png', fullPage: true })
console.log('ERRORS:', errs.length ? errs.join(' || ') : 'none')
await b.close()
