import React, { useState } from 'react'
import { supabase } from './supabase'
import { CITIES } from './cities'

const LEVELS = [
  { val: 1.0, label: 'Débutant', labelEn: 'Beginner', labelHe: 'מתחיל', color: '#6b7280', desc: 'Tu découvres le padel.', descEn: 'You are discovering padel.', descHe: 'אתה מתחיל ללמוד פאדל.' },
  { val: 1.5, label: 'Débutant+', labelEn: 'Beginner+', labelHe: 'מתחיל+', color: '#9ca3af', desc: 'Tu connais les règles, quelques échanges.', descEn: 'You know the rules, can rally.', descHe: 'אתה מכיר את החוקים, מסוגל לשחק.' },
  { val: 2.0, label: 'Intermédiaire', labelEn: 'Intermediate', labelHe: 'בינוני', color: '#3b82f6', desc: 'Les coups de base sont maîtrisés.', descEn: 'Basic shots mastered.', descHe: 'מהלכים בסיסיים שולטים.' },
  { val: 2.5, label: 'Intermédiaire+', labelEn: 'Intermediate+', labelHe: 'בינוני+', color: '#06b6d4', desc: 'Bonne lecture du jeu, tactique simple.', descEn: 'Good game reading, simple tactics.', descHe: 'קריאת משחק טובה, טקטיקה פשוטה.' },
  { val: 3.0, label: 'Confirmé', labelEn: 'Confirmed', labelHe: 'מאושר', color: '#10b981', desc: 'Maîtrise du mur, variations de jeu.', descEn: 'Wall control, game variations.', descHe: 'שליטה בקיר, וריאציות משחק.' },
  { val: 3.5, label: 'Confirmé+', labelEn: 'Confirmed+', labelHe: 'מאושר+', color: '#84cc16', desc: 'Bandejas, viboras, jeu complet.', descEn: 'Bandejas, viboras, complete game.', descHe: 'בנדחה, ויבורה, משחק מלא.' },
  { val: 4.0, label: 'Avancé', labelEn: 'Advanced', labelHe: 'מתקדם', color: '#f59e0b', desc: 'Tournois régionaux, constance élevée.', descEn: 'Regional tournaments, high consistency.', descHe: 'טורנירים אזוריים, עקביות גבוהה.' },
  { val: 4.5, label: 'Expert', labelEn: 'Expert', labelHe: 'מומחה', color: '#f97316', desc: 'Niveau compétitif national.', descEn: 'National competitive level.', descHe: 'רמה תחרותית לאומית.' },
  { val: 5.0, label: 'Pro', labelEn: 'Pro', labelHe: 'פרו', color: '#ef4444', desc: 'Niveau professionnel ou semi-pro.', descEn: 'Professional or semi-pro level.', descHe: 'רמה מקצועית או חצי-מקצועית.' },
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
    phone: 'Téléphone (WhatsApp)',
    gameLevel: 'Niveau de jeu',
    levelWord: 'Niveau',
    yearsOld: 'ans',
    createProfile: '🎾 Créer mon profil',
    creating: '⏳ Création...',
    nameError: 'Entre ton prénom et nom (min. 2 caractères).',
    selectCity: '-- Sélectionne ta ville --',
    cityError: 'Sélectionne ta ville.',
    dobError: 'Entre ta date de naissance.',
    invalidDobError: 'Date de naissance invalide.',
    phoneError: 'Numéro invalide. Entre un numéro israélien valide (ex: 050 123 4567).',
    phoneDuplicateError: 'Ce numéro est déjà utilisé. Si c\'est une erreur, contacte padellink-support@gmail.com',
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
    phone: 'Phone (WhatsApp)',
    gameLevel: 'Game level',
    levelWord: 'Level',
    yearsOld: 'years old',
    createProfile: '🎾 Create my profile',
    creating: '⏳ Creating...',
    nameError: 'Enter your first and last name (min. 2 characters).',
    selectCity: '-- Select your city --',
    cityError: 'Please select your city.',
    dobError: 'Enter your date of birth.',
    invalidDobError: 'Invalid date of birth.',
    phoneError: 'Invalid number. Enter a valid Israeli number (e.g. 050 123 4567).',
    phoneDuplicateError: 'This number is already in use. If this is a mistake, contact padellink-support@gmail.com',
    error: 'Error: '
  },
  he: {
    subtitle: 'צור את פרופיל השחקן שלך',
    firstLogin: '✨ כניסה ראשונה',
    welcome: 'ברוך הבא!',
    description: 'הגדר את הפרופיל שלך כדי להצטרף לקהילת הפאדל.',
    fullName: 'שם פרטי ושם משפחה',
    city: 'עיר',
    birthDate: 'תאריך לידה',
    phone: 'טלפון (וואטסאפ)',
    gameLevel: 'רמת משחק',
    levelWord: 'רמה',
    yearsOld: 'שנים',
    createProfile: '🎾 צור את הפרופיל שלי',
    creating: '⏳ יוצר...',
    nameError: 'הכנס שם פרטי ושם משפחה (מינ. 2 תווים).',
    selectCity: '-- בחר את העיר שלך --',
    cityError: 'בחר את העיר שלך.',
    dobError: 'הכנס את תאריך הלידה שלך.',
    invalidDobError: 'תאריך לידה לא תקין.',
    phoneError: 'מספר לא תקין. הכנס מספר ישראלי תקין (לדוגמה: 050 123 4567).',
    phoneDuplicateError: 'מספר זה כבר בשימוש. אם זו טעות, צור קשר עם padellink-support@gmail.com',
    error: 'שגיאה: '
  }
}

const LANG_LABELS = { fr: '🇫🇷 FR', en: '🇬🇧 EN', he: '🇮🇱 HE' }
const ALL_LANGS = ['fr', 'en', 'he']

const STYLES = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#0a0a0f;color:#fff;}
  .wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0e0e16;padding:24px;}
  .top{width:100%;max-width:400px;display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}
  .logo{font-family:'Bebas Neue',cursive;font-size:40px;letter-spacing:4px;background:linear-gradient(135deg,#a855f7,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .lang-btns{display:flex;gap:6px;}
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

export default function CreateProfile({ session, onCreated, lang, setLang }) {
  const [name, setName] = useState(session.user.user_metadata?.name || '')
  const [city, setCity] = useState('')
  const [dob, setDob] = useState('')
  const [phone, setPhone] = useState('')
  const [level, setLevel] = useState(2.0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const t = T[lang] || T.en
  const selectedLevel = LEVELS.find(l => l.val === level) || LEVELS[2]
  const selectedLevelLabel = lang === 'en' ? selectedLevel.labelEn : lang === 'he' ? selectedLevel.labelHe : selectedLevel.label
  const selectedLevelDesc = lang === 'en' ? selectedLevel.descEn : lang === 'he' ? selectedLevel.descHe : selectedLevel.desc

  function calcAge(dobStr) {
    if (!dobStr) return null
    const today = new Date()
    const birth = new Date(dobStr)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const currentAge = calcAge(dob)

  async function handleSubmit() {
    if (!name.trim() || name.trim().length < 2) { setError(t.nameError); return }
    if (!city.trim() || city.trim().length < 2) { setError(t.cityError); return }
    if (!dob) { setError(t.dobError); return }
    if (currentAge === null || currentAge < 10 || currentAge > 100) { setError(t.invalidDobError); return }
    var digits = phone.replace(/[\s\-().]/g, '')
    if (digits.startsWith('+972')) digits = '0' + digits.slice(4)
    else if (digits.startsWith('972')) digits = '0' + digits.slice(3)
    var validIsraeli = /^0(5[0-9]|[234789]\d)\d{7}$/.test(digits)
    if (!validIsraeli) { setError(t.phoneError); return }
    var cleanPhone = digits

    setLoading(true)
    setError(null)

    const { data: existing } = await supabase.from('players').select('id').eq('phone', cleanPhone).maybeSingle()
    if (existing) {
      setLoading(false)
      setError(t.phoneDuplicateError)
      return
    }

    const { error: insertError } = await supabase.from('players').insert({
      user_id: session.user.id,
      name: name.trim().slice(0, 50),
      city: city.trim().slice(0, 50),
      date_of_birth: dob,
      age: currentAge,
      level: level,
      phone: cleanPhone,
      points: 0,
      wins: 0,
      matches: 0,
      win_history: []
    })

    setLoading(false)
    if (insertError) setError(t.error + insertError.message)
    else onCreated()
  }

  return (
    <div dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <style>{STYLES}</style>
      <div className="wrap">
        <div className="top">
          <div className="logo">PadelLink</div>
          <div className="lang-btns">
            {ALL_LANGS.filter(l => l !== lang).map(l => (
              <button key={l} className="lang-btn" onClick={() => setLang(l)}>{LANG_LABELS[l]}</button>
            ))}
          </div>
        </div>

        <div className="sub">{t.subtitle}</div>

        <div className="card">
          <div className="step">{t.firstLogin}</div>
          <div className="title">{t.welcome}</div>
          <div className="desc">{t.description}</div>

          <div className="label">{t.fullName}</div>
          <input className="input" placeholder="Carlos Reyes" value={name} maxLength={50} onChange={e => setName(e.target.value)} />

          <div className="label">{t.city}</div>
          <select className="select" value={city} onChange={e => setCity(e.target.value)}>
            <option value="">{t.selectCity}</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="label">{t.phone}</div>
          <input className="input" type="tel" placeholder="+972 50 000 0000" value={phone} maxLength={20} onChange={e => setPhone(e.target.value)} />

          <div className="label">{t.birthDate}</div>
          <input className="input" type="date" value={dob} max={new Date().toISOString().split('T')[0]} onChange={e => setDob(e.target.value)} />

          {currentAge !== null && currentAge >= 10 && (
            <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 700, marginTop: -10, marginBottom: 16 }}>
              → {currentAge} {t.yearsOld}
            </div>
          )}

          <div className="label">{t.gameLevel}</div>
          <select className="select" value={level} onChange={e => setLevel(parseFloat(e.target.value))}>
            {LEVELS.map(l => (
              <option key={l.val} value={l.val}>
                {l.val} — {lang === 'en' ? l.labelEn : lang === 'he' ? l.labelHe : l.label}
              </option>
            ))}
          </select>

          <div style={{ background: selectedLevel.color + '18', border: '1px solid ' + selectedLevel.color + '55', borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: selectedLevel.color, marginBottom: 4 }}>
              {selectedLevelLabel} — {t.levelWord} {level}
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>{selectedLevelDesc}</div>
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {LEVELS.map(l => (
                <button key={l.val} onClick={() => setLevel(l.val)} style={{
                  padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                  cursor: 'pointer', border: 'none',
                  background: level === l.val ? l.color : l.color + '22',
                  color: level === l.val ? '#fff' : l.color,
                  transition: 'all 0.15s'
                }}>{l.val}</button>
              ))}
            </div>
          </div>

          <button className="btn" disabled={loading || !name || !city || !dob || currentAge < 10 || !phone} onClick={handleSubmit}>
            {loading ? t.creating : t.createProfile}
          </button>

          {error && <div className="err">{error}</div>}
        </div>
      </div>
    </div>
  )
}
