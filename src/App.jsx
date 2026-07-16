import { useState, useEffect, lazy, Suspense } from 'react'
import { supabase, supabaseConfigured } from './supabase'
import Auth from './components/Auth'
import CreateProfile from './components/CreateProfile'
import { ToastProvider } from './components/ui'

const SoccerLink = lazy(() => import('./SoccerLink'))
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function Loader() {
  return (
    <div className="min-h-[100dvh] bg-grass-deep mow-stripes flex flex-col items-center justify-center gap-3">
      <svg width="46" height="46" viewBox="0 0 64 64" className="animate-pulse">
        <rect x="6" y="6" width="52" height="52" rx="8" fill="#0F5136" stroke="#F4F7F0" strokeWidth="3" />
        <line x1="6" y1="32" x2="58" y2="32" stroke="#F4F7F0" strokeWidth="3" />
        <circle cx="32" cy="32" r="9" fill="none" stroke="#F4F7F0" strokeWidth="3" />
        <circle cx="32" cy="32" r="4" fill="#FFC542" />
      </svg>
      <span className="font-display text-lg tracking-widest text-chalk/70">SOCCERLINK…</span>
    </div>
  )
}

function ConfigNeeded() {
  return (
    <div className="min-h-[100dvh] bg-grass-deep mow-stripes flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-[360px] bg-grass rounded-3xl border border-card/40 p-6 shadow-lift">
        <div className="text-3xl mb-3">⚙️</div>
        <h1 className="font-display text-2xl text-chalk tracking-wide mb-2">CONFIGURATION REQUISE</h1>
        <p className="text-sm text-chalk/70 mb-4">
          Les clés Supabase sont manquantes. Ajoute ces deux variables d'environnement sur ton
          hébergement (Vercel → Settings → Environment Variables), puis redéploie :
        </p>
        <div className="text-left num text-xs bg-grass-deep/60 rounded-xl p-3 border border-chalk/10 text-floodlight">
          VITE_SUPABASE_URL
          <br />
          VITE_SUPABASE_ANON_KEY
        </div>
        <p className="text-[11px] text-chalk/45 mt-4">
          Valeurs dans Supabase → Project Settings → API.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  if (!supabaseConfigured) return <ConfigNeeded />
  return <AppInner />
}

function AppInner() {
  const [session, setSession] = useState(null)
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pendingMatchId, setPendingMatchId] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const matchParam = params.get('match')
    if (matchParam && UUID_RE.test(matchParam)) {
      setPendingMatchId(matchParam)
      window.history.replaceState({}, '', window.location.pathname)
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session)
        if (data.session) loadPlayer(data.session.user.id)
        else setLoading(false)
      })
      .catch(() => setLoading(false))

    const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess)
      if (sess) loadPlayer(sess.user.id)
      else {
        setPlayer(null)
        setLoading(false)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function loadPlayer(userId) {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    setPlayer(data || null)
    setLoading(false)
  }

  if (loading) return <Loader />
  if (!session) return <ToastProvider><Auth /></ToastProvider>
  if (!player)
    return (
      <ToastProvider>
        <CreateProfile session={session} onCreated={() => loadPlayer(session.user.id)} />
      </ToastProvider>
    )

  return (
    <Suspense fallback={<Loader />}>
      <SoccerLink
        session={session}
        player={player}
        pendingMatchId={pendingMatchId}
        onClearPendingMatch={() => setPendingMatchId(null)}
        onSignOut={() => supabase.auth.signOut()}
      />
    </Suspense>
  )
}
