import React, { useState } from 'react'
import { supabase } from './supabase'

const LEVELS = [
  { val: 1.0, label: 'Débutant', labelEn: 'Beginner', color: '#6b7280', desc: 'Tu découvres le padel. Tu apprends à tenir la raquette, les règles de base et à frapper la balle.', descEn: 'You are discovering padel. You are learning how to hold the racket, the basic rules and how to hit the ball.' },
  { val: 1.5, label: 'Débutant+', labelEn: 'Beginner+', color: '#9ca3af', desc: 'Tu connais les règles. Tu arrives à faire quelques échanges et tu commences à viser.', descEn: 'You know the rules. You can make a few rallies and you are starting to aim.' },
  { val: 2.0, label: 'Intermédiaire', labelEn: 'Intermediate', color: '#3b82f6', desc: 'Tu es régulier dans tes frappes. Les coups de base (coup droit, revers) sont maîtrisés.', descEn: 'You are consistent with your shots. Basic shots like forehand and backhand are under control.' },
  { val: 2.5, label: 'Intermédiaire+', labelEn: 'Intermediate+', color: '#06b6d4', desc: 'Tu lis bien le jeu, tu construis des points et tu utilises une tactique simple.', descEn: 'You read the game well, build points and use simple tactics.' },
  { val: 3.0, label: 'Confirmé', labelEn: 'Confirmed', color: '#10b981', desc: 'Tu maîtrises le jeu au mur, tu varies tes frappes et tu sais jouer en équipe.', descEn: 'You control wall play, vary your shots and know how to play as a team.' },
  { val: 3.5, label: 'Confirmé+', labelEn: 'Confirmed+', color: '#84cc16', desc: 'Tu exécutes des bandejas et viboras. Ton jeu est complet et tu participes à des tournois.', descEn: 'You can execute bandejas and viboras. Your game is complete and you take part in tournaments.' },
  { val: 4.0, label: 'Avancé', labelEn: 'Advanced', color: '#f59e0b', desc: 'Tu joues des tournois régionaux avec constance. Tu as une vraie tactique de jeu.', descEn: 'You play regional tournaments consistently. You have a real game strategy.' },
  { val: 4.5, label: 'Expert', labelEn: 'Expert', color: '#f97316', desc: 'Niveau compétitif national. Tu joues des tournois officiels et tu gagnes régulièrement.', descEn: 'National competitive level. You play official tournaments and win regularly.' },
  { val: 5.0, label: 'Pro', labelEn: 'Pro', color: '#ef4444', desc: 'Niveau professionnel ou semi-professionnel. Tu es classé nationalement ou internationalement.', descEn: 'Professional or semi-professional level. You are ranked nationally or internationally.' },
]

const T = {
  fr: {
    subtitle: 'CRÉE TON PROFIL JOUEUR',
    firstLogin: '✨ Première connexion',
    welcome: 'Bienvenue !',
    description: 'Configure ton profil pour rejoindre la communauté padel.',
    fullName: 'Prénom et nom',
    city: 'Ville',
    birthDate: 'Date de naissance',
    gameLevel: 'Niveau de jeu',
    levelWord: 'Niveau',
    yearsOld: 'ans',
    createProfile: '🎾 Créer mon profil',
    creating: '⏳ Création...',
    nameError: 'Entre ton prénom et nom (min. 2 caractères).',
    cityError: 'Entre ta ville.',
    dobError: 'Entre ta date de naissance.',
    invalidDobError: 'Date de naissance invalide.',
    error: 'Erreur : '
  },
  en: {
    subtitle: 'CREATE YOUR PLAYER PROFILE',
    firstLogin: '✨ First login',
    welcome: 'Welcome!',
    description: 'Set up your profile to join the padel community.',
    fullName: 'First and last name',
    city: 'City',
    birthDate: 'Date of birth',
    gameLevel: 'Game level',
    levelWord: 'Level',
    yearsOld: 'years old',
    createProfile: '🎾 Create my profile',
    creating: '⏳ Creating...',
    nameError: 'Enter your first and last name (min. 2 characters).',
    cityError: 'Enter your city.',
    dobError: 'Enter your date of birth.',
    invalidDobError: 'Invalid date of birth.',
    error: 'Error: '
  }
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#0a0a0f;color:#fff;}
  .wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0e0e16;padding:24px;}
  .top{width:100%;max-width:400px;display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}
  .logo{font-family:'Bebas Neue',cursive;font-size:40px;letter-spacing:4px;background:linear-gradient(135deg,#a855f7,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .lang-btn{background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#a855f7;padding:6px 11px;border-radius:12px;font-size:13px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;}
  .sub{font-size:12px;color:#6b7280;margin-bottom:32px;letter-spacing:1px;width:100%;max-width:400px;}
  .card{background:rgba(255,255,255,0.04);border:1px solid rgba(139,92,246,0.3);border-radius:20px;padding:28px 24px;width:100%;max-width:400px;}
  .title{font-size:17px;font-weight:700;margin-bottom:4px;}
  .desc{font-size:12px;color:#6b7280;margin-bottom:24px;line-height:1.6;}
  .label{font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
  .input{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:11px 14px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;outline:none;margin-bottom:16px;}
  .input:focus{border-color:rgba(139,92,246,0.5);}
  .input::placeholder{color:#4b5563;}
  .select{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:11px 14px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;outline:none;appearance:none;margin-bottom:16px;}
  .select option{background:#1a1a2e;}
  .row{display:flex;gap:12px;}
  .row .input{margin-bottom:0;}
  .row-wrap{display:flex;gap:12px;margin-bottom:16px;}
  .level-preview{padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;margin-bottom:16px;text-align:center;}
  .btn{width:100%;padding:13px;border-radius:12px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;transition:opacity 0.2s;margin-top:4px;}
  .btn:hover{opacity:0.9;}
  .btn:disabled{opacity:0.5;cursor:not-allowed;}
  .err{margin-top:12px;padding:10px 14px;border-radius:10px;font-size:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#ef4444;text-align:center;}
  .step{font-size:11px;color:#a855f7;font-weight:700;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;}
`

export default function CreateProfile({ session, onCreated }) {
  var [lang, setLang] = useState('fr')
  var [name, setName] = useState(
    session.user.user_metadata?.name || ''
  )
  var [city, setCity] = useState('')
  var [dob, setDob] = useState('')
  var [level, setLevel] = useState(2.0)
  var [loading, setLoading] = useState(false)
  var [error, setError] = useState(null)

  var t = T[lang]
  var selectedLevel = LEVELS.find(function(l) { return l.val === level }) || LEVELS[2]
  var selectedLevelLabel = lang === 'en' ? selectedLevel.labelEn : selectedLevel.label
  var selectedLevelDesc = lang === 'en' ? selectedLevel.descEn : selectedLevel.desc

  function calcAge(dobStr) {
    if (!dobStr) return null
    var today = new Date()
    var birth = new Date(dobStr)
    var age = today.getFullYear() - birth.getFullYear()
    var m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  var currentAge = calcAge(dob)

  async function handleSubmit() {
    if (!name.trim() || name.trim().length < 2) {
      setError(t.nameError)
      return
    }
    if (!city.trim() || city.trim().length < 2) {
      setError(t.cityError)
      return
    }
    if (!dob) {
      setError(t.dobError)
      return
    }
    if (currentAge === null || currentAge < 10 || currentAge > 100) {
      setError(t.invalidDobError)
      return
    }

    setLoading(true)
    setError(null)

    var { data: authData } = await supabase.auth.getUser()
    console.log('USER:', authData?.user)
    console.log('USER ID:', authData?.user?.id)
    console.log('SESSION ID:', session?.user?.id)

    var { error: insertError } = await supabase
      .from('players')
      .insert({
        user_id: session.user.id,
        name: name.trim().slice(0, 50),
        city: city.trim().slice(0, 50),
        date_of_birth: dob,
        age: currentAge,
        level: level,
        points: 0,
        wins: 0,
        matches: 0,
        win_history: []
      })

    setLoading(false)

    if (insertError) {
      setError(t.error + insertError.message)
    } else {
      onCreated()
    }
  }

  return (
    <div>
      <style>{STYLES}</style>
      <div className="wrap">
        <div className="top">
          <div className="logo">PadelLink</div>
          <button className="lang-btn" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
            {lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
          </button>
        </div>

        <div className="sub">{t.subtitle}</div>

        <div className="card">
          <div className="step">{t.firstLogin}</div>
          <div className="title">{t.welcome}</div>
          <div className="desc">{t.description}</div>

          <div className="label">{t.fullName}</div>
          <input
            className="input"
            placeholder="Carlos Reyes"
            value={name}
            maxLength={50}
            onChange={e => setName(e.target.value)}
          />

          <div className="label">{t.city}</div>
          <input
            className="input"
            placeholder="Tel Aviv"
            value={city}
            maxLength={50}
            onChange={e => setCity(e.target.value)}
          />

          <div className="label">{t.birthDate}</div>
          <input
            className="input"
            type="date"
            value={dob}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setDob(e.target.value)}
          />

          {currentAge !== null && currentAge >= 10 && (
            <div style={{
              fontSize: 12, color: '#a855f7', fontWeight: 700,
              marginTop: -10, marginBottom: 16
            }}>
              → {currentAge} {t.yearsOld}
            </div>
          )}

          <div className="label">{t.gameLevel}</div>
          <select
            className="select"
            value={level}
            onChange={e => setLevel(parseFloat(e.target.value))}
          >
            {LEVELS.map(function(l) {
              return (
                <option key={l.val} value={l.val}>
                  {l.val} — {lang === 'en' ? l.labelEn : l.label}
                </option>
              )
            })}
          </select>

          <div
            style={{
              background: selectedLevel.color + '18',
              border: '1px solid ' + selectedLevel.color + '55',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 20
            }}
          >
            <div style={{
              fontSize: 13, fontWeight: 700,
              color: selectedLevel.color, marginBottom: 4
            }}>
              {selectedLevelLabel} — {t.levelWord} {level}
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
              {selectedLevelDesc}
            </div>
            <div style={{
              marginTop: 10,
              display: 'flex', flexWrap: 'wrap', gap: 4
            }}>
              {LEVELS.map(function(l) {
                return (
                  <button
                    key={l.val}
                    onClick={() => setLevel(l.val)}
                    style={{
                      padding: '3px 8px', borderRadius: 20, fontSize: 10,
                      fontWeight: 700, cursor: 'pointer', border: 'none',
                      background: level === l.val ? l.color : l.color + '22',
                      color: level === l.val ? '#fff' : l.color,
                      transition: 'all 0.15s'
                    }}
                  >
                    {l.val}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            className="btn"
            disabled={loading || !name || !city || !dob || currentAge < 10}
            onClick={handleSubmit}
          >
            {loading ? t.creating : t.createProfile}
          </button>

          {error && <div className="err">{error}</div>}
        </div>
      </div>
    </div>
  )
}
