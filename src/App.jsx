import { useState, useEffect, lazy, Suspense } from 'react'
import { supabase } from './supabase'
import Auth from './Auth'
import CreateProfile from './CreateProfile'

const PadelLink = lazy(() => import('./PadelLink'))

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function Loader() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0e0e16', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Plus Jakarta Sans,sans-serif',
      color: '#a855f7', fontSize: 18, fontWeight: 700, letterSpacing: 2
    }}>
      ⚡ PADELLINK...
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pendingLeagueId, setPendingLeagueId] = useState(null)
  const [pendingTournamentId, setPendingTournamentId] = useState(null)
  const [lang, setLangState] = useState(() => localStorage.getItem('pl_lang') || 'en')

  function setLang(l) { setLangState(l); localStorage.setItem('pl_lang', l) }

  useEffect(function() {
    const params = new URLSearchParams(window.location.search)
    const leagueParam = params.get('league')
    const tournamentParam = params.get('tournament')
    if (leagueParam || tournamentParam) {
      if (leagueParam && UUID_RE.test(leagueParam)) setPendingLeagueId(leagueParam)
      if (tournamentParam && UUID_RE.test(tournamentParam)) setPendingTournamentId(tournamentParam)
      window.history.replaceState({}, '', window.location.pathname)
    }

    supabase.auth.getSession().then(function(result) {
      setSession(result.data.session)
      if (result.data.session) loadPlayer(result.data.session.user.id)
      else setLoading(false)
    })

    const listener = supabase.auth.onAuthStateChange(function(event, sess) {
      setSession(sess)
      if (sess) loadPlayer(sess.user.id)
      else { setPlayer(null); setLoading(false) }
    })

    return function() { listener.data.subscription.unsubscribe() }
  }, [])

  async function loadPlayer(userId) {
    setLoading(true)
    const { data } = await supabase.from('players').select('*').eq('user_id', userId).single()
    setPlayer(data || null)
    setLoading(false)
  }

  if (loading) return <Loader />
  if (!session) return <Auth lang={lang} setLang={setLang} />
  if (!player) return <CreateProfile session={session} onCreated={() => loadPlayer(session.user.id)} lang={lang} setLang={setLang} />

  return (
    <Suspense fallback={<Loader />}>
      <PadelLink
        session={session}
        player={player}
        pendingLeagueId={pendingLeagueId}
        onClearPendingLeague={() => setPendingLeagueId(null)}
        pendingTournamentId={pendingTournamentId}
        onClearPendingTournament={() => setPendingTournamentId(null)}
        onSignOut={() => supabase.auth.signOut()}
        lang={lang}
        setLang={setLang}
      />
    </Suspense>
  )
}
