import { useState, useMemo } from 'react'
import Avatar from '../components/Avatar'
import RankBadge from '../components/RankBadge'
import { Empty, Skeleton, Input, Modal } from '../components/ui'
import { POSITION_LABEL, POSITION_COLOR, FOOT_LABEL, MIN_RATINGS_TO_SHOW } from '../lib/constants'
import { perCriteriaAverages } from '../lib/helpers'

export default function PlayersTab({ profiles, ratingsByRated, loading }) {
  const [q, setQ] = useState('')
  const [pos, setPos] = useState('')
  const [view, setView] = useState(null)

  const filtered = useMemo(() => {
    let list = profiles
    if (q.trim()) list = list.filter((p) => p.full_name.toLowerCase().includes(q.toLowerCase()))
    if (pos) list = list.filter((p) => p.position === pos)
    return list
  }, [profiles, q, pos])

  if (loading) {
    return (
      <div className="px-4 pt-4 space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    )
  }

  return (
    <div className="pt-4">
      <h1 className="font-display text-2xl text-chalk tracking-wide px-4 mb-3">JOUEURS</h1>
      <div className="px-4 mb-3">
        <Input placeholder="Rechercher un joueur…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex gap-2 px-4 mb-3 overflow-x-auto no-scrollbar">
        {[{ key: '', label: 'Tous' }, { key: 'GK', label: 'Gardiens' }, { key: 'DEF', label: 'Défenseurs' }, { key: 'MID', label: 'Milieux' }, { key: 'FWD', label: 'Attaquants' }].map((f) => (
          <button
            key={f.key}
            onClick={() => setPos(f.key)}
            className={
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition ' +
              (pos === f.key ? 'bg-floodlight text-grass-deep border-floodlight' : 'text-chalk/60 border-chalk/15')
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty icon="🔍">Aucun joueur trouvé.</Empty>
      ) : (
        <div className="mx-4 rounded-pitch bg-grass border border-grass-light/20 overflow-hidden divide-y divide-chalk/6">
          {filtered.map((p, i) => (
            <button key={p.id} onClick={() => setView(p)} className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-chalk/3">
              <span className={'font-display text-base w-6 text-center ' + (i < 3 ? 'text-floodlight' : 'text-chalk/30')}>{i + 1}</span>
              <Avatar name={p.full_name} url={p.avatar_url} size={34} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-chalk truncate">{p.full_name}</div>
                <div className="text-[11px] text-chalk/45">
                  <span style={{ color: POSITION_COLOR[p.position] }}>{POSITION_LABEL[p.position]}</span> · {p.city}
                </div>
              </div>
              {p._rating != null && (
                <span className="num text-xs text-floodlight font-bold flex items-center gap-0.5">★ {p._rating.toFixed(1)}</span>
              )}
              <RankBadge points={p.points} rankName={p.rank} size={22} />
            </button>
          ))}
        </div>
      )}

      {view && <PlayerProfile player={view} ratingsReceived={ratingsByRated[view.id] || []} onClose={() => setView(null)} />}
    </div>
  )
}

function PlayerProfile({ player, ratingsReceived, onClose }) {
  const crit = perCriteriaAverages(ratingsReceived, player.position)
  const enough = ratingsReceived.length >= MIN_RATINGS_TO_SHOW
  const stats = [
    { label: 'Matchs', val: player.matches_played || 0 },
    { label: 'Victoires', val: player.wins || 0 },
    { label: 'Buts', val: player.goals || 0 },
    { label: 'Passes', val: player.assists || 0 },
  ]
  if (player.position === 'GK') stats.push({ label: 'Clean sheets', val: player.clean_sheets || 0 })

  return (
    <Modal title="Profil joueur" onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={player.full_name} url={player.avatar_url} size={56} ring={POSITION_COLOR[player.position]} />
        <div className="flex-1">
          <div className="text-lg font-semibold text-chalk">{player.full_name}</div>
          <div className="text-xs text-chalk/50">
            {POSITION_LABEL[player.position]} · {FOOT_LABEL[player.preferred_foot] || ''} · {player.city}
          </div>
        </div>
        <div className="text-center">
          <RankBadge points={player.points} rankName={player.rank} size={34} />
          <div className="num text-[11px] text-floodlight font-bold mt-0.5">{player.points} pts</div>
        </div>
      </div>

      {/* Note globale */}
      <div className="bg-grass-deep/50 rounded-xl p-3 border border-chalk/8 mb-3 text-center">
        {enough ? (
          <>
            <div className="font-display text-4xl text-floodlight">★ {player._rating?.toFixed(1)}</div>
            <div className="text-[11px] text-chalk/45">note globale · {ratingsReceived.length} notation{ratingsReceived.length > 1 ? 's' : ''}</div>
          </>
        ) : (
          <div className="text-xs text-chalk/40 py-2">Pas encore assez de notes (min. {MIN_RATINGS_TO_SHOW})</div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-grass-deep/50 rounded-xl p-2 border border-chalk/8 text-center">
            <div className="font-display text-2xl text-chalk num">{s.val}</div>
            <div className="text-[9px] text-chalk/40 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Détail critères */}
      {enough && (
        <div className="bg-grass-deep/50 rounded-xl p-3 border border-chalk/8">
          <div className="text-[11px] font-bold uppercase tracking-wide text-chalk/60 mb-2">Détail des notes</div>
          {crit.map((c) => (
            <div key={c.key} className="flex items-center gap-2 mb-2">
              <span className="text-xs text-chalk/70 w-28">{c.label}</span>
              <div className="flex-1 h-2 rounded-full bg-black/30 overflow-hidden">
                <div className="h-full rounded-full bg-floodlight" style={{ width: `${(c.avg / 5) * 100}%` }} />
              </div>
              <span className="num text-xs text-chalk w-7 text-right">{c.avg.toFixed(1)}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
