import { useState } from 'react'
import { supabase } from './supabase'

const STYLES = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#0a0a0f;color:#fff;}
  .auth-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0e0e16;padding:24px;}
  .auth-top{width:100%;max-width:380px;display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}
  .auth-logo{font-family:'Bebas Neue',cursive;font-size:48px;letter-spacing:4px;background:linear-gradient(135deg,#a855f7,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .auth-sub{font-size:13px;color:#6b7280;margin-bottom:40px;letter-spacing:1px;width:100%;max-width:380px;}
  .auth-card{background:rgba(255,255,255,0.04);border:1px solid rgba(139,92,246,0.3);border-radius:20px;padding:28px 24px;width:100%;max-width:380px;}
  .auth-title{font-size:18px;font-weight:700;margin-bottom:6px;}
  .auth-desc{font-size:12px;color:#6b7280;margin-bottom:24px;line-height:1.6;}
  .input{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 14px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;outline:none;margin-bottom:12px;}
  .input:focus{border-color:rgba(139,92,246,0.5);}
  .input::placeholder{color:#4b5563;}
  .btn{width:100%;padding:13px;border-radius:12px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;margin-top:4px;transition:opacity 0.2s;}
  .btn:hover{opacity:0.9;}
  .btn:disabled{opacity:0.5;cursor:not-allowed;}
  .btn-google{width:100%;padding:13px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;background:rgba(255,255,255,0.07);color:#fff;margin-top:8px;transition:background 0.2s;display:flex;align-items:center;justify-content:center;gap:10px;}
  .btn-google:hover{background:rgba(255,255,255,0.12);}
  .btn-google:disabled{opacity:0.5;cursor:not-allowed;}
  .divider{display:flex;align-items:center;gap:10px;margin:16px 0;color:#4b5563;font-size:12px;}
  .divider::before,.divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.08);}
  .msg{margin-top:14px;padding:10px 14px;border-radius:10px;font-size:12px;text-align:center;}
  .msg-success{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);color:#10b981;}
  .msg-error{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#ef4444;}
  .lang-btns{display:flex;gap:6px;}
  .lang-btn{background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#a855f7;padding:4px 8px;border-radius:8px;font-size:12px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;}
`

const T = {
  fr: {
    subtitle: 'LA COMMUNAUTÉ PADEL EN ISRAËL',
    title: '👋 Connexion',
    desc: 'Entre ton email et reçois un lien magique — pas de mot de passe à retenir.',
    emailError: 'Entre une adresse email valide.',
    sending: '⏳ Envoi...',
    sendBtn: '✉️ Envoyer le lien magique',
    sent: '✉️ Lien envoyé ! Vérifie ta boîte mail et clique sur le lien pour te connecter.',
    firstLogin: 'Première connexion = création automatique de ton compte',
    googleBtn: 'Continuer avec Google',
    orDivider: 'ou',
  },
  en: {
    subtitle: 'THE PADEL COMMUNITY IN ISRAEL',
    title: '👋 Sign in',
    desc: 'Enter your email and receive a magic link — no password to remember.',
    emailError: 'Enter a valid email address.',
    sending: '⏳ Sending...',
    sendBtn: '✉️ Send magic link',
    sent: '✉️ Link sent! Check your inbox and click the link to sign in.',
    firstLogin: 'First login = automatic account creation',
    googleBtn: 'Continue with Google',
    orDivider: 'or',
  },
  he: {
    subtitle: 'קהילת הפאדל בישראל',
    title: '👋 כניסה',
    desc: 'הכנס את המייל שלך וקבל קישור קסם — ללא סיסמה.',
    emailError: 'הכנס כתובת מייל תקינה.',
    sending: '⏳ שולח...',
    sendBtn: '✉️ שלח קישור קסם',
    sent: '✉️ קישור נשלח! בדוק את תיבת הדואר שלך ולחץ על הקישור.',
    firstLogin: 'כניסה ראשונה = יצירת חשבון אוטומטית',
    googleBtn: 'המשך עם Google',
    orDivider: 'או',
  }
}

const LANG_LABELS = { fr: '🇫🇷 FR', en: '🇬🇧 EN', he: '🇮🇱 HE' }
const ALL_LANGS = ['fr', 'en', 'he']

export default function Auth({ lang, setLang }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const t = T[lang] || T.en

  async function handleGoogle() {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    setGoogleLoading(false)
  }

  async function handleMagicLink() {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setMessage(t.emailError)
      setIsError(true)
      return
    }
    if (cooldown > 0) return
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: window.location.origin }
    })
    setLoading(false)
    if (error) {
      setMessage(error.message)
      setIsError(true)
    } else {
      setMessage(t.sent)
      setIsError(false)
      setCooldown(60)
      const interval = setInterval(() => setCooldown(c => {
        if (c <= 1) { clearInterval(interval); return 0 }
        return c - 1
      }), 1000)
    }
  }

  return (
    <div dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <style>{STYLES}</style>
      <div className="auth-wrap">
        <div className="auth-top">
          <div className="auth-logo">PadelLink</div>
          <div className="lang-btns">
            {ALL_LANGS.filter(l => l !== lang).map(l => (
              <button key={l} className="lang-btn" onClick={() => setLang(l)}>{LANG_LABELS[l]}</button>
            ))}
          </div>
        </div>
        <div className="auth-sub">{t.subtitle}</div>
        <div className="auth-card">
          <div className="auth-title">{t.title}</div>
          <button className="btn-google" disabled={googleLoading} onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {googleLoading ? '...' : t.googleBtn}
          </button>
          <div className="divider">{t.orDivider}</div>
          <div className="auth-desc">{t.desc}</div>
          <input
            className="input"
            placeholder="email@example.com"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !cooldown && handleMagicLink()}
          />
          <button
            className="btn"
            disabled={loading || !email || cooldown > 0}
            onClick={handleMagicLink}
          >
            {loading ? t.sending : cooldown > 0 ? `${t.sendBtn} (${cooldown}s)` : t.sendBtn}
          </button>
          {message && (
            <div className={`msg ${isError ? 'msg-error' : 'msg-success'}`}>
              {message}
            </div>
          )}
        </div>
        <div style={{ marginTop: 24, fontSize: 11, color: '#374151', textAlign: 'center' }}>
          {t.firstLogin}
        </div>
      </div>
    </div>
  )
}
