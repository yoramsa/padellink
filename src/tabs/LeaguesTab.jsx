import { useState, useMemo } from 'react'
import { Empty, Skeleton, Button, Modal, Field, Input, Select } from '../components/ui'
import Avatar from '../components/Avatar'
import RankBadge from '../components/RankBadge'
import { FORMATS } from '../lib/constants'

export default function LeaguesTab({ leagues, standings, profilesById, profiles, loading, createLeague }) {
  const [selected, setSelected] = useState(null)
  const [creating, setCreating] = useState(false)
  const league = leagues.find((l) => l.id === selected)

  if (loading) {
    return (
      <div className="px-4 pt-4 space-y-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    )
  }

  if (league) {
    return (
      <LeagueView
        league={league}
        standings={standings.filter((s) => s.league_id === league.id)}
        profilesById={profilesById}
        profiles={profiles}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h1 className="font-display text-2xl text-chalk tracking-wide">LIGUES</h1>
        <Button size="sm" onClick={() => setCreating(true)}>
          + Créer
        </Button>
      </div>

      {leagues.length === 0 ? (
        <Empty icon="🏆">Aucune ligue. Lance la première !</Empty>
      ) : (
        <div className="px-4 space-y-3">
          {leagues.map((l) => {
            const count = standings.filter((s) => s.league_id === l.id).length
            return (
              <button
                key={l.id}
                onClick={() => setSelected(l.id)}
                className="w-full text-left bg-grass rounded-pitch border border-grass-light/20 p-4 mow-stripes hover:border-grass-light/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-chalk tracking-wide">{l.name}</span>
                  {l.format && <span className="text-[11px] font-bold text-floodlight bg-floodlight/15 px-2 py-0.5 rounded">{l.format}</span>}
                </div>
                <div className="text-xs text-chalk/50 mt-1">
                  {l.season || 'Saison en cours'} · {count} joueur{count > 1 ? 's' : ''}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {creating && <CreateLeagueModal onClose={() => setCreating(false)} createLeague={createLeague} onCreated={(l) => { setCreating(false); setSelected(l.id) }} />}
    </div>
  )
}

function LeagueView({ league, standings, profilesById, profiles, onBack }) {
  const [view, setView] = useState('league')

  const rows = useMemo(
    () =>
      [...standings]
        .map((s) => ({ ...s, player: profilesById[s.player_id], diff: s.goals_for - s.goals_against }))
        .sort((a, b) => b.points - a.points || b.diff - a.diff),
    [standings, profilesById]
  )

  const individual = useMemo(() => profiles.slice(0, 30), [profiles])

  return (
    <div className="pt-4">
      <button onClick={onBack} className="text-sm text-floodlight px-4 mb-2">
        ← Ligues
      </button>
      <div className="px-4 mb-3">
        <h1 className="font-display text-2xl text-chalk tracking-wide">{league.name}</h1>
        <div className="text-xs text-chalk/50">{league.season} · {league.format}</div>
      </div>

      <div className="flex gap-2 px-4 mb-3">
        {[
          { k: 'league', l: 'Classement ligue' },
          { k: 'indiv', l: 'Classement individuel' },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setView(t.k)}
            className={
              'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ' +
              (view === t.k ? 'bg-floodlight text-grass-deep border-floodlight' : 'text-chalk/60 border-chalk/15')
            }
          >
            {t.l}
          </button>
        ))}
      </div>

      {view === 'league' ? (
        rows.length === 0 ? (
          <Empty icon="📊">Pas encore de classement.</Empty>
        ) : (
          <div className="mx-4 rounded-pitch bg-grass border border-grass-light/20 overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-xs num">
                <thead>
                  <tr className="text-chalk/40 text-[10px] uppercase">
                    <th className="text-left font-semibold py-2 pl-3">#</th>
                    <th className="text-left font-semibold">Joueur</th>
                    {['J', 'G', 'N', 'P', 'BP', 'BC', 'Diff', 'Pts'].map((h) => (
                      <th key={h} className="font-semibold px-1.5 text-center">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.player_id} className="border-t border-chalk/6">
                      <td className={'py-2 pl-3 font-display text-base ' + (i === 0 ? 'text-floodlight' : 'text-chalk/40')}>{i + 1}</td>
                      <td className="pr-2">
                        <div className="flex items-center gap-1.5 max-w-[110px]">
                          <Avatar name={r.player?.full_name} url={r.player?.avatar_url} size={20} />
                          <span className="text-chalk truncate text-[11px]" style={{ fontFamily: 'Inter' }}>{r.player?.full_name || '—'}</span>
                        </div>
                      </td>
                      <td className="text-center text-chalk/70">{r.played}</td>
                      <td className="text-center text-chalk/70">{r.won}</td>
                      <td className="text-center text-chalk/70">{r.drawn}</td>
                      <td className="text-center text-chalk/70">{r.lost}</td>
                      <td className="text-center text-chalk/70">{r.goals_for}</td>
                      <td className="text-center text-chalk/70">{r.goals_against}</td>
                      <td className="text-center text-chalk/70">{r.diff > 0 ? '+' : ''}{r.diff}</td>
                      <td className="text-center font-bold text-floodlight px-1.5">{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="mx-4 rounded-pitch bg-grass border border-grass-light/20 overflow-hidden divide-y divide-chalk/6">
          {individual.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2.5">
              <span className={'font-display text-lg w-6 text-center ' + (i < 3 ? 'text-floodlight' : 'text-chalk/40')}>{i + 1}</span>
              <Avatar name={p.full_name} url={p.avatar_url} size={30} />
              <span className="text-sm text-chalk flex-1 truncate">{p.full_name}</span>
              <RankBadge points={p.points} rankName={p.rank} size={22} />
              <span className="num text-sm font-bold text-floodlight w-14 text-right">{p.points} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CreateLeagueModal({ onClose, createLeague, onCreated }) {
  const [name, setName] = useState('')
  const [format, setFormat] = useState('7v7')
  const [season, setSeason] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit() {
    if (name.trim().length < 3) return
    setSaving(true)
    const l = await createLeague({ name: name.trim().slice(0, 60), format, season: season.trim() || null })
    setSaving(false)
    if (l) onCreated(l)
  }

  return (
    <Modal title="Créer une ligue" onClose={onClose}>
      <Field label="Nom de la ligue">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex. Ligue Tel Aviv Amateur" maxLength={60} />
      </Field>
      <Field label="Format">
        <Select value={format} onChange={(e) => setFormat(e.target.value)}>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Saison">
        <Input value={season} onChange={(e) => setSeason(e.target.value)} placeholder="ex. Été 2026" />
      </Field>
      <Button size="lg" disabled={name.trim().length < 3 || saving} onClick={submit}>
        {saving ? 'Création…' : 'Créer la ligue'}
      </Button>
    </Modal>
  )
}
