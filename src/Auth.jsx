import { useState } from 'react'
import { supabase } from './supabase'

const STYLES = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#0a0a0f;color:#fff;}
  .auth-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0e0e16;padding:24px;}
  .auth-logo{font-family:'Bebas Neue',cursive;font-size:48px;letter-spacing:4px;background:linear-gradient(135deg,#a855f7,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;}
  .auth-sub{font-size:13px;color:#6b7280;margin-bottom:40px;letter-spacing:1px;}
  .auth-card{background:rgba(255,255,255,0.04);border:1px solid rgba(139,92,246,0.3);border-radius:20px;padding:28px 24px;width:100%;max-width:380px;}
  .auth-title{font-size:18px;font-weight:700;margin-bottom:6px;}
  .auth-desc{font-size:12px;color:#6b7280;margin-bottom:24px;line-height:1.6;}
  .input{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 14px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;outline:none;margin-bottom:12px;}
  .input:focus{border-color:rgba(139,92,246,0.5);}
  .input::placeholder{color:#4b5563;}
  .btn{width:100%;padding:13px;border-radius:12px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;margin-top:4px;transition:opacity 0.2s;}
  .btn:hover{opacity:0.9;}
  .btn:disabled{opacity:0.5;cursor:not-allowed;}
  .msg{margin-top:14px;padding:10px 14px;border-radius:10px;font-size:12px;text-align:center;}
  .msg-success{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);color:#10b981;}
  .msg-error{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#ef4444;}
`

export default function Auth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  async function handleMagicLink() {
    if (!email || !email.includes('@')) {
      setMessage('Entre une adresse email valide.')
      setIsError(true)
      return
    }
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
      setMessage('✉️ Lien envoyé ! Vérifie ta boîte mail et clique sur le lien pour te connecter.')
      setIsError(false)
    }
  }

  return (
    <div>
      <style>{STYLES}</style>
      <div className="auth-wrap">
        <div className="auth-logo">PadelLink</div>
        <div className="auth-sub">LA COMMUNAUTÉ PADEL EN ISRAËL</div>
        <div className="auth-card">
          <div className="auth-title">👋 Connexion</div>
          <div className="auth-desc">
            Entre ton email et reçois un lien magique — pas de mot de passe à retenir.
          </div>
          <input
            className="input"
            placeholder="ton@email.com"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleMagicLink()}
          />
          <button
            className="btn"
            disabled={loading || !email}
            onClick={handleMagicLink}
          >
            {loading ? '⏳ Envoi...' : '✉️ Envoyer le lien magique'}
          </button>
          {message && (
            <div className={`msg ${isError ? 'msg-error' : 'msg-success'}`}>
              {message}
            </div>
          )}
        </div>
        <div style={{ marginTop: 24, fontSize: 11, color: '#374151', textAlign: 'center' }}>
          Première connexion = création automatique de ton compte
        </div>
      </div>
    </div>
  )
}
