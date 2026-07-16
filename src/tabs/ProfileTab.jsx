import { useState, useMemo, useRef } from 'react'
import { supabase } from '../supabase'
import Avatar from '../components/Avatar'
import RankBadge from '../components/RankBadge'
import { Button, Modal, Field, Select, Confirm, useToast } from '../components/ui'
import { CITIES, POSITIONS, FEET, POSITION_LABEL, FOOT_LABEL, nextRank, rankFor } from '../lib/constants'
import { ratingScore } from '../lib/helpers'

export default function ProfileTab({ me, ratingsByRated, myRating, updateProfile, onSignOut }) {
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [confirmOut, setConfirmOut] = useState(false)
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const nr = nextRank(me.points)
  const cur = rankFor(me.points)
  const progress = nr ? Math.min(100, ((me.points - cur.min) / (nr.min - cur.min)) * 100) : 100

  // Progression : 12 derniers matchs notés
  const series = useMemo(() => {
    const rows = (ratingsByRated[me.id] || [])
      .map((r) => ({ t: new Date(r.created_at).getTime(), s: ratingScore(r) }))
      .filter((x) => x.s != null)
      .sort((a, b) => a.t - b.t)
    // regroupe par jour-match approximatif, garde 12 derniers
    const last = rows.slice(-12)
    return last.map((x) => x.s)
  }, [ratingsByRated, me.id])

  const stats = [
    { label: 'Matchs', val: me.matches_played || 0 },
    { label: 'Victoires', val: me.wins || 0 },
    { label: 'Buts', val: me.goals || 0 },
    { label: 'Passes', val: me.assists || 0 },
  ]
  if (me.position === 'GK') stats.push({ label: 'Clean sheets', val: me.clean_sheets || 0 })

  async function onPickAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `${me.id}/${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (error) {
      toast(error.message, 'err')
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    await updateProfile({ avatar_url: data.publicUrl })
    setUploading(false)
  }

  return (
    <div className="pt-4 pb-8">
      {/* Carte profil */}
      <div className="mx-4 rounded-pitch bg-grass border border-grass-light/25 p-5 mow-stripes">
        <div className="flex items-center gap-4">
          <button onClick={() => fileRef.current?.click()} className="relative">
            <Avatar name={me.full_name} url={me.avatar_url} size={64} ring="#FFC542" />
            <span className="absolute -bottom-1 -right-1 bg-floodlight text-grass-deep text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {uploading ? '…' : '✎'}
            </span>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickAvatar} />
          </button>
          <div className="flex-1">
            <div className="text-lg font-semibold text-chalk">{me.full_name}</div>
            <div className="text-xs text-chalk/50">
              {POSITION_LABEL[me.position]} · {FOOT_LABEL[me.preferred_foot]} · {me.city}
            </div>
          </div>
          <div className="text-center">
            <RankBadge points={me.points} rankName={me.rank} size={40} />
          </div>
        </div>

        {/* Progression de rang */}
        <div className="mt-4">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="font-semibold" style={{ color: cur.color }}>{cur.name}</span>
            <span className="num text-chalk/60">{me.points} pts{nr ? ` · ${nr.min - me.points} → ${nr.name}` : ' · max'}</span>
          </div>
          <div className="h-2 rounded-full bg-black/30 overflow-hidden">
            <div className="h-full rounded-full bg-floodlight" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Note globale + stats */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-grass rounded-pitch border border-grass-light/20 p-4 flex flex-col items-center justify-center">
          <div className="font-display text-4xl text-floodlight">{myRating != null ? `★ ${myRating.toFixed(1)}` : '—'}</div>
          <div className="text-[11px] text-chalk/45 mt-1">Note globale</div>
        </div>
        <div className="bg-grass rounded-pitch border border-grass-light/20 p-4 flex flex-col items-center justify-center">
          <div className="font-display text-4xl text-chalk num">{me.points}</div>
          <div className="text-[11px] text-chalk/45 mt-1">Points SoccerLink</div>
        </div>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="bg-grass rounded-xl border border-grass-light/15 p-2 text-center">
            <div className="font-display text-2xl text-chalk num">{s.val}</div>
            <div className="text-[9px] text-chalk/40 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progression */}
      <h2 className="font-display text-lg text-chalk/90 tracking-wide px-4 pt-5 pb-2">Progression</h2>
      <div className="mx-4 bg-grass rounded-pitch border border-grass-light/20 p-4">
        {series.length < 2 ? (
          <div className="text-xs text-chalk/40 text-center py-6">Joue et fais-toi noter pour voir ta courbe évoluer.</div>
        ) : (
          <ProgressionChart ratings={series} points={me.points} />
        )}
      </div>

      {/* Réglages */}
      <h2 className="font-display text-lg text-chalk/90 tracking-wide px-4 pt-5 pb-2">Réglages</h2>
      <div className="mx-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => setEditing(true)}>
          ⚙️ Modifier mon profil
        </Button>
        <Button variant="danger" className="w-full justify-start" onClick={() => setConfirmOut(true)}>
          ⏻ Se déconnecter
        </Button>
      </div>

      {editing && <EditProfileModal me={me} updateProfile={updateProfile} onClose={() => setEditing(false)} />}
      {confirmOut && (
        <Confirm
          msg="Se déconnecter de SoccerLink ?"
          confirmLabel="Déconnexion"
          onConfirm={onSignOut}
          onCancel={() => setConfirmOut(false)}
        />
      )}
    </div>
  )
}

function ProgressionChart({ ratings, points }) {
  const W = 300
  const H = 110
  const pad = 8
  const n = ratings.length
  const xs = (i) => pad + (i / (n - 1)) * (W - pad * 2)
  const ratingY = (v) => pad + (1 - (v - 1) / 4) * (H - pad * 2) // note 1..5
  // courbe points cumulés synthétique croissant vers total
  const cum = ratings.map((_, i) => Math.round((points * (i + 1)) / n))
  const maxCum = Math.max(1, ...cum)
  const cumY = (v) => pad + (1 - v / maxCum) * (H - pad * 2)

  const ratingPath = ratings.map((v, i) => `${i === 0 ? 'M' : 'L'}${xs(i)},${ratingY(v)}`).join(' ')
  const cumPath = cum.map((v, i) => `${i === 0 ? 'M' : 'L'}${xs(i)},${cumY(v)}`).join(' ')

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <path d={cumPath} fill="none" stroke="#F4F7F0" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d={ratingPath} fill="none" stroke="#FFC542" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {ratings.map((v, i) => (
          <circle key={i} cx={xs(i)} cy={ratingY(v)} r="2.5" fill="#FFC542" />
        ))}
      </svg>
      <div className="flex gap-4 justify-center mt-1 text-[10px]">
        <span className="flex items-center gap-1 text-floodlight">■ Note moyenne</span>
        <span className="flex items-center gap-1 text-chalk/50">▪ Points cumulés</span>
      </div>
    </div>
  )
}

function EditProfileModal({ me, updateProfile, onClose }) {
  const [city, setCity] = useState(me.city || '')
  const [position, setPosition] = useState(me.position || '')
  const [foot, setFoot] = useState(me.preferred_foot || 'right')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await updateProfile({ city, position, preferred_foot: foot })
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="Modifier mon profil" onClose={onClose}>
      <Field label="Ville">
        <Select value={city} onChange={(e) => setCity(e.target.value)}>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Poste">
        <div className="grid grid-cols-2 gap-2">
          {POSITIONS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPosition(p.key)}
              className={
                'py-2.5 rounded-xl text-sm font-semibold border transition ' +
                (position === p.key ? 'bg-floodlight text-grass-deep border-floodlight' : 'bg-grass-deep/50 text-chalk/70 border-chalk/12')
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Pied fort">
        <div className="flex gap-2">
          {FEET.map((f) => (
            <button
              key={f.key}
              onClick={() => setFoot(f.key)}
              className={
                'flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ' +
                (foot === f.key ? 'bg-grass-light text-chalk border-grass-light' : 'bg-grass-deep/50 text-chalk/70 border-chalk/12')
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </Field>
      <Button size="lg" disabled={saving} onClick={save}>
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </Button>
    </Modal>
  )
}
