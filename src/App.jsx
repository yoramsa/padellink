import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Auth from './Auth'
import CreateProfile from './CreateProfile'
import PadelLink from './PadelLink'

export default function App() {
  var [session, setSession] = useState(null)
  var [player, setPlayer] = useState(null)
  var [loading, setLoading] = useState(true)
  var [pendingLeagueId, setPendingLeagueId] = useState(null)

  useEffect(function() {
    var params = new URLSearchParams(window.location.search)
    var leagueParam = params.get('league')
    if (leagueParam) {
      setPendingLeagueId(leagueParam)
      window.history.replaceState({}, '', window.location.pathname)
    }

    supabase.auth.getSession().then(function(result) {
      setSession(result.data.session)
      if (result.data.session) loadPlayer(result.data.session.user.id)
      else setLoading(false)
    })

    var listener = supabase.auth.onAuthStateChange(function(event, sess) {
      setSession(sess)
      if (sess) loadPlayer(sess.user.id)
      else { setPlayer(null); setLoading(false) }
    })

    return function() { listener.data.subscription.unsubscribe() }
  }, [])

  async function loadPlayer(userId) {
    setLoading(true)
    var { data } = await supabase.from('players').select('*').eq('user_id', userId).single()
    setPlayer(data || null)
    setLoading(false)
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0e0e16', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Plus Jakarta Sans,sans-serif',
      color: '#a855f7', fontSize: 18, fontWeight: 700, letterSpacing: 2
    }}>
      ⚡ PADELLINK...
    </div>
  )

  if (!session) return <Auth />
  if (!player) return <CreateProfile session={session} onCreated={() => loadPlayer(session.user.id)} />

  return (
    <PadelLink
      session={session}
      player={player}
      pendingLeagueId={pendingLeagueId}
      onClearPendingLeague={() => setPendingLeagueId(null)}
      onSignOut={() => supabase.auth.signOut()}
    />
  )
}