import { useState } from 'react'
import { supabase } from '../supabase'
import { Button, Input } from './ui'

export default function Auth() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(false)

  function show(text, isErr) {
    setMsg(text)
    setErr(isErr)
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) {
      show(error.message, true)
      setGoogleLoading(false)
    }
  }

  async function handleSubmit() {
    setMsg(null)
    if (!email.includes('@') || !email.includes('.')) return show('Entre une adresse email valide.', true)
    if (password.length < 6) return show('Mot de passe : 6 caractères minimum.', true)

    setLoading(true)
    const creds = { email: email.trim().toLowerCase(), password }

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        ...creds,
        options: { emailRedirectTo: window.location.origin },
      })
      setLoading(false)
      if (error) return show(error.message, true)
      // Si la confirmation email est activée dans Supabase, pas de session immédiate
      if (data.session) {
        show('Compte créé ⚽', false)
      } else {
        show('✉️ Compte créé ! Confirme ton email pour te connecter.', false)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword(creds)
      setLoading(false)
      if (error) {
        show(error.message.includes('Invalid') ? 'Email ou mot de passe incorrect.' : error.message, true)
      }
      // succès : onAuthStateChange bascule l'app automatiquement
    }
  }

  async function handleForgot() {
    if (!email.includes('@') || !email.includes('.')) return show("Entre d'abord ton email ci-dessus.", true)
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: window.location.origin,
    })
    setLoading(false)
    show(error ? error.message : '✉️ Email de réinitialisation envoyé.', !!error)
  }

  return (
    <div className="min-h-[100dvh] mow-stripes flex flex-col items-center justify-center px-6 bg-grass-deep">
      <div className="w-full max-w-[380px]">
        <div className="flex items-center gap-2 mb-1">
          <Logo />
          <span className="font-display text-5xl tracking-wide text-chalk">
            SOCCER<span className="text-floodlight">LINK</span>
          </span>
        </div>
        <p className="text-xs text-chalk/50 tracking-[0.2em] uppercase mb-10 ml-1">Le terrain, en poche · Israël</p>

        <div className="bg-grass rounded-3xl border border-grass-light/30 p-6 shadow-lift">
          {/* Onglets connexion / création */}
          <div className="flex bg-grass-deep/50 rounded-xl p-1 mb-5">
            {[
              { k: 'signin', l: 'Connexion' },
              { k: 'signup', l: 'Créer un compte' },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => {
                  setMode(t.k)
                  setMsg(null)
                }}
                className={
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition ' +
                  (mode === t.k ? 'bg-floodlight text-grass-deep' : 'text-chalk/60')
                }
              >
                {t.l}
              </button>
            ))}
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-chalk text-grass-deep font-semibold text-sm hover:brightness-95 transition disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {googleLoading ? 'Redirection…' : 'Continuer avec Google'}
          </button>

          <div className="flex items-center gap-3 my-4 text-chalk/30 text-xs">
            <span className="flex-1 h-px bg-chalk/10" />
            ou
            <span className="flex-1 h-px bg-chalk/10" />
          </div>

          <Input
            type="email"
            autoComplete="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="mt-3">
            <Input
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <Button size="lg" className="mt-3" disabled={loading || !email || !password} onClick={handleSubmit}>
            {loading ? '…' : mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}
          </Button>

          {mode === 'signin' && (
            <button onClick={handleForgot} disabled={loading} className="block w-full text-center text-xs text-chalk/45 mt-3 hover:text-chalk/70">
              Mot de passe oublié ?
            </button>
          )}

          {msg && (
            <div
              className={
                'mt-3 px-3 py-2.5 rounded-xl text-xs text-center ' +
                (err ? 'bg-card/15 text-card border border-card/30' : 'bg-grass-light/15 text-grass-light border border-grass-light/30')
              }
            >
              {msg}
            </div>
          )}
        </div>
        <p className="text-center text-[11px] text-chalk/30 mt-6">
          {mode === 'signup' ? 'Un compte suffit pour rejoindre les matchs.' : 'Pas encore de compte ? Choisis « Créer un compte ».'}
        </p>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 64 64">
      <rect x="6" y="6" width="52" height="52" rx="8" fill="#0F5136" stroke="#F4F7F0" strokeWidth="2" />
      <line x1="6" y1="32" x2="58" y2="32" stroke="#F4F7F0" strokeWidth="2" />
      <circle cx="32" cy="32" r="9" fill="none" stroke="#F4F7F0" strokeWidth="2" />
      <circle cx="32" cy="32" r="4" fill="#FFC542" />
    </svg>
  )
}
