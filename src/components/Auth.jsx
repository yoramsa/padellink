import { useState } from 'react'
import { supabase } from '../supabase'
import { Button, Input } from './ui'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  async function handleGoogle() {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) {
      setMsg(error.message)
      setErr(true)
      setGoogleLoading(false)
    }
  }

  async function handleMagic() {
    if (!email.includes('@') || !email.includes('.')) {
      setMsg('Entre une adresse email valide.')
      setErr(true)
      return
    }
    if (cooldown > 0) return
    setLoading(true)
    setMsg(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: window.location.origin },
    })
    setLoading(false)
    if (error) {
      setMsg(error.message)
      setErr(true)
    } else {
      setMsg('✉️ Lien envoyé ! Vérifie ta boîte mail.')
      setErr(false)
      setCooldown(60)
      const iv = setInterval(() => setCooldown((c) => (c <= 1 ? (clearInterval(iv), 0) : c - 1)), 1000)
    }
  }

  return (
    <div className="min-h-[100dvh] mow-stripes flex flex-col items-center justify-center px-6 bg-grass-deep">
      <div className="w-full max-w-[380px]">
        <div className="flex items-center gap-2 mb-1">
          <Logo />
          <span className="font-display text-5xl tracking-wide text-chalk">SOCCER<span className="text-floodlight">LINK</span></span>
        </div>
        <p className="text-xs text-chalk/50 tracking-[0.2em] uppercase mb-10 ml-1">Le terrain, en poche · Israël</p>

        <div className="bg-grass rounded-3xl border border-grass-light/30 p-6 shadow-lift">
          <h1 className="font-display text-2xl text-chalk tracking-wide mb-1">CONNEXION</h1>
          <p className="text-xs text-chalk/50 mb-5">Rejoins la communauté football amateur.</p>

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

          <p className="text-xs text-chalk/50 mb-2.5">Reçois un lien magique — pas de mot de passe.</p>
          <Input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !cooldown && handleMagic()}
          />
          <Button size="lg" className="mt-3" disabled={loading || !email || cooldown > 0} onClick={handleMagic}>
            {loading ? 'Envoi…' : cooldown > 0 ? `Renvoyer (${cooldown}s)` : 'Envoyer le lien magique'}
          </Button>

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
        <p className="text-center text-[11px] text-chalk/30 mt-6">Première connexion = création automatique du compte</p>
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
