// ── SoccerLink — constantes métier ──

export const CITIES = [
  'Tel Aviv', 'Jerusalem', 'Haifa', 'Rishon LeZion', 'Petah Tikva', 'Ashdod',
  'Beer Sheva', 'Netanya', 'Holon', 'Bnei Brak', 'Rehovot', 'Bat Yam',
  'Ramat Gan', 'Ashkelon', 'Herzliya', 'Kfar Saba', "Modi'in", "Ra'anana",
  'Hadera', 'Lod', 'Eilat', 'Nahariya', 'Akko', 'Tiberias', 'Nazareth',
  'Givatayim', 'Ness Ziona', 'Rosh HaAyin', 'Hod HaSharon', 'Ramat HaSharon',
]

export const FORMATS = ['5v5', '7v7', '11v11']

// Nombre de joueurs par équipe selon le format
export const PER_TEAM = { '5v5': 5, '7v7': 7, '11v11': 11 }

// Postes
export const POSITIONS = [
  { key: 'GK', label: 'Gardien', short: 'GAR' },
  { key: 'DEF', label: 'Défenseur', short: 'DEF' },
  { key: 'MID', label: 'Milieu', short: 'MIL' },
  { key: 'FWD', label: 'Attaquant', short: 'ATT' },
]
export const POSITION_LABEL = { GK: 'Gardien', DEF: 'Défenseur', MID: 'Milieu', FWD: 'Attaquant' }
export const POSITION_SHORT = { GK: 'GAR', DEF: 'DEF', MID: 'MIL', FWD: 'ATT' }
export const POSITION_COLOR = { GK: '#FFC542', DEF: '#1B7A4F', MID: '#3FA972', FWD: '#E0492F' }

export const FEET = [
  { key: 'left', label: 'Gauche' },
  { key: 'right', label: 'Droit' },
  { key: 'both', label: 'Les deux' },
]
export const FOOT_LABEL = { left: 'Pied gauche', right: 'Pied droit', both: 'Ambidextre' }

export const LEVELS = ['Débutant', 'Intermédiaire', 'Confirmé', 'Avancé', 'Expert']

// Critères de notation adaptés au poste
export const RATING_CRITERIA = {
  field: [
    { key: 'c1', label: 'Technique' },
    { key: 'c2', label: 'Physique' },
    { key: 'c3', label: 'Vision de jeu' },
    { key: 'c4', label: 'Défense' },
    { key: 'c5', label: 'Finition' },
  ],
  GK: [
    { key: 'c1', label: 'Réflexes' },
    { key: 'c2', label: 'Jeu au pied' },
    { key: 'c3', label: 'Placement' },
    { key: 'c4', label: 'Sortie aérienne' },
    { key: 'c5', label: 'Communication' },
  ],
}
export function ratingCriteria(position) {
  return position === 'GK' ? RATING_CRITERIA.GK : RATING_CRITERIA.field
}

// Système de points SoccerLink
export const POINTS = {
  win: 30,
  draw: 10,
  loss: 5,
  perGoal: 4,
  perAssist: 3,
  cleanSheet: 6,
  goodRatingBonus: 8, // note moyenne > 4/5 sur le match
}

// Rangs — écussons de club
export const RANKS = [
  { name: 'Bronze', min: 0, color: '#b8763e', ring: '#8a5a2e' },
  { name: 'Argent', min: 300, color: '#c7ccd4', ring: '#9aa0aa' },
  { name: 'Or', min: 800, color: '#FFC542', ring: '#d99e1f' },
  { name: 'Platine', min: 1800, color: '#5fe0c9', ring: '#2fb8a0' },
  { name: 'Légende', min: 3500, color: '#f472b6', ring: '#c94f92' },
]
export function rankFor(points) {
  let r = RANKS[0]
  for (const rk of RANKS) if (points >= rk.min) r = rk
  return r
}
export function nextRank(points) {
  return RANKS.find((r) => r.min > points) || null
}

export const MIN_RATINGS_TO_SHOW = 3
