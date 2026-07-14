import { MIN_RATINGS_TO_SHOW, ratingCriteria } from './constants'

export function sanitize(s) {
  return String(s || '').replace(/[<>]/g, '').trim()
}

export function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

// Couleur d'avatar déterministe à partir du nom
export function avatarHue(name) {
  let h = 0
  for (let i = 0; i < (name || '?').length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return h
}

const DAY = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
const MONTH = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']

export function formatMatchDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const isTomorrow = d.toDateString() === tomorrow.toDateString()
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  if (isToday) return `Aujourd'hui · ${time}`
  if (isTomorrow) return `Demain · ${time}`
  return `${DAY[d.getDay()]}. ${d.getDate()} ${MONTH[d.getMonth()]} · ${time}`
}

export function relativeTime(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return "à l'instant"
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`
  return `il y a ${Math.floor(diff / 86400)} j`
}

export function isPast(iso) {
  return new Date(iso).getTime() < Date.now()
}

// Moyenne d'une note (une ligne ratings) sur les 5 critères
export function ratingScore(row) {
  const vals = [row.c1, row.c2, row.c3, row.c4, row.c5].filter((v) => v != null)
  if (!vals.length) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

// Note globale d'un joueur à partir de ses notes reçues
export function overallRating(ratingsReceived) {
  const scores = ratingsReceived.map(ratingScore).filter((v) => v != null)
  if (scores.length < MIN_RATINGS_TO_SHOW) return null
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

// Moyenne par critère (pour le radar / détail profil)
export function perCriteriaAverages(ratingsReceived, position) {
  const crit = ratingCriteria(position)
  return crit.map((c) => {
    const vals = ratingsReceived.map((r) => r[c.key]).filter((v) => v != null)
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return { label: c.label, key: c.key, avg }
  })
}

// Lien WhatsApp de partage d'un match
export function whatsappShare(match, venueName) {
  const when = formatMatchDate(match.starts_at)
  const left = Math.max(0, match.slots - (match.registered || 0))
  const lines = [
    `⚽ Match ${match.format} sur SoccerLink`,
    `📍 ${venueName || 'Terrain'}`,
    `🗓️ ${when}`,
    left > 0 ? `🎽 ${left} place(s) libre(s) — rejoins-nous !` : '✅ Complet',
    match.price_per_player ? `💰 ${match.price_per_player} ₪ / joueur` : '',
  ].filter(Boolean)
  const url = `${window.location.origin}?match=${match.id}`
  const text = encodeURIComponent(lines.join('\n') + '\n\n' + url)
  return `https://wa.me/?text=${text}`
}

// Équilibrage des équipes par note moyenne (répartition serpentin)
export function balanceTeams(players) {
  const sorted = [...players].sort((a, b) => (b._rating || 2.5) - (a._rating || 2.5))
  const A = []
  const B = []
  let sumA = 0
  let sumB = 0
  for (const p of sorted) {
    if (sumA <= sumB) {
      A.push(p)
      sumA += p._rating || 2.5
    } else {
      B.push(p)
      sumB += p._rating || 2.5
    }
  }
  return { A, B }
}

export const STATUS_LABEL = {
  open: 'Ouvert',
  full: 'Complet',
  played: 'Joué',
  rated: 'Noté',
  cancelled: 'Annulé',
}
export const STATUS_COLOR = {
  open: '#FFC542',
  full: '#3FA972',
  played: '#c7ccd4',
  rated: '#5fe0c9',
  cancelled: '#E0492F',
}
