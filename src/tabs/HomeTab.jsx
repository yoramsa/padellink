import { useMemo } from 'react'
import MatchCard from '../components/MatchCard'
import Scoreboard from '../components/Scoreboard'
import { Empty, Skeleton } from '../components/ui'
import { isPast, relativeTime } from '../lib/helpers'

export default function HomeTab({ matches, me, loading, registerMatch, unregisterMatch, setMatchScore, submitRating, myRatingFor, setTab }) {
  const upcoming = useMemo(
    () => matches.filter((m) => m.mine && !isPast(m.starts_at)).slice(0, 3),
    [matches]
  )
  const openNear = useMemo(
    () =>
      matches
        .filter((m) => m.status === 'open' && !m.mine && !isPast(m.starts_at))
        .sort((a, b) => (a.venue?.city === me.city ? -1 : 1) - (b.venue?.city === me.city ? -1 : 1))
        .slice(0, 4),
    [matches, me.city]
  )
  const recent = useMemo(
    () => matches.filter((m) => m.status === 'played' && m.score_a != null).slice(0, 4),
    [matches]
  )

  if (loading) {
    return (
      <div className="px-4 pt-4 space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="pt-4">
      {/* Bandeau accueil */}
      <div className="mx-4 mb-4 rounded-pitch mow-stripes bg-grass border border-grass-light/25 p-4">
        <div className="text-xs text-chalk/50 uppercase tracking-widest">Salut</div>
        <div className="font-display text-2xl text-chalk tracking-wide">{me.full_name?.split(' ')[0]} 👋</div>
        <div className="text-sm text-chalk/60 mt-1">
          {upcoming.length > 0
            ? `Tu as ${upcoming.length} match${upcoming.length > 1 ? 's' : ''} à venir.`
            : 'Aucun match prévu — trouve-toi une équipe.'}
        </div>
      </div>

      <SectionTitle>À venir</SectionTitle>
      {upcoming.length === 0 ? (
        <Empty icon="🗓️">
          Rien de prévu.{' '}
          <button className="text-floodlight font-semibold" onClick={() => setTab('matches')}>
            Trouver un match
          </button>
        </Empty>
      ) : (
        upcoming.map((m) => (
          <MatchCard key={m.id} match={m} me={me} registerMatch={registerMatch} unregisterMatch={unregisterMatch} setMatchScore={setMatchScore} submitRating={submitRating} myRatingFor={myRatingFor} />
        ))
      )}

      <div className="flex items-center justify-between px-4 mt-4">
        <SectionTitle bare>Matchs ouverts près de moi</SectionTitle>
        <button className="text-xs text-floodlight font-semibold" onClick={() => setTab('matches')}>
          Tout voir
        </button>
      </div>
      {openNear.length === 0 ? (
        <Empty icon="⚽">Pas de match ouvert pour l'instant.</Empty>
      ) : (
        openNear.map((m) => (
          <MatchCard key={m.id} match={m} me={me} registerMatch={registerMatch} unregisterMatch={unregisterMatch} setMatchScore={setMatchScore} submitRating={submitRating} myRatingFor={myRatingFor} />
        ))
      )}

      <SectionTitle>Activité récente</SectionTitle>
      {recent.length === 0 ? (
        <Empty icon="📋">Pas encore de résultats.</Empty>
      ) : (
        <div className="mx-4 space-y-2">
          {recent.map((m) => (
            <div key={m.id} className="flex items-center gap-3 bg-grass rounded-xl border border-grass-light/15 px-3 py-2.5">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-chalk/60 truncate">{m.format} · {m.venue?.name}</div>
                <div className="text-[11px] text-chalk/40">{relativeTime(m.starts_at)}</div>
              </div>
              <Scoreboard scoreA={m.score_a} scoreB={m.score_b} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children, bare }) {
  if (bare) return <h2 className="font-display text-lg text-chalk/90 tracking-wide">{children}</h2>
  return <h2 className="font-display text-lg text-chalk/90 tracking-wide px-4 pt-4 pb-2">{children}</h2>
}
