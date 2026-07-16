// ── Formations : disposition des pastilles sur la carte-terrain ──
// Coordonnées par équipe dans sa propre moitié :
//   x : 0 (gauche) → 1 (droite)
//   depth : 0 (ligne de but) → 1 (ligne médiane)

const FORMATIONS = {
  '5v5': [
    { role: 'GK', x: 0.5, depth: 0.06 },
    { role: 'DEF', x: 0.3, depth: 0.34 },
    { role: 'DEF', x: 0.7, depth: 0.34 },
    { role: 'MID', x: 0.5, depth: 0.62 },
    { role: 'FWD', x: 0.5, depth: 0.88 },
  ],
  '7v7': [
    { role: 'GK', x: 0.5, depth: 0.06 },
    { role: 'DEF', x: 0.28, depth: 0.3 },
    { role: 'DEF', x: 0.72, depth: 0.3 },
    { role: 'MID', x: 0.22, depth: 0.58 },
    { role: 'MID', x: 0.5, depth: 0.58 },
    { role: 'MID', x: 0.78, depth: 0.58 },
    { role: 'FWD', x: 0.5, depth: 0.86 },
  ],
  '11v11': [
    { role: 'GK', x: 0.5, depth: 0.05 },
    { role: 'DEF', x: 0.16, depth: 0.26 },
    { role: 'DEF', x: 0.38, depth: 0.24 },
    { role: 'DEF', x: 0.62, depth: 0.24 },
    { role: 'DEF', x: 0.84, depth: 0.26 },
    { role: 'MID', x: 0.16, depth: 0.54 },
    { role: 'MID', x: 0.38, depth: 0.56 },
    { role: 'MID', x: 0.62, depth: 0.56 },
    { role: 'MID', x: 0.84, depth: 0.54 },
    { role: 'FWD', x: 0.36, depth: 0.82 },
    { role: 'FWD', x: 0.64, depth: 0.82 },
  ],
}

export function teamFormation(format) {
  return FORMATIONS[format] || FORMATIONS['5v5']
}

// Renvoie tous les emplacements du terrain complet (les deux équipes),
// en coordonnées portrait 0..1 (y=0 haut, y=1 bas).
// Équipe A défend le but du bas, équipe B celui du haut.
export function pitchSlots(format) {
  const base = teamFormation(format)
  const slots = []
  base.forEach((s, i) => {
    // Équipe A — moitié basse
    slots.push({ id: `A${i}`, team: 'A', role: s.role, x: s.x, y: 1 - s.depth * 0.5 })
  })
  base.forEach((s, i) => {
    // Équipe B — moitié haute, miroir horizontal
    slots.push({ id: `B${i}`, team: 'B', role: s.role, x: 1 - s.x, y: s.depth * 0.5 })
  })
  return slots
}

// Assigne des joueurs inscrits aux emplacements en respectant les postes.
// players: [{ id, full_name, avatar_url, position, team }]
// Renvoie une map slotId -> player (les emplacements sans joueur restent libres).
export function assignPlayersToSlots(format, players) {
  const slots = pitchSlots(format)
  const assigned = {}
  const usedPlayerIds = new Set()

  const teams = { A: [], B: [] }
  // Répartition : par team explicite sinon round-robin sur l'ordre d'inscription
  players.forEach((p, idx) => {
    const t = p.team === 'A' || p.team === 'B' ? p.team : idx % 2 === 0 ? 'A' : 'B'
    teams[t].push(p)
  })

  ;['A', 'B'].forEach((team) => {
    const teamSlots = slots.filter((s) => s.team === team)
    const pool = [...teams[team]]
    // 1er passage : correspondance de poste exacte
    teamSlots.forEach((slot) => {
      const idx = pool.findIndex((p) => p.position === slot.role && !usedPlayerIds.has(p.id))
      if (idx !== -1) {
        assigned[slot.id] = pool[idx]
        usedPlayerIds.add(pool[idx].id)
        pool.splice(idx, 1)
      }
    })
    // 2e passage : remplir les emplacements restants avec les joueurs restants
    teamSlots.forEach((slot) => {
      if (assigned[slot.id]) return
      const next = pool.find((p) => !usedPlayerIds.has(p.id))
      if (next) {
        assigned[slot.id] = next
        usedPlayerIds.add(next.id)
        pool.splice(pool.indexOf(next), 1)
      }
    })
  })

  return { slots, assigned }
}
