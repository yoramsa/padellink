import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { supabase } from './supabase'
import { PER_TEAM } from './lib/constants'
import { overallRating } from './lib/helpers'
import { ToastProvider, useToast } from './components/ui'
import BottomNav from './components/BottomNav'
import RankBadge from './components/RankBadge'
import HomeTab from './tabs/HomeTab'
import MatchesTab from './tabs/MatchesTab'
import LeaguesTab from './tabs/LeaguesTab'
import PlayersTab from './tabs/PlayersTab'
import ProfileTab from './tabs/ProfileTab'

export default function SoccerLink(props) {
  return (
    <ToastProvider>
      <Shell {...props} />
    </ToastProvider>
  )
}

function Shell({ session, player, onSignOut, pendingMatchId, onClearPendingMatch }) {
  const toast = useToast()
  const [tab, setTab] = useState('home')
  const [me, setMe] = useState(player)
  const [profiles, setProfiles] = useState([])
  const [venues, setVenues] = useState([])
  const [matches, setMatches] = useState([])
  const [matchPlayers, setMatchPlayers] = useState([])
  const [ratings, setRatings] = useState([])
  const [leagues, setLeagues] = useState([])
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [focusMatchId, setFocusMatchId] = useState(pendingMatchId || null)
  const reloadTimer = useRef(null)

  const loadAll = useCallback(async () => {
    const [p, v, m, mp, r, l, s] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('venues').select('*'),
      supabase.from('matches').select('*').neq('status', 'cancelled').order('starts_at', { ascending: true }),
      supabase.from('match_players').select('*'),
      supabase.from('ratings').select('*'),
      supabase.from('leagues').select('*').order('created_at', { ascending: false }),
      supabase.from('league_standings').select('*'),
    ])
    if (p.data) setProfiles(p.data)
    if (v.data) setVenues(v.data)
    if (m.data) setMatches(m.data)
    if (mp.data) setMatchPlayers(mp.data)
    if (r.data) setRatings(r.data)
    if (l.data) setLeagues(l.data)
    if (s.data) setStandings(s.data)
    const mine = p.data?.find((x) => x.id === session.user.id)
    if (mine) setMe(mine)
    setLoading(false)
  }, [session.user.id])

  const reloadLight = useCallback(async () => {
    const [m, mp] = await Promise.all([
      supabase.from('matches').select('*').neq('status', 'cancelled').order('starts_at', { ascending: true }),
      supabase.from('match_players').select('*'),
    ])
    if (m.data) setMatches(m.data)
    if (mp.data) setMatchPlayers(mp.data)
  }, [])

  useEffect(() => {
    loadAll()
    // Realtime : inscriptions aux matchs en direct
    const ch = supabase
      .channel('sl-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'match_players' }, () => {
        clearTimeout(reloadTimer.current)
        reloadTimer.current = setTimeout(reloadLight, 350)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        clearTimeout(reloadTimer.current)
        reloadTimer.current = setTimeout(reloadLight, 350)
      })
      .subscribe()
    return () => {
      clearTimeout(reloadTimer.current)
      supabase.removeChannel(ch)
    }
  }, [loadAll, reloadLight])

  // ── Données dérivées ──
  const profilesById = useMemo(() => Object.fromEntries(profiles.map((p) => [p.id, p])), [profiles])
  const venuesById = useMemo(() => Object.fromEntries(venues.map((v) => [v.id, v])), [venues])

  const ratingsByRated = useMemo(() => {
    const map = {}
    for (const r of ratings) (map[r.rated_id] ||= []).push(r)
    return map
  }, [ratings])

  const playersEnriched = useMemo(
    () =>
      profiles.map((p) => ({ ...p, _rating: overallRating(ratingsByRated[p.id] || []) })).sort((a, b) => b.points - a.points),
    [profiles, ratingsByRated]
  )

  const mpByMatch = useMemo(() => {
    const map = {}
    for (const mp of matchPlayers) (map[mp.match_id] ||= []).push(mp)
    return map
  }, [matchPlayers])

  const enrichedMatches = useMemo(() => {
    return matches.map((m) => {
      const rows = mpByMatch[m.id] || []
      const active = rows.filter((r) => !r.is_waitlisted)
      const waitlist = rows.filter((r) => r.is_waitlisted)
      const players = active
        .map((r) => {
          const prof = profilesById[r.player_id]
          return prof ? { ...prof, team: r.team, _mp: r } : null
        })
        .filter(Boolean)
      return {
        ...m,
        venue: venuesById[m.venue_id],
        players,
        waitlistCount: waitlist.length,
        registered: active.length,
        mine: rows.some((r) => r.player_id === session.user.id),
        myRow: rows.find((r) => r.player_id === session.user.id) || null,
      }
    })
  }, [matches, mpByMatch, profilesById, venuesById, session.user.id])

  // ── Actions ──
  const registerMatch = useCallback(
    async (match) => {
      const full = match.registered >= match.slots
      const { error } = await supabase.from('match_players').insert({
        match_id: match.id,
        player_id: session.user.id,
        is_waitlisted: full,
      })
      if (error) return toast(error.message.includes('duplicate') ? 'Déjà inscrit' : error.message, 'err')
      toast(full ? "Ajouté à la liste d'attente ⏳" : 'Inscrit au match ⚽', 'ok')
      // passe le match en "full" si complet
      if (!full && match.registered + 1 >= match.slots && match.status === 'open') {
        await supabase.from('matches').update({ status: 'full' }).eq('id', match.id)
      }
      reloadLight()
    },
    [session.user.id, toast, reloadLight]
  )

  const unregisterMatch = useCallback(
    async (match) => {
      const { error } = await supabase.from('match_players').delete().eq('match_id', match.id).eq('player_id', session.user.id)
      if (error) return toast(error.message, 'err')
      toast('Désinscrit', 'info')
      if (match.status === 'full') await supabase.from('matches').update({ status: 'open' }).eq('id', match.id)
      reloadLight()
    },
    [session.user.id, toast, reloadLight]
  )

  const createMatch = useCallback(
    async (payload) => {
      const { data, error } = await supabase
        .from('matches')
        .insert({ ...payload, creator_id: session.user.id, slots: PER_TEAM[payload.format] * 2 })
        .select()
        .single()
      if (error) {
        toast(error.message, 'err')
        return null
      }
      // le créateur s'inscrit automatiquement
      await supabase.from('match_players').insert({ match_id: data.id, player_id: session.user.id })
      toast('Match créé ⚽', 'ok')
      await reloadLight()
      setFocusMatchId(data.id)
      return data
    },
    [session.user.id, toast, reloadLight]
  )

  const setMatchScore = useCallback(
    async (match, scoreA, scoreB) => {
      const { error } = await supabase
        .from('matches')
        .update({ score_a: scoreA, score_b: scoreB, status: 'played' })
        .eq('id', match.id)
      if (error) return toast(error.message, 'err')
      toast('Score enregistré 📋', 'ok')
      reloadLight()
    },
    [toast, reloadLight]
  )

  const submitRating = useCallback(
    async (matchId, ratedId, values) => {
      const { error } = await supabase
        .from('ratings')
        .upsert({ match_id: matchId, rater_id: session.user.id, rated_id: ratedId, ...values }, { onConflict: 'match_id,rater_id,rated_id' })
      if (error) return toast(error.message, 'err')
      toast('Note envoyée ⭐', 'ok')
      const { data } = await supabase.from('ratings').select('*')
      if (data) setRatings(data)
    },
    [session.user.id, toast]
  )

  const updateProfile = useCallback(
    async (updates) => {
      const { error } = await supabase.from('profiles').update(updates).eq('id', session.user.id)
      if (error) return toast(error.message, 'err')
      setMe((m) => ({ ...m, ...updates }))
      setProfiles((ps) => ps.map((p) => (p.id === session.user.id ? { ...p, ...updates } : p)))
      toast('Profil mis à jour', 'ok')
    },
    [session.user.id, toast]
  )

  const createLeague = useCallback(
    async (payload) => {
      const { data, error } = await supabase.from('leagues').insert({ ...payload, admin_id: session.user.id }).select().single()
      if (error) return toast(error.message, 'err')
      toast('Ligue créée 🏆', 'ok')
      setLeagues((l) => [data, ...l])
      return data
    },
    [session.user.id, toast]
  )

  const myRatingFor = useCallback(
    (matchId, ratedId) => ratings.find((r) => r.match_id === matchId && r.rater_id === session.user.id && r.rated_id === ratedId) || null,
    [ratings, session.user.id]
  )

  useEffect(() => {
    if (pendingMatchId) {
      setTab('matches')
      onClearPendingMatch?.()
    }
  }, [pendingMatchId, onClearPendingMatch])

  const shared = {
    me,
    session,
    profiles: playersEnriched,
    profilesById,
    venues,
    matches: enrichedMatches,
    leagues,
    standings,
    ratings,
    ratingsByRated,
    loading,
    registerMatch,
    unregisterMatch,
    createMatch,
    setMatchScore,
    submitRating,
    myRatingFor,
    updateProfile,
    createLeague,
    setTab,
    focusMatchId,
    setFocusMatchId,
  }

  const myRating = me._rating != null ? me._rating : overallRating(ratingsByRated[me.id] || [])

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-[100dvh] bg-grass-deep flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-[90] bg-grass-deep/95 backdrop-blur border-b border-grass-light/20 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setTab('home')} className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 64 64">
            <rect x="6" y="6" width="52" height="52" rx="8" fill="#0F5136" stroke="#F4F7F0" strokeWidth="3" />
            <line x1="6" y1="32" x2="58" y2="32" stroke="#F4F7F0" strokeWidth="3" />
            <circle cx="32" cy="32" r="9" fill="none" stroke="#F4F7F0" strokeWidth="3" />
            <circle cx="32" cy="32" r="4" fill="#FFC542" />
          </svg>
          <span className="font-display text-xl tracking-wide text-chalk">
            SOCCER<span className="text-floodlight">LINK</span>
          </span>
        </button>
        <button onClick={() => setTab('profile')} className="flex items-center gap-2">
          <div className="text-right leading-tight">
            <div className="text-xs font-semibold text-chalk">{me.full_name?.split(' ')[0]}</div>
            <div className="num text-[11px] text-floodlight">{me.points} pts</div>
          </div>
          <RankBadge points={me.points} rankName={me.rank} size={30} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {tab === 'home' && <HomeTab {...shared} />}
        {tab === 'matches' && <MatchesTab {...shared} />}
        {tab === 'leagues' && <LeaguesTab {...shared} />}
        {tab === 'players' && <PlayersTab {...shared} />}
        {tab === 'profile' && <ProfileTab {...shared} myRating={myRating} onSignOut={onSignOut} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}
