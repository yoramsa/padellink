import { useState, useMemo } from 'react'
import MatchCard from '../components/MatchCard'
import { Button, Modal, Field, Input, Select, Empty, Skeleton, useToast } from '../components/ui'
import { FORMATS, PER_TEAM, LEVELS } from '../lib/constants'
import { isPast } from '../lib/helpers'

const FILTERS = [
  { key: 'open', label: 'Ouverts' },
  { key: 'mine', label: 'Mes matchs' },
  { key: 'all', label: 'Tous' },
]

export default function MatchesTab({ matches, me, venues, loading, registerMatch, unregisterMatch, setMatchScore, submitRating, myRatingFor, createMatch }) {
  const [filter, setFilter] = useState('open')
  const [creating, setCreating] = useState(false)

  const shown = useMemo(() => {
    let list = matches.filter((m) => !isPast(m.starts_at) || m.mine || m.status === 'played')
    if (filter === 'open') list = matches.filter((m) => m.status === 'open' && !isPast(m.starts_at))
    if (filter === 'mine') list = matches.filter((m) => m.mine)
    return list
  }, [matches, filter])

  return (
    <div className="pt-3">
      <div className="flex items-center justify-between px-4 mb-2">
        <h1 className="font-display text-2xl text-chalk tracking-wide">MATCHS</h1>
        <Button size="sm" onClick={() => setCreating(true)}>
          + Créer
        </Button>
      </div>

      <div className="flex gap-2 px-4 mb-3 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition ' +
              (filter === f.key ? 'bg-floodlight text-grass-deep border-floodlight' : 'bg-transparent text-chalk/60 border-chalk/15')
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="px-4 space-y-4">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <Empty>Aucun match ici. Crée le premier !</Empty>
      ) : (
        shown.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            me={me}
            registerMatch={registerMatch}
            unregisterMatch={unregisterMatch}
            setMatchScore={setMatchScore}
            submitRating={submitRating}
            myRatingFor={myRatingFor}
          />
        ))
      )}

      {creating && <CreateMatchModal venues={venues} onClose={() => setCreating(false)} createMatch={createMatch} />}
    </div>
  )
}

function CreateMatchModal({ venues, onClose, createMatch }) {
  const toast = useToast()
  const [format, setFormat] = useState('5v5')
  const [venueId, setVenueId] = useState(venues[0]?.id || '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('19:00')
  const [price, setPrice] = useState('')
  const [level, setLevel] = useState('Intermédiaire')
  const [saving, setSaving] = useState(false)

  const ready = venueId && date && time

  async function submit() {
    if (!ready) {
      toast('Complète le terrain, la date et l\'heure', 'err')
      return
    }
    const starts_at = new Date(`${date}T${time}`).toISOString()
    setSaving(true)
    const res = await createMatch({
      format,
      venue_id: venueId,
      starts_at,
      price_per_player: price ? Number(price) : null,
      level,
    })
    setSaving(false)
    if (res) onClose()
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <Modal title="Créer un match" onClose={onClose}>
      <Field label="Format">
        <div className="grid grid-cols-3 gap-2">
          {FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={
                'py-3 rounded-xl font-display text-lg tracking-wide border transition ' +
                (format === f ? 'bg-floodlight text-grass-deep border-floodlight' : 'bg-grass-deep/50 text-chalk/70 border-chalk/12')
              }
            >
              {f}
            </button>
          ))}
        </div>
        <span className="block text-[11px] text-chalk/40 mt-1">{PER_TEAM[format] * 2} joueurs · {PER_TEAM[format]} par équipe</span>
      </Field>

      <Field label="Terrain">
        <Select value={venueId} onChange={(e) => setVenueId(e.target.value)}>
          <option value="">— Choisir un terrain —</option>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} · {v.city}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          <Input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Heure">
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Prix / joueur (₪)">
          <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="ex. 40" />
        </Field>
        <Field label="Niveau">
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Button size="lg" className="mt-2" disabled={!ready || saving} onClick={submit}>
        {saving ? 'Création…' : 'Créer le match'}
      </Button>
    </Modal>
  )
}
