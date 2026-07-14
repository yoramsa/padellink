import { useState } from 'react'
import FieldCard from './FieldCard'
import Scoreboard from './Scoreboard'
import Avatar from './Avatar'
import RatingModal from './RatingModal'
import { Button, Modal } from './ui'
import { formatMatchDate, whatsappShare, STATUS_LABEL, STATUS_COLOR, balanceTeams } from '../lib/helpers'
import { POSITION_SHORT } from '../lib/constants'

export default function MatchCard({ match, me, registerMatch, unregisterMatch, setMatchScore, submitRating, myRatingFor }) {
  const [open, setOpen] = useState(false)
  const left = Math.max(0, match.slots - match.registered)
  const played = match.status === 'played' || match.status === 'rated'

  return (
    <div className="mx-4 mb-4 rounded-pitch bg-grass border border-grass-light/20 overflow-hidden shadow-soft">
      {/* En-tête */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-chalk tracking-wide">{match.format}</span>
            <span
              className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
              style={{ color: STATUS_COLOR[match.status], background: STATUS_COLOR[match.status] + '22' }}
            >
              {STATUS_LABEL[match.status]}
            </span>
          </div>
          <div className="text-xs text-chalk/55 mt-0.5">{formatMatchDate(match.starts_at)}</div>
        </div>
        <div className="text-right">
          <div className="num text-sm text-chalk">
            <span className="text-floodlight font-bold">{match.registered}</span>/{match.slots}
          </div>
          {left > 0 ? (
            <div className="text-[11px] text-floodlight font-semibold">{left} place{left > 1 ? 's' : ''}</div>
          ) : (
            <div className="text-[11px] text-grass-light font-semibold">Complet</div>
          )}
        </div>
      </div>

      {/* Terrain */}
      <button className="block w-full px-3" onClick={() => setOpen(true)} aria-label="Voir le match">
        <FieldCard
          format={match.format}
          players={match.players}
          meId={me.id}
          interactive={!match.mine && !played}
          onSlotTap={() => registerMatch(match)}
        />
      </button>

      {/* Pied */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="flex-1 text-xs text-chalk/55 truncate">📍 {match.venue?.name || 'Terrain'}</div>
        {played && match.score_a != null ? (
          <Scoreboard scoreA={match.score_a} scoreB={match.score_b} />
        ) : match.mine ? (
          <Button size="sm" variant="ghost" onClick={() => unregisterMatch(match)}>
            Se retirer
          </Button>
        ) : left > 0 ? (
          <Button size="sm" onClick={() => registerMatch(match)}>
            S'inscrire
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => registerMatch(match)}>
            Liste d'attente
          </Button>
        )}
      </div>

      {open && (
        <MatchDetail
          match={match}
          me={me}
          onClose={() => setOpen(false)}
          registerMatch={registerMatch}
          unregisterMatch={unregisterMatch}
          setMatchScore={setMatchScore}
          submitRating={submitRating}
          myRatingFor={myRatingFor}
        />
      )}
    </div>
  )
}

function MatchDetail({ match, me, onClose, registerMatch, unregisterMatch, setMatchScore, submitRating, myRatingFor }) {
  const [sa, setSa] = useState(match.score_a ?? '')
  const [sb, setSb] = useState(match.score_b ?? '')
  const [ratingTarget, setRatingTarget] = useState(null)
  const isCreator = match.creator_id === me.id
  const played = match.status === 'played' || match.status === 'rated'
  const left = Math.max(0, match.slots - match.registered)

  // Aperçu équilibrage
  const withTeam = match.players.some((p) => p.team)
  const teams = withTeam
    ? { A: match.players.filter((p) => p.team === 'A'), B: match.players.filter((p) => p.team === 'B') }
    : balanceTeams(match.players)

  return (
    <Modal title={`Match ${match.format}`} onClose={onClose}>
      <div className="text-sm text-chalk/70 mb-1">📍 {match.venue?.name} · {match.venue?.city}</div>
      <div className="text-sm text-chalk/70 mb-3">🗓️ {formatMatchDate(match.starts_at)}{match.price_per_player ? ` · 💰 ${match.price_per_player} ₪` : ''}{match.level ? ` · ${match.level}` : ''}</div>

      <FieldCard format={match.format} players={match.players} meId={me.id} interactive={false} animate={false} />

      {/* Actions inscription + partage */}
      <div className="flex gap-2 my-4">
        {match.mine ? (
          <Button variant="danger" className="flex-1" onClick={() => { unregisterMatch(match); onClose() }}>
            Se retirer
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => { registerMatch(match); onClose() }}>
            {left > 0 ? "S'inscrire" : "Liste d'attente"}
          </Button>
        )}
        <a href={whatsappShare(match, match.venue?.name)} target="_blank" rel="noreferrer" className="flex-1">
          <Button variant="grass" className="w-full">
            Partager WhatsApp
          </Button>
        </a>
      </div>

      {/* Équipes équilibrées */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {['A', 'B'].map((tk) => (
          <div key={tk} className="bg-grass-deep/50 rounded-xl p-3 border border-chalk/8">
            <div className="text-[11px] font-bold uppercase tracking-wide text-floodlight mb-2">Équipe {tk}</div>
            {teams[tk].length === 0 && <div className="text-xs text-chalk/40">—</div>}
            {teams[tk].map((p) => (
              <div key={p.id} className="flex items-center gap-2 mb-1.5">
                <Avatar name={p.full_name} url={p.avatar_url} size={24} />
                <span className="text-xs text-chalk truncate flex-1">{p.full_name}</span>
                <span className="text-[10px] text-chalk/40 num">{POSITION_SHORT[p.position] || ''}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Score (créateur) */}
      {isCreator && !played && (
        <div className="bg-grass-deep/50 rounded-xl p-3 border border-chalk/8 mb-3">
          <div className="text-[11px] font-bold uppercase tracking-wide text-chalk/60 mb-2">Saisir le score</div>
          <div className="flex items-center gap-3">
            <input type="number" min="0" value={sa} onChange={(e) => setSa(e.target.value)} className="w-full text-center font-display text-3xl bg-black/30 border border-chalk/15 rounded-xl py-2 text-chalk num" placeholder="A" />
            <span className="font-display text-2xl text-chalk/40">:</span>
            <input type="number" min="0" value={sb} onChange={(e) => setSb(e.target.value)} className="w-full text-center font-display text-3xl bg-black/30 border border-chalk/15 rounded-xl py-2 text-chalk num" placeholder="B" />
          </div>
          <Button className="w-full mt-3" disabled={sa === '' || sb === ''} onClick={() => setMatchScore(match, Number(sa), Number(sb))}>
            Valider le score
          </Button>
        </div>
      )}

      {/* Notation après match */}
      {played && (
        <div className="bg-grass-deep/50 rounded-xl p-3 border border-chalk/8">
          <div className="text-[11px] font-bold uppercase tracking-wide text-chalk/60 mb-2">Noter les joueurs</div>
          {match.players.filter((p) => p.id !== me.id).map((p) => {
            const done = myRatingFor(match.id, p.id)
            return (
              <button key={p.id} onClick={() => setRatingTarget(p)} className="flex items-center gap-2 w-full py-1.5 text-left">
                <Avatar name={p.full_name} url={p.avatar_url} size={26} />
                <span className="text-xs text-chalk flex-1 truncate">{p.full_name}</span>
                <span className={'text-[11px] font-semibold ' + (done ? 'text-grass-light' : 'text-floodlight')}>{done ? '✓ Noté' : 'Noter'}</span>
              </button>
            )
          })}
        </div>
      )}

      {ratingTarget && (
        <RatingModal
          target={ratingTarget}
          matchId={match.id}
          existing={myRatingFor(match.id, ratingTarget.id)}
          submitRating={submitRating}
          onClose={() => setRatingTarget(null)}
        />
      )}
    </Modal>
  )
}
