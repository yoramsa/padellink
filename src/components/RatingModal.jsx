import { useState } from 'react'
import { Modal, Button } from './ui'
import Avatar from './Avatar'
import { ratingCriteria } from '../lib/constants'

export default function RatingModal({ target, matchId, existing, submitRating, onClose }) {
  const crit = ratingCriteria(target.position)
  const [vals, setVals] = useState(() => {
    const init = {}
    crit.forEach((c) => (init[c.key] = existing?.[c.key] || 0))
    return init
  })
  const [saving, setSaving] = useState(false)
  const complete = crit.every((c) => vals[c.key] > 0)

  async function save() {
    setSaving(true)
    await submitRating(matchId, target.id, vals)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="Noter le joueur" onClose={onClose}>
      <div className="flex items-center gap-3 mb-5">
        <Avatar name={target.full_name} url={target.avatar_url} size={44} />
        <div>
          <div className="text-chalk font-semibold">{target.full_name}</div>
          <div className="text-xs text-chalk/50">{target.position === 'GK' ? 'Gardien' : 'Joueur de champ'}</div>
        </div>
      </div>

      {crit.map((c) => (
        <div key={c.key} className="flex items-center justify-between mb-3">
          <span className="text-sm text-chalk/80">{c.label}</span>
          <Stars value={vals[c.key]} onChange={(v) => setVals((s) => ({ ...s, [c.key]: v }))} />
        </div>
      ))}

      <Button size="lg" className="mt-3" disabled={!complete || saving} onClick={save}>
        {saving ? 'Envoi…' : existing ? 'Mettre à jour' : 'Envoyer la note'}
      </Button>
    </Modal>
  )
}

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className="text-xl leading-none transition active:scale-90"
          style={{ color: n <= value ? '#FFC542' : 'rgba(244,247,240,0.2)' }}
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
