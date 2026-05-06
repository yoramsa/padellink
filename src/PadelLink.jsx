import { useState, useRef, useEffect } from 'react'
import { supabase } from './supabase'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#0a0a0f;color:#fff;}
  .app{max-width:430px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;background:#0e0e16;}
  .header{background:linear-gradient(135deg,#1a0a2e 0%,#0d0d1a 100%);padding:14px 16px 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(139,92,246,0.3);position:sticky;top:0;z-index:100;}
  .header-logo{font-family:'Bebas Neue',cursive;font-size:26px;letter-spacing:2px;background:linear-gradient(135deg,#a855f7,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .header-right{display:flex;align-items:center;gap:10px;}
  .lang-btn{background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#a855f7;padding:4px 8px;border-radius:8px;font-size:12px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;}
  .notif-dot{background:#ef4444;color:#fff;border-radius:50%;width:20px;height:20px;font-size:10px;display:flex;align-items:center;justify-content:center;font-weight:700;}
  .content{flex:1;overflow-y:auto;padding-bottom:80px;}
  .nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:rgba(14,14,22,0.95);backdrop-filter:blur(20px);border-top:1px solid rgba(139,92,246,0.2);display:flex;z-index:100;}
  .nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 4px 8px;cursor:pointer;transition:all 0.2s;position:relative;}
  .nav-item.active .nav-icon{color:#a855f7;}
  .nav-item.active .nav-label{color:#a855f7;}
  .nav-icon{font-size:20px;color:#4b5563;transition:color 0.2s;}
  .nav-label{font-size:9px;color:#4b5563;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;}
  .nav-badge{position:absolute;top:6px;right:50%;transform:translateX(8px);background:#ef4444;color:#fff;border-radius:50%;width:16px;height:16px;font-size:9px;display:flex;align-items:center;justify-content:center;font-weight:700;}
  .section-title{font-family:'Bebas Neue',cursive;font-size:22px;letter-spacing:1.5px;color:#e2e8f0;padding:16px 16px 8px;}
  .card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:14px;margin:0 16px 12px;}
  .card-purple{border-color:rgba(139,92,246,0.3);background:rgba(139,92,246,0.06);}
  .card-yellow{border-color:rgba(245,158,11,0.35);background:rgba(245,158,11,0.05);}
  .card-green{border-color:rgba(16,185,129,0.3);background:rgba(16,185,129,0.05);}
  .btn{padding:10px 18px;border-radius:12px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:13px;transition:all 0.2s;}
  .btn-primary{background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;}
  .btn-primary:hover{opacity:0.9;}
  .btn-outline{background:transparent;border:1px solid rgba(139,92,246,0.4);color:#a855f7;}
  .btn-sm{padding:6px 12px;font-size:11px;border-radius:8px;}
  .btn-danger{background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#ef4444;}
  .btn-green{background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#10b981;}
  .btn-yellow{background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);color:#f59e0b;}
  .input{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px 12px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;outline:none;}
  .input:focus{border-color:rgba(139,92,246,0.5);}
  .input::placeholder{color:#4b5563;}
  .input-score{background:rgba(255,255,255,0.08);border:2px solid rgba(139,92,246,0.3);border-radius:12px;padding:14px 10px;color:#fff;font-family:'Bebas Neue',cursive;font-size:28px;outline:none;text-align:center;width:100%;}
  .input-score:focus{border-color:#a855f7;background:rgba(139,92,246,0.1);}
  .input-score::placeholder{color:rgba(139,92,246,0.3);font-size:20px;}
  .select{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px 12px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;outline:none;appearance:none;}
  .select option{background:#1a1a2e;}
  .avatar{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;flex-shrink:0;}
  .row{display:flex;align-items:center;gap:10px;}
  .col{display:flex;flex-direction:column;gap:4px;}
  .flex1{flex:1;}
  .text-sm{font-size:12px;color:#9ca3af;}
  .text-xs{font-size:11px;color:#6b7280;}
  .fw600{font-weight:600;}
  .fw700{font-weight:700;}
  .mb4{margin-bottom:4px;}
  .mb8{margin-bottom:8px;}
  .mb12{margin-bottom:12px;}
  .mt4{margin-top:4px;}
  .mt8{margin-top:8px;}
  .mt12{margin-top:12px;}
  .gap4{gap:4px;}
  .gap6{gap:6px;}
  .gap8{gap:8px;}
  .tab-bar{display:flex;gap:6px;overflow-x:auto;padding:8px 16px;scrollbar-width:none;}
  .tab-bar::-webkit-scrollbar{display:none;}
  .tab-pill{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;border:1px solid rgba(255,255,255,0.1);color:#9ca3af;background:transparent;transition:all 0.2s;}
  .tab-pill.active{background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;border-color:transparent;}
  .stars{display:flex;gap:2px;}
  .star{font-size:14px;cursor:pointer;transition:transform 0.1s;}
  .star:hover{transform:scale(1.2);}
  .badge-chip{display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border-radius:20px;font-size:10px;font-weight:600;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.25);color:#c4b5fd;margin:2px;}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:200;display:flex;align-items:flex-end;}
  .modal{background:#13131f;border-radius:20px 20px 0 0;padding:20px 16px 28px;width:100%;max-width:430px;margin:0 auto;max-height:90vh;overflow-y:auto;border-top:1px solid rgba(139,92,246,0.3);}
  .modal-title{font-family:'Bebas Neue',cursive;font-size:22px;letter-spacing:1px;margin-bottom:14px;}
  .chat-bubble{max-width:75%;padding:8px 12px;border-radius:16px;font-size:13px;line-height:1.4;margin-bottom:6px;}
  .chat-me{background:linear-gradient(135deg,#7c3aed,#5b21b6);margin-left:auto;border-bottom-right-radius:4px;}
  .chat-other{background:rgba(255,255,255,0.08);margin-right:auto;border-bottom-left-radius:4px;}
  .chat-input-row{display:flex;gap:8px;padding:10px 16px;background:rgba(14,14,22,0.95);border-top:1px solid rgba(255,255,255,0.06);}
  .toggle{display:flex;align-items:center;gap:10px;cursor:pointer;}
  .toggle-track{width:44px;height:24px;border-radius:12px;background:rgba(255,255,255,0.1);position:relative;transition:background 0.2s;flex-shrink:0;}
  .toggle-track.on{background:#7c3aed;}
  .toggle-thumb{width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:3px;left:3px;transition:left 0.2s;}
  .toggle-track.on .toggle-thumb{left:23px;}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .stat-box{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px;text-align:center;}
  .stat-val{font-family:'Bebas Neue',cursive;font-size:28px;color:#a855f7;}
  .stat-lbl{font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;}
  .rank-row{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;transition:background 0.15s;}
  .rank-row:hover{background:rgba(255,255,255,0.03);}
  .rank-num{font-family:'Bebas Neue',cursive;font-size:20px;color:#4b5563;width:28px;text-align:center;}
  .rank-num.top1{color:#f59e0b;}
  .rank-num.top2{color:#9ca3af;}
  .rank-num.top3{color:#92400e;}
  .set-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
  .set-num{font-size:11px;color:#6b7280;font-weight:700;width:40px;flex-shrink:0;}
  .score-vs{font-family:'Bebas Neue',cursive;font-size:18px;color:#4b5563;flex-shrink:0;}
  .sub-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;padding:8px 0 4px;}
  .empty{text-align:center;padding:32px 16px;color:#6b7280;font-size:13px;}
  .loading-screen{display:flex;align-items:center;justify-content:center;padding:40px;color:#6b7280;font-size:13px;}
`

const LEVELS = [
  {val:1.0,label:'Débutant',labelEn:'Beginner',color:'#6b7280',desc:'Débute le padel, apprentissage des bases.',descEn:'Just starting padel, learning the basics.'},
  {val:1.5,label:'Débutant+',labelEn:'Beginner+',color:'#9ca3af',desc:'Connait les règles, quelques échanges.',descEn:'Knows the rules, can rally.'},
  {val:2.0,label:'Intermédiaire',labelEn:'Intermediate',color:'#3b82f6',desc:'Régularité, coups de base maîtrisés.',descEn:'Consistency, basic shots mastered.'},
  {val:2.5,label:'Intermédiaire+',labelEn:'Intermediate+',color:'#06b6d4',desc:'Bonne lecture du jeu, tactique simple.',descEn:'Good game reading, simple tactics.'},
  {val:3.0,label:'Confirmé',labelEn:'Confirmed',color:'#10b981',desc:'Maîtrise du mur, variations de jeu.',descEn:'Wall control, game variations.'},
  {val:3.5,label:'Confirmé+',labelEn:'Confirmed+',color:'#84cc16',desc:'Bandejas, viboras, jeu complet.',descEn:'Bandejas, viboras, complete game.'},
  {val:4.0,label:'Avancé',labelEn:'Advanced',color:'#f59e0b',desc:'Tournois régionaux, constance élevée.',descEn:'Regional tournaments, high consistency.'},
  {val:4.5,label:'Expert',labelEn:'Expert',color:'#f97316',desc:'Niveau compétitif national.',descEn:'National competitive level.'},
  {val:5.0,label:'Pro',labelEn:'Pro',color:'#ef4444',desc:'Niveau professionnel ou semi-pro.',descEn:'Professional or semi-pro level.'},
]

const getLevelInfo = v => LEVELS.find(l => l.val === v) || LEVELS[2]

const RATING_KEYS = ['fairplay','service','reflex','power','level']
const RATING_LABELS = {
  fr:{fairplay:'Fair Play',service:'Service',reflex:'Réflexe',power:'Puissance',level:'Niveau'},
  en:{fairplay:'Fair Play',service:'Service',reflex:'Reflex',power:'Power',level:'Level'}
}

const BADGE_DEFS = [
  {b:'🏆',fr:'Champion',en:'Champion',dFr:'10 victoires',dEn:'10 wins'},
  {b:'🥇',fr:'Légende',en:'Legend',dFr:'25 victoires',dEn:'25 wins'},
  {b:'🎯',fr:'Pro',en:'Pro',dFr:'Niveau 4.5+',dEn:'Level 4.5+'},
  {b:'⚡',fr:'Série',en:'Streak',dFr:'5V consécutives',dEn:'5 wins in a row'},
  {b:'🤝',fr:'Fair Play',en:'Fair Play',dFr:'Note FP >4.8',dEn:'FP rating >4.8'},
  {b:'🏅',fr:'Régulier',en:'Regular',dFr:'20+ matchs',dEn:'20+ matches'},
]

const T = {
  fr:{
    home:'Accueil',players:'Joueurs',leagues:'Ligues',ranking:'Classement',profile:'Profil',
    follow:'Suivre',unfollow:'Ne plus suivre',rate:'Noter',
    matchPending:'Match en attente',confirm:'Confirmer',refuse:'Refuser',
    createMatch:'Créer un match',myMatches:'Historique des matchs',
    pendingMatches:'En attente de confirmation',
    noFollowing:'Tu ne suis aucun joueur.',followFirst:'Suis des joueurs pour créer un match libre.',
    vs:'vs',winner:'Gagnant',set:'Set',addSet:'+ Ajouter un set',
    joinLeague:'Rejoindre la ligue',createLeague:'Créer une ligue',
    ranking2:'Classement',matches:'Matchs',teams:'Équipes',members:'Joueurs',chat:'Chat',
    pts:'PTS',wins:'V',losses:'D',played:'J',
    addMatch:'Inscrire un score',team1:'Équipe 1',team2:'Équipe 2',
    selectTeam:'Sélectionner une équipe',addTeamMatch:'Valider le match',
    randomDraw:'Tirage aléatoire',send:'Envoyer',message:'Message...',
    editProfile:'Modifier le profil',name:'Nom',city:'Ville',
    showLevels:'Voir les niveaux',showBadges:'Mes badges',
    ratingsTitle:'Mes notes reçues',signOut:'Se déconnecter',
    expel:'Expulser',privateCode:'Code d\'accès',enterCode:'Entrer le code',access:'Accéder',
    leagueName:'Nom de la ligue',season:'Saison',rules:'Règles',
    setsMatch:'Sets par match',matchDuration:'Durée (min)',minAge:'Âge minimum',
    visibilityLabel:'Visibilité de la ligue',
    visibilityPublicDesc:'🌍 Publique — Tout le monde peut voir et rejoindre librement.',
    visibilityPrivateDesc:'🔒 Privée — Seules les personnes avec le code peuvent rejoindre.',
    privateToggleLabel:'Rendre la ligue privée',
    create:'Créer',currentForm:'Forme actuelle',pointsHistory:'Historique des points',
    noMatches:'Aucun match joué',badges:'Badges',worldRank:'Mondial',leagueRank:'Ligues',
    chooseTeams:'1. Sélectionne les joueurs',enterSets:'2. Saisis les scores set par set',
    submitMatch:'Soumettre le match',selectLeague:'Sélectionner une ligue',
    myLeagues:'Mes ligues',otherLeagues:'Autres ligues',memberCount:'membres',
    duration:'Durée',minAgeShort:'Âge min.',setsPerMatch:'Sets',
    noMatchYet:'Aucun match pour l\'instant.',
    leagueRules:'Règles',leagueMembers:'Membres',confirmJoin:'Rejoindre cette ligue',
    leaveLeague:'Quitter la ligue',leaveRequest:'Demande envoyée à l\'admin.',
    leaveApprove:'Approuver',leaveDecline:'Refuser',pendingLeaveRequests:'Demandes de sortie',
    subAdmins:'Sous-admins',addSubAdmin:'Nommer sous-admin',removeSubAdmin:'Retirer',
    canPostScore:'peut inscrire des scores',
    adminOnly:'Seul l\'admin ou un sous-admin peut inscrire un score.',
    matchWin:'WIN',matchLoss:'LOSS',matchFree:'Match libre',
    waitingConfirm:'En attente de',pendingCount:'confirmation(s)',
    cancelBtn:'Annuler',saveBtn:'Sauvegarder',loading:'Chargement...',
    age:'ans',followedPlayers:'Joueurs suivis',
  },
  en:{
    home:'Home',players:'Players',leagues:'Leagues',ranking:'Ranking',profile:'Profile',
    follow:'Follow',unfollow:'Unfollow',rate:'Rate',
    matchPending:'Match pending',confirm:'Confirm',refuse:'Decline',
    createMatch:'Create match',myMatches:'Match history',
    pendingMatches:'Awaiting confirmation',
    noFollowing:'You follow nobody.',followFirst:'Follow players to create a free match.',
    vs:'vs',winner:'Winner',set:'Set',addSet:'+ Add set',
    joinLeague:'Join league',createLeague:'Create league',
    ranking2:'Standings',matches:'Matches',teams:'Teams',members:'Players',chat:'Chat',
    pts:'PTS',wins:'W',losses:'L',played:'P',
    addMatch:'Post score',team1:'Team 1',team2:'Team 2',
    selectTeam:'Select team',addTeamMatch:'Validate match',
    randomDraw:'Random draw',send:'Send',message:'Message...',
    editProfile:'Edit profile',name:'Name',city:'City',
    showLevels:'See levels',showBadges:'My badges',
    ratingsTitle:'My ratings',signOut:'Sign out',
    expel:'Expel',privateCode:'Access code',enterCode:'Enter code',access:'Access',
    leagueName:'League name',season:'Season',rules:'Rules',
    setsMatch:'Sets per match',matchDuration:'Duration (min)',minAge:'Min age',
    visibilityLabel:'League visibility',
    visibilityPublicDesc:'🌍 Public — Anyone can see and freely join this league.',
    visibilityPrivateDesc:'🔒 Private — Only people with the access code can join.',
    privateToggleLabel:'Make league private',
    create:'Create',currentForm:'Current form',pointsHistory:'Points history',
    noMatches:'No matches played',badges:'Badges',worldRank:'World',leagueRank:'Leagues',
    chooseTeams:'1. Select players',enterSets:'2. Enter scores set by set',
    submitMatch:'Submit match',selectLeague:'Select league',
    myLeagues:'My leagues',otherLeagues:'Other leagues',memberCount:'members',
    duration:'Duration',minAgeShort:'Min age',setsPerMatch:'Sets',
    noMatchYet:'No matches yet.',
    leagueRules:'Rules',leagueMembers:'Members',confirmJoin:'Join this league',
    leaveLeague:'Leave league',leaveRequest:'Leave request sent to admin.',
    leaveApprove:'Approve',leaveDecline:'Decline',pendingLeaveRequests:'Leave requests',
    subAdmins:'Sub-admins',addSubAdmin:'Make sub-admin',removeSubAdmin:'Remove',
    canPostScore:'can post scores',
    adminOnly:'Only admin or sub-admin can post scores.',
    matchWin:'WIN',matchLoss:'LOSS',matchFree:'Free match',
    waitingConfirm:'Waiting for',pendingCount:'confirmation(s)',
    cancelBtn:'Cancel',saveBtn:'Save',loading:'Loading...',
    age:'years old',followedPlayers:'Followed players',
  }
}

// ── Helpers ──
function calcAge(dob) {
  if (!dob) return null
  var today = new Date(), birth = new Date(dob)
  var age = today.getFullYear() - birth.getFullYear()
  var m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function computeRatingAvg(ratings, key) {
  if (!ratings || !ratings.length) return 0
  var total = ratings.reduce((a, r) => a + (r[key] || 0), 0)
  return total / ratings.length
}

function computeBadges(player, ratings) {
  var b = []
  if (player.wins >= 25) b.push('🥇')
  else if (player.wins >= 10) b.push('🏆')
  if (player.level >= 4.5) b.push('🎯')
  var h = player.win_history || []
  if (h.length >= 5 && h.slice(-5).every(x => x === 1)) b.push('⚡')
  if (player.matches >= 20) b.push('🏅')
  if (ratings && ratings.length >= 3) {
    var fpAvg = computeRatingAvg(ratings, 'fairplay')
    if (fpAvg > 4.8) b.push('🤝')
  }
  return b
}

function matchWinner(t1Id, t2Id, sets) {
  var w1 = 0, w2 = 0
  ;(sets || []).forEach(s => { if (s.a > s.b) w1++; else if (s.b > s.a) w2++ })
  return w1 > w2 ? t1Id : t2Id
}

// ── UI Components ──
function Av({ size = 40, photo, name = '?' }) {
  var init = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (photo) return <img src={photo} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} alt={name} />
  return <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.36, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>{init}</div>
}

function LvBadge({ val, lang = 'fr' }) {
  var info = getLevelInfo(val)
  var lbl = lang === 'en' ? info.labelEn : info.label
  return <span style={{ background: info.color + '22', border: '1px solid ' + info.color + '55', color: info.color, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{lbl} ({val})</span>
}

function Stars({ val, onChange, readOnly }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className="star" style={{ color: i <= Math.round(val) ? '#f59e0b' : '#374151' }} onClick={readOnly ? null : () => onChange(i)}>★</span>
      ))}
    </div>
  )
}

function Toggle({ on, onToggle, label }) {
  return (
    <div className="toggle" onClick={onToggle}>
      <div className={'toggle-track ' + (on ? 'on' : '')}><div className="toggle-thumb" /></div>
      <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{label}</span>
    </div>
  )
}

function SetsInput({ sets, onChange, t }) {
  function add() { onChange([...sets, { a: '', b: '' }]) }
  function rem(i) { onChange(sets.filter((_, j) => j !== i)) }
  function upd(i, k, v) {
    var clean = v.replace(/[^0-9]/g, '')
    var num = parseInt(clean)
    if (clean !== '' && (isNaN(num) || num > 99)) return
    onChange(sets.map((s, j) => j !== i ? s : { ...s, [k]: clean }))
  }
  return (
    <div>
      {sets.map((s, i) => (
        <div key={i} className="set-row">
          <span className="set-num">{t.set} {i + 1}</span>
          <input className="input-score" style={{ flex: 1 }} value={s.a} placeholder="0" maxLength={2} inputMode="numeric" onChange={e => upd(i, 'a', e.target.value)} />
          <span className="score-vs">-</span>
          <input className="input-score" style={{ flex: 1 }} value={s.b} placeholder="0" maxLength={2} inputMode="numeric" onChange={e => upd(i, 'b', e.target.value)} />
          {sets.length > 1 && <button style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', flexShrink: 0 }} onClick={() => rem(i)}>✕</button>}
        </div>
      ))}
      <button style={{ width: '100%', background: 'rgba(139,92,246,0.08)', border: '1px dashed rgba(139,92,246,0.35)', color: '#a855f7', borderRadius: 10, padding: '8px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }} onClick={add}>{t.addSet}</button>
    </div>
  )
}

function SetsPreview({ sets, t1name, t2name }) {
  if (!sets?.length) return null
  var w1 = 0, w2 = 0
  sets.forEach(s => { if (s.a > s.b) w1++; else if (s.b > s.a) w2++ })
  var win = w1 > w2 ? t1name : w2 > w1 ? t2name : ''
  return (
    <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '10px', margin: '8px 0' }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {sets.map((s, i) => <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '4px 12px', fontFamily: "'Bebas Neue',cursive", fontSize: 20, color: s.a > s.b ? '#06b6d4' : s.b > s.a ? '#a855f7' : '#9ca3af' }}>{s.a}-{s.b}</div>)}
      </div>
      {win && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12, fontWeight: 700, color: '#10b981' }}>🏆 {win}</div>}
    </div>
  )
}

// ══════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════
export default function PadelLink({ session, player: initialPlayer, onSignOut }) {
  var [lang, setLang] = useState('fr')
  var [tab, setTab] = useState('home')
  var [me, setMe] = useState(initialPlayer)
  var [players, setPlayers] = useState([])
  var [follows, setFollows] = useState([]) // [{follower_id, following_id}]
  var [ratings, setRatings] = useState([]) // all ratings
  var [leagues, setLeagues] = useState([])
  var [freeMatches, setFreeMatches] = useState([])
  var [leagueMatches, setLeagueMatches] = useState([])
  var [leaveRequests, setLeaveRequests] = useState([])
  var [viewPlayerId, setViewPlayerId] = useState(null)
  var [viewLeagueId, setViewLeagueId] = useState(null)
  var [previewLeagueId, setPreviewLeagueId] = useState(null)
  var [selectedLeagueTab, setSelectedLeagueTab] = useState('ranking2')
  var [rankTab, setRankTab] = useState('world')
  var [loadingData, setLoadingData] = useState(true)

  var t = T[lang]

  useEffect(() => {
    loadAll()

    var channel = supabase
      .channel('free_matches_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'free_matches'
      }, async () => {
        await loadFreeMatches()
        await refreshMe()
        await loadPlayers()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function loadAll() {
    setLoadingData(true)
    await Promise.all([loadPlayers(), loadFollows(), loadRatings(), loadLeagues(), loadFreeMatches(), loadLeagueMatches(), loadLeaveRequests()])
    setLoadingData(false)
  }

  async function loadPlayers() {
    var { data } = await supabase.from('players').select('*').order('points', { ascending: false })
    if (data) setPlayers(data)
  }

  async function loadFollows() {
    var { data } = await supabase.from('follows').select('*')
    if (data) setFollows(data)
  }

  async function loadRatings() {
    var { data } = await supabase.from('ratings').select('*')
    if (data) setRatings(data)
  }

  async function loadLeagues() {
    var { data } = await supabase.from('leagues').select('*').order('created_at', { ascending: false })
    if (data) {
      var withMembers = await Promise.all(data.map(async l => {
        var { data: members } = await supabase.from('league_members').select('player_id,role').eq('league_id', l.id)
        var { data: teams } = await supabase.from('teams').select('*').eq('league_id', l.id)
        return { ...l, league_members: members || [], teams: teams || [] }
      }))
      setLeagues(withMembers)
    }
  }

async function loadFreeMatches() {
  var { data } = await supabase.from('free_matches').select('*').order('created_at', { ascending: false })
  var { data: confirmations } = await supabase.from('free_match_confirmations').select('*')
  console.log('confirmations loaded:', confirmations)
  if (data) {
    data.forEach(m => { m.confirmations = confirmations ? confirmations.filter(c => c.match_id === m.id) : [] })
    setFreeMatches(data)
  }
}

  async function loadLeagueMatches() {
    var { data } = await supabase.from('matches').select('*').order('created_at', { ascending: false })
    if (data) setLeagueMatches(data)
  }

  async function loadLeaveRequests() {
    var { data } = await supabase.from('leave_requests').select('*').eq('status', 'pending')
    if (data) setLeaveRequests(data)
  }

  async function refreshMe() {
    var { data } = await supabase.from('players').select('*').eq('id', me.id).single()
    if (data) setMe(data)
  }

  // ── Follow / Unfollow ──
  async function toggleFollow(targetId) {
    var isFollowing = follows.some(f => f.follower_id === me.id && f.following_id === targetId)
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', me.id).eq('following_id', targetId)
    } else {
      await supabase.from('follows').insert({ follower_id: me.id, following_id: targetId })
    }
    await loadFollows()
  }

  function isFollowing(targetId) {
    return follows.some(f => f.follower_id === me.id && f.following_id === targetId)
  }

  function getFollowedPlayers() {
    var ids = follows.filter(f => f.follower_id === me.id).map(f => f.following_id)
    return players.filter(p => ids.includes(p.id))
  }

  // ── Ratings ──
  async function submitRating(targetId, newRatings) {
    await supabase.from('ratings').upsert({
      rater_id: me.id,
      rated_id: targetId,
      fairplay: newRatings.fairplay,
      service: newRatings.service,
      reflex: newRatings.reflex,
      power: newRatings.power,
      level_rating: newRatings.level
    }, { onConflict: 'rater_id,rated_id' })
    await loadRatings()
  }

  function getPlayerRatings(playerId) {
    return ratings.filter(r => r.rated_id === playerId)
  }

  function getMyRatingFor(targetId) {
    return ratings.find(r => r.rater_id === me.id && r.rated_id === targetId)
  }

  // ── Profile update ──
  async function updateProfile(updates) {
    await supabase.from('players').update(updates).eq('id', me.id)
    await refreshMe()
    await loadPlayers()
  }

  async function uploadPhoto(file) {
    var ext = file.name.split('.').pop()
    var path = me.id + '/avatar.' + ext
    var { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      var { data } = supabase.storage.from('avatars').getPublicUrl(path)
      await updateProfile({ photo_url: data.publicUrl })
    }
  }

  // ── Free matches ──
  async function createFreeMatch(data) {
    await supabase.from('free_matches').insert({
      creator_id: me.id,
      player1_id: data.playerIds[0],
      player2_id: data.playerIds[1],
      player3_id: data.playerIds[2],
      player4_id: data.playerIds[3],
      sets: data.sets,
      played_at: data.date || null,
      status: 'pending'
    })
    await loadFreeMatches()
  }

async function respondFreeMatch(matchId, confirm) {
  var { data: existing } = await supabase
    .from('free_match_confirmations')
    .select('player_id')
    .eq('match_id', matchId)
    .eq('player_id', me.id)
    .maybeSingle()

  if (existing) {
    await loadFreeMatches()
    return
  }

  var { error } = await supabase.from('free_match_confirmations').insert({
    match_id: matchId,
    player_id: me.id,
    confirmed: confirm
  })

  if (error) {
    console.error('Confirmation error:', error)
    return
  }

  await loadFreeMatches()
  await refreshMe()
  await loadPlayers()
}
  // ── Leagues ──
  async function createLeague(data) {
    var { data: newL, error } = await supabase.from('leagues').insert({
      name: data.name, season: data.season, rules: data.rules,
      sets_per_match: data.setsPerMatch, match_duration: data.matchDuration,
      min_age: data.minAge, is_private: data.isPrivate,
      access_code_hash: data.isPrivate ? data.code : null,
      admin_id: me.id
    }).select().single()
    if (!error && newL) {
      await supabase.from('league_members').insert({ league_id: newL.id, player_id: me.id, role: 'admin' })
      await loadLeagues()
    }
  }

  async function joinLeague(leagueId) {
    var already = leagues.find(l => l.id === leagueId)?.league_members?.some(lm => lm.player_id === me.id)
    if (already) return
    await supabase.from('league_members').insert({ league_id: leagueId, player_id: me.id, role: 'member' })
    await loadLeagues()
  }

  async function requestLeave(leagueId) {
    var already = leaveRequests.some(r => r.league_id === leagueId && r.player_id === me.id)
    if (already) return
    await supabase.from('leave_requests').insert({ league_id: leagueId, player_id: me.id })
    await loadLeaveRequests()
  }

  async function resolveLeave(leagueId, playerId, approve) {
    await supabase.from('leave_requests').update({ status: approve ? 'approved' : 'declined', resolved_at: new Date().toISOString() })
      .eq('league_id', leagueId).eq('player_id', playerId).eq('status', 'pending')
    if (approve) {
      await supabase.from('league_members').delete().eq('league_id', leagueId).eq('player_id', playerId)
    }
    await loadLeagues()
    await loadLeaveRequests()
  }

  async function expelMember(leagueId, playerId) {
    await supabase.from('league_members').delete().eq('league_id', leagueId).eq('player_id', playerId)
    await loadLeagues()
  }

  async function toggleSubAdmin(leagueId, playerId) {
    var lm = leagues.find(l => l.id === leagueId)?.league_members?.find(m => m.player_id === playerId)
    var newRole = lm?.role === 'sub_admin' ? 'member' : 'sub_admin'
    await supabase.from('league_members').update({ role: newRole }).eq('league_id', leagueId).eq('player_id', playerId)
    await loadLeagues()
  }

  async function addLeagueMatch(leagueId, matchData) {
    var { error } = await supabase.from('matches').insert({
      league_id: leagueId,
      team1_id: matchData.team1Id,
      team2_id: matchData.team2Id,
      sets: matchData.sets,
      winner_id: matchData.winnerId,
      played_at: matchData.date || null,
      posted_by: me.id
    })
    if (!error) {
      await loadLeagueMatches()
      await loadLeagues()
      await refreshMe()
      await loadPlayers()
    }
    return error
  }

  async function sendChatMsg(leagueId, text) {
    await supabase.from('chat_messages').insert({ league_id: leagueId, player_id: me.id, content: text.trim().slice(0, 500) })
  }

  async function randomDrawTeams(leagueId) {
    var shuffled = players.slice().sort(() => Math.random() - 0.5)
    var n = Math.floor(shuffled.length / 2)
    var existing = leagues.find(l => l.id === leagueId)?.teams || []
    // Delete existing teams first
    for (var tm of existing) {
      await supabase.from('teams').delete().eq('id', tm.id)
    }
    for (var i = 0; i < n; i++) {
      await supabase.from('teams').insert({
        league_id: leagueId,
        name: (lang === 'en' ? 'Team ' : 'Équipe ') + (i + 1),
        player1_id: shuffled[i * 2].id,
        player2_id: shuffled[i * 2 + 1].id
      })
    }
    await loadLeagues()
  }

  // ── Computed ──
  var followedPlayers = getFollowedPlayers()
  var pendingForMe = freeMatches.filter(m =>
    m.status === 'pending' &&
    [m.player1_id, m.player2_id, m.player3_id, m.player4_id].includes(me.id) &&
    m.creator_id !== me.id
  )
  var myAdminLeagues = leagues.filter(l => l.admin_id === me.id)
  var myLeaveReqs = leaveRequests.filter(r => myAdminLeagues.some(l => l.id === r.league_id))
  var totalNotifs = pendingForMe.length + myLeaveReqs.length

  var activeLeague = viewLeagueId ? leagues.find(l => l.id === viewLeagueId) : null
  var previewLeague = previewLeagueId ? leagues.find(l => l.id === previewLeagueId) : null

  var confirmedFreeMatches = freeMatches.filter(m => m.status === 'confirmed')
  var myMatches = [
    ...confirmedFreeMatches.filter(m => [m.player1_id, m.player2_id, m.player3_id, m.player4_id].includes(me.id)),
    ...leagueMatches.filter(m => {
      var league = leagues.find(l => l.id === m.league_id)
      if (!league) return false
      var myTeam = league.teams?.find(tm => tm.player1_id === me.id || tm.player2_id === me.id)
      return !!myTeam
    })
  ]

  var myRatings = getPlayerRatings(me.id)
  var myBadges = computeBadges(me, myRatings)

  if (loadingData) {
    return (
      <div style={{ minHeight: '100vh', background: '#0e0e16', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans,sans-serif', color: '#a855f7', fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>
        ⚡ {t.loading}
      </div>
    )
  }

  return (
    <div className="app">
      <style>{STYLES}</style>

      <div className="header">
        <span className="header-logo">PadelLink</span>
        <div className="header-right">
          {totalNotifs > 0 && <div className="notif-dot">{totalNotifs}</div>}
          <button className="lang-btn" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>{lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}</button>
        </div>
      </div>

      <div className="content">
        {tab === 'home' && (
          <HomeTab t={t} lang={lang} me={me} players={players} followedPlayers={followedPlayers}
            pendingForMe={pendingForMe} myMatches={myMatches} leagues={leagues}
            leagueMatches={leagueMatches} myAdminLeagues={myAdminLeagues}
            myLeaveReqs={myLeaveReqs} resolveLeave={resolveLeave}
            createFreeMatch={createFreeMatch} respondFreeMatch={respondFreeMatch}
            setViewPlayerId={setViewPlayerId} setTab={setTab}
          />
        )}
        {tab === 'players' && !viewPlayerId && (
          <PlayersTab t={t} lang={lang} me={me} players={players} follows={follows}
            ratings={ratings} toggleFollow={toggleFollow} isFollowing={isFollowing}
            submitRating={submitRating} getMyRatingFor={getMyRatingFor}
            setViewPlayerId={setViewPlayerId}
          />
        )}
        {tab === 'players' && viewPlayerId && (
          <PlayerProfile t={t} lang={lang} me={me}
            player={players.find(p => p.id === viewPlayerId)}
            players={players} follows={follows} ratings={ratings}
            myMatches={myMatches} leagues={leagues} leagueMatches={leagueMatches}
            isFollowing={isFollowing} toggleFollow={toggleFollow}
            submitRating={submitRating} getMyRatingFor={getMyRatingFor}
            onBack={() => setViewPlayerId(null)}
          />
        )}
        {tab === 'leagues' && !viewLeagueId && !previewLeague && (
          <LeaguesTab t={t} lang={lang} me={me} leagues={leagues} players={players}
            createLeague={createLeague} joinLeague={joinLeague}
            setViewLeagueId={setViewLeagueId} setPreviewLeagueId={setPreviewLeagueId}
          />
        )}
        {tab === 'leagues' && previewLeague && !viewLeagueId && (
          <LeaguePreview t={t} lang={lang} league={previewLeague} players={players} me={me}
            joinLeague={joinLeague} setViewLeagueId={setViewLeagueId}
            setPreviewLeagueId={setPreviewLeagueId}
          />
        )}
        {tab === 'leagues' && activeLeague && (
          <LeagueView t={t} lang={lang} league={activeLeague} players={players} me={me}
            leagueMatches={leagueMatches.filter(m => m.league_id === activeLeague.id)}
            selectedTab={selectedLeagueTab} setSelectedTab={setSelectedLeagueTab}
            addLeagueMatch={addLeagueMatch} expelMember={expelMember}
            sendChatMsg={sendChatMsg} toggleSubAdmin={toggleSubAdmin}
            requestLeave={requestLeave} resolveLeave={resolveLeave}
            randomDrawTeams={randomDrawTeams} leaveRequests={leaveRequests}
            onBack={() => { setViewLeagueId(null); setSelectedLeagueTab('ranking2') }}
            loadLeagues={loadLeagues}
          />
        )}
        {tab === 'ranking' && (
          <RankingTab t={t} lang={lang} players={players} leagues={leagues}
            leagueMatches={leagueMatches} follows={follows} ratings={ratings}
            rankTab={rankTab} setRankTab={setRankTab}
            setViewPlayerId={setViewPlayerId} setTab={setTab}
          />
        )}
        {tab === 'profile' && (
          <ProfileTab t={t} lang={lang} me={me} players={players}
            myRatings={myRatings} myBadges={myBadges} myMatches={myMatches}
            leagues={leagues} leagueMatches={leagueMatches}
            updateProfile={updateProfile} uploadPhoto={uploadPhoto}
            onSignOut={onSignOut}
          />
        )}
      </div>

      <nav className="nav">
        {[
          { id: 'home', icon: '🏠', label: t.home },
          { id: 'players', icon: '👥', label: t.players },
          { id: 'leagues', icon: '🏆', label: t.leagues },
          { id: 'ranking', icon: '🌍', label: t.ranking },
          { id: 'profile', icon: '👤', label: t.profile },
        ].map(item => (
          <div key={item.id} className={'nav-item ' + (tab === item.id ? 'active' : '')}
            onClick={() => { setTab(item.id); setViewPlayerId(null); setViewLeagueId(null); setPreviewLeagueId(null) }}>
            {item.id === 'home' && totalNotifs > 0 && <div className="nav-badge">{totalNotifs}</div>}
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  )
}

// ══ HOME ══
function HomeTab({ t, lang, me, players, followedPlayers, pendingForMe, myMatches, leagues, leagueMatches, myAdminLeagues, myLeaveReqs, resolveLeave, createFreeMatch, respondFreeMatch, setViewPlayerId, setTab }) {
  var [showCreate, setShowCreate] = useState(false)
  var [showAllMatches, setShowAllMatches] = useState(false)

  return (
    <div>
      <div className="section-title">👋 {me.name.split(' ')[0]}</div>

      {/* Leave requests for admin */}
      {myLeaveReqs.length > 0 && (
        <div>
          <div style={{ padding: '0 16px 6px', fontSize: 11, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>⚙️ {t.pendingLeaveRequests}</div>
          {myLeaveReqs.map(r => {
            var p = players.find(x => x.id === r.player_id)
            var l = myAdminLeagues.find(x => x.id === r.league_id)
            return (
              <div key={r.id} className="card card-yellow">
                <div className="fw600 mb8" style={{ fontSize: 13 }}>{p?.name} → {l?.name}</div>
                <div className="row gap8">
                  <button className="btn btn-green btn-sm flex1" onClick={() => resolveLeave(r.league_id, r.player_id, true)}>✓ {t.leaveApprove}</button>
                  <button className="btn btn-danger btn-sm flex1" onClick={() => resolveLeave(r.league_id, r.player_id, false)}>✕ {t.leaveDecline}</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pending match confirmations */}
      {pendingForMe.length > 0 && (
        <div>
          <div style={{ padding: '0 16px 6px', fontSize: 11, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>⏳ {t.pendingMatches}</div>
          {pendingForMe.map(m => {
            var creator = players.find(p => p.id === m.creator_id)
            var pids = [m.player1_id, m.player2_id, m.player3_id, m.player4_id]
            var myConfirmation = (m.confirmations || []).find(c => c.player_id === me.id)
            var nbConfirmed = (m.confirmations || []).filter(c => c.confirmed && c.player_id !== m.creator_id).length
            return (
              <div key={m.id} className="card card-yellow">
                <div className="fw600 mb4" style={{ fontSize: 13 }}>{creator?.name} — {t.matchFree}</div>
                <div className="text-xs mb8">{pids.map(id => players.find(p => p.id === id)?.name || '?').join(', ')}</div>
                {m.sets?.length > 0 && <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 600, marginBottom: 8 }}>{m.sets.map(s => s.a + '-' + s.b).join('  ')}</div>}
                {myConfirmation ? (
                  <div style={{ textAlign: 'center', padding: '8px', borderRadius: 8, background: myConfirmation.confirmed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: myConfirmation.confirmed ? '#10b981' : '#ef4444' }}>
                      {myConfirmation.confirmed ? '✓ Tu as confirmé' : '✕ Tu as refusé'}
                    </div>
                    {myConfirmation.confirmed && (
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                        {nbConfirmed}/3 {lang === 'fr' ? 'confirmation(s)' : 'confirmation(s)'}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="row gap8">
                    <button className="btn btn-primary btn-sm flex1" onClick={() => respondFreeMatch(m.id, true)}>✓ {t.confirm}</button>
                    <button className="btn btn-danger btn-sm flex1" onClick={() => respondFreeMatch(m.id, false)}>✕ {t.refuse}</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div style={{ padding: '0 16px 12px' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowCreate(true)}>⚡ {t.createMatch}</button>
      </div>

      {showCreate && (
        <CreateMatchModal t={t} lang={lang} me={me} players={players} followedPlayers={followedPlayers} leagues={leagues}
          onCreate={async d => { await createFreeMatch(d); setShowCreate(false) }}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* Match history */}
      <div style={{ padding: '0 16px 4px', fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.myMatches} ({myMatches.length})</div>
      {myMatches.length === 0 && <div className="empty">{t.noMatches}</div>}
      {myMatches.slice().reverse().slice(0, showAllMatches ? myMatches.length : 5).map(m => {
        var isLeagueMatch = !!m.league_id
        var league = isLeagueMatch ? leagues.find(l => l.id === m.league_id) : null
        var t1n = '?', t2n = '?'
        var iWon = false

        if (isLeagueMatch && league) {
          var tt1 = league.teams?.find(x => x.id === m.team1_id)
          var tt2 = league.teams?.find(x => x.id === m.team2_id)
          if (tt1) t1n = tt1.name
          if (tt2) t2n = tt2.name
          var myTeam = league.teams?.find(tm => tm.player1_id === me.id || tm.player2_id === me.id)
          if (myTeam && m.winner_id) iWon = myTeam.id === m.winner_id
        } else {
          t1n = [m.player1_id, m.player2_id].map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
          t2n = [m.player3_id, m.player4_id].map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
          var inTeam1 = m.player1_id === me.id || m.player2_id === me.id
          if (m.sets?.length) {
            var w1 = 0, w2 = 0
            m.sets.forEach(s => { if (s.a > s.b) w1++; else if (s.b > s.a) w2++ })
            iWon = inTeam1 ? w1 > w2 : w2 > w1
          }
        }

        var hasResult = isLeagueMatch ? !!m.winner_id : m.status === 'confirmed' && m.sets?.length > 0
        var resultColor = !hasResult ? '#374151' : iWon ? '#10b981' : '#ef4444'
        var resultLabel = !hasResult ? '🔵 ' + t.matchFree : iWon ? '🏆 ' + t.matchWin : '❌ ' + t.matchLoss

        return (
          <div key={m.id} className="card" style={{ borderLeft: '3px solid ' + resultColor }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: resultColor }}>{resultLabel}</span>
              {(m.played_at || m.date) && <span className="text-xs">{m.played_at || m.date}</span>}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{t1n} {t.vs} {t2n}</div>
            {m.sets?.length > 0 && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {m.sets.map((s, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '2px 8px', fontFamily: "'Bebas Neue',cursive", fontSize: 16, color: s.a > s.b ? '#06b6d4' : s.b > s.a ? '#a855f7' : '#9ca3af' }}>{s.a}-{s.b}</span>)}
              </div>
            )}
            {league && <div className="text-xs mt4">{league.name}</div>}
          </div>
        )
      })}

      {myMatches.length > 5 && (
        <div style={{ padding: '0 16px 12px' }}>
          <button className="btn btn-outline" style={{ width: '100%', fontSize: 12 }}
            onClick={() => setShowAllMatches(!showAllMatches)}>
            {showAllMatches
              ? (lang === 'fr' ? '↑ Voir moins' : '↑ See less')
              : (lang === 'fr' ? '↓ Voir plus (' + (myMatches.length - 5) + ')' : '↓ See more (' + (myMatches.length - 5) + ')')}
          </button>
        </div>
      )}

      {/* Followed players */}
      <div style={{ padding: '12px 16px 4px', fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>👥 {t.followedPlayers}</div>
      {followedPlayers.length === 0
        ? <div className="card" style={{ textAlign: 'center' }}><span className="text-sm">{t.noFollowing}</span></div>
        : followedPlayers.slice(0, 5).map(p => (
          <div key={p.id} className="rank-row" onClick={() => { setViewPlayerId(p.id); setTab('players') }}>
            <Av size={38} photo={p.photo_url} name={p.name} />
            <div className="col flex1">
              <span className="fw600" style={{ fontSize: 13 }}>{p.name}</span>
              <span className="text-xs">{p.city} · {p.points}pts</span>
            </div>
            <LvBadge val={p.level} lang={lang} />
          </div>
        ))
      }
    </div>
  )
}

// ══ CREATE MATCH MODAL ══
function CreateMatchModal({ t, lang, me, players, followedPlayers, leagues, onCreate, onClose }) {
  var [sel, setSel] = useState([me.id])
  var [sets, setSets] = useState([{ a: '', b: '' }])
  var [date, setDate] = useState('')
  var [leagueId, setLeagueId] = useState('')
  var [step, setStep] = useState(1)
  var myLeagues = leagues.filter(l => l.league_members?.some(lm => lm.player_id === me.id))

  function toggleSel(pid) {
    setSel(prev => {
      var n = prev.slice()
      var i = n.indexOf(pid)
      if (i >= 0) n.splice(i, 1)
      else if (n.length < 4) n.push(pid)
      return n
    })
  }

  var ps = sets.map(s => ({ a: parseInt(s.a) || 0, b: parseInt(s.b) || 0 })).filter(s => s.a > 0 || s.b > 0)
  var t1names = sel.slice(0, 2).map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
  var t2names = sel.slice(2, 4).map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')

  // Only me + followed players selectable
  var allSelectable = [me, ...followedPlayers]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">⚡ {t.createMatch}</div>

        {step === 1 && (
          <div>
            <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 700, marginBottom: 8 }}>{t.chooseTeams}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Éq.1 = joueurs 1&2 · Éq.2 = joueurs 3&4 · Seulement tes joueurs suivis</div>
            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
              {allSelectable.map(p => {
                var isSel = sel.includes(p.id)
                var isMe = p.id === me.id
                var idx = sel.indexOf(p.id)
                var teamTag = idx === 0 || idx === 1 ? '🔵 Éq.1' : idx === 2 || idx === 3 ? '🟣 Éq.2' : ''
                var isFollowed = followedPlayers.some(fp => fp.id === p.id)
                return (
                  <div key={p.id} className="row" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: isMe ? 'default' : 'pointer', opacity: isMe ? 0.5 : 1 }}
                    onClick={isMe ? null : () => toggleSel(p.id)}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: '2px solid ' + (isSel ? '#7c3aed' : '#374151'), background: isSel ? '#7c3aed' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{isSel ? '✓' : ''}</div>
                    <Av size={32} photo={p.photo_url} name={p.name} />
                    <span style={{ fontSize: 13, flex: 1 }}>{p.name}{isMe ? ' (moi)' : ''}</span>
                    {isSel && <span style={{ fontSize: 10, color: '#a855f7', fontWeight: 700 }}>{teamTag}</span>}
                  </div>
                )
              })}
            </div>
            <div style={{ fontSize: 10, color: '#6b7280', margin: '8px 0 12px' }}>{sel.length}/4 {t.players}</div>
            {myLeagues.length > 0 && (
  <div>
    <div style={{ padding: '12px 16px 4px', fontSize: 11, color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.myLeagues}</div>
    {myLeagues.map(renderLeague)}
  </div>
)}
            <input className="input mb12" type="date" value={date} onChange={e => setDate(e.target.value)} />
            <div className="row gap8">
              <button className="btn btn-outline flex1" onClick={onClose}>{t.cancelBtn}</button>
              <button className="btn btn-primary flex1" disabled={sel.length !== 4} onClick={() => sel.length === 4 && setStep(2)}>Suivant →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 700, marginBottom: 4 }}>{t.enterSets}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: '#06b6d4', fontWeight: 700 }}>🔵 {t1names}</span>
              <span style={{ fontSize: 11, color: '#a855f7', fontWeight: 700 }}>🟣 {t2names}</span>
            </div>
            <SetsInput sets={sets} onChange={setSets} t={t} />
            {ps.length > 0 && <SetsPreview sets={ps} t1name={t1names} t2name={t2names} />}
            <div className="row gap8 mt12">
              <button className="btn btn-outline flex1" onClick={() => setStep(1)}>{t.cancelBtn}</button>
              <button className="btn btn-primary flex1" onClick={() => onCreate({ playerIds: sel, sets: ps, date })}>{t.submitMatch}</button>
            </div>
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(139,92,246,0.07)', borderRadius: 8, fontSize: 11, color: '#6b7280', lineHeight: 1.6 }}>
              ℹ️ {lang === 'fr' ? 'Ce match sera envoyé aux 3 autres joueurs pour confirmation.' : 'This match will be sent to the 3 other players for confirmation.'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ══ PLAYERS TAB ══
function PlayersTab({ t, lang, me, players, follows, ratings, toggleFollow, isFollowing, submitRating, getMyRatingFor, setViewPlayerId }) {
  var [search, setSearch] = useState('')
  var [ratingModal, setRatingModal] = useState(null)

  var filtered = players.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ padding: '12px 16px 8px' }}>
        <input className="input" placeholder={'🔍 ' + t.players + '...'} value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {filtered.map(p => {
        var isMe = p.id === me.id
        var isF = isFollowing(p.id)
        var info = getLevelInfo(p.level)
        var lbl = lang === 'en' ? info.labelEn : info.label
        var pRatings = ratings.filter(r => r.rated_id === p.id)
        var badges = computeBadges(p, pRatings)
        return (
          <div key={p.id} className="card">
            <div className="row mb8" style={{ cursor: 'pointer' }} onClick={() => setViewPlayerId(p.id)}>
              <Av size={44} photo={p.photo_url} name={p.name} />
              <div className="col flex1">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="fw700" style={{ fontSize: 14 }}>{p.name}</span>
                  <span>{badges.slice(0, 3).join(' ')}</span>
                </div>
                <div className="row gap4">
                  <span className="text-xs">{p.city} · {calcAge(p.date_of_birth) || p.age} ans</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: info.color, background: info.color + '22', padding: '1px 6px', borderRadius: 20 }}>{lbl}</span>
                </div>
              </div>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="text-xs">{p.wins}V · {p.matches}M · {p.points}pts</span>
              {!isMe && (
                <div className="row gap6">
                  <button className={'btn btn-sm ' + (isF ? 'btn-danger' : 'btn-outline')} onClick={() => toggleFollow(p.id)}>
                    {isF ? t.unfollow : t.follow}
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => setRatingModal(p)}>⭐ {t.rate}</button>
                </div>
              )}
            </div>
          </div>
        )
      })}
      {ratingModal && (
        <RatingModal t={t} lang={lang} target={ratingModal} myExisting={getMyRatingFor(ratingModal.id)}
          submitRating={submitRating} onClose={() => setRatingModal(null)}
        />
      )}
    </div>
  )
}

// ══ PLAYER PROFILE ══
function PlayerProfile({ t, lang, me, player, players, follows, ratings, myMatches, leagues, leagueMatches, isFollowing, toggleFollow, submitRating, getMyRatingFor, onBack }) {
  var [showRating, setShowRating] = useState(false)
  if (!player) return <div className="empty">Joueur introuvable</div>

  var isMe = player.id === me.id
  var isF = isFollowing(player.id)
  var info = getLevelInfo(player.level)
  var pRatings = ratings.filter(r => r.rated_id === player.id)
  var badges = computeBadges(player, pRatings)
  var rl = RATING_LABELS[lang]

  var playerMatches = [
    ...myMatches.filter(m => {
      if (m.league_id) {
        var league = leagues.find(l => l.id === m.league_id)
        return league?.teams?.some(tm => tm.player1_id === player.id || tm.player2_id === player.id)
      }
      return [m.player1_id, m.player2_id, m.player3_id, m.player4_id].includes(player.id)
    })
  ]

  return (
    <div>
      <div className="row" style={{ padding: '14px 16px 8px' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>← Retour</button>
        <span className="fw700" style={{ fontSize: 15, marginLeft: 8 }}>{player.name}</span>
      </div>
      <div className="card">
        <div className="row mb12">
          <Av size={64} photo={player.photo_url} name={player.name} />
          <div className="col flex1">
            <div className="fw700" style={{ fontSize: 17 }}>{player.name}</div>
            <div className="text-sm">{player.city} · {calcAge(player.date_of_birth) || player.age} {t.age}</div>
            <LvBadge val={player.level} lang={lang} />
            {badges.length > 0 && <div style={{ marginTop: 4 }}>{badges.map((b, i) => <span key={i} className="badge-chip">{b}</span>)}</div>}
          </div>
        </div>
        {!isMe && (
          <div className="row gap8">
            <button className={'btn ' + (isF ? 'btn-danger' : 'btn-primary') + ' btn-sm flex1'} onClick={() => toggleFollow(player.id)}>
              {isF ? t.unfollow : t.follow}
            </button>
            <button className="btn btn-outline btn-sm flex1" onClick={() => setShowRating(true)}>⭐ {t.rate}</button>
          </div>
        )}
      </div>

      <div className="grid2" style={{ padding: '0 16px 12px' }}>
        <div className="stat-box"><div className="stat-val">{player.matches}</div><div className="stat-lbl">{t.matches}</div></div>
        <div className="stat-box"><div className="stat-val">{player.wins}</div><div className="stat-lbl">{t.wins}</div></div>
        <div className="stat-box"><div className="stat-val">{player.points}</div><div className="stat-lbl">Points</div></div>
        <div className="stat-box"><div className="stat-val">{player.matches > 0 ? Math.round(player.wins / player.matches * 100) : 0}%</div><div className="stat-lbl">Win%</div></div>
      </div>

      <div className="card">
        <div className="fw600 mb8" style={{ fontSize: 12 }}>{t.ratingsTitle}</div>
        {RATING_KEYS.map(key => {
          var avg = computeRatingAvg(pRatings, key === 'level' ? 'level_rating' : key)
          return (
            <div key={key} className="row mb8" style={{ justifyContent: 'space-between' }}>
              <span className="text-sm">{rl[key]}</span>
              <Stars val={avg} readOnly={true} />
              <span className="text-xs" style={{ marginLeft: 6 }}>{avg > 0 ? avg.toFixed(1) + ' (' + pRatings.length + ')' : '-'}</span>
            </div>
          )
        })}
      </div>

      {playerMatches.length > 0 && (
        <div>
          <div style={{ padding: '0 16px 4px', fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.myMatches}</div>
{playerMatches.slice(0, 6).map(m => {
  var league = m.league_id ? leagues.find(l => l.id === m.league_id) : null
  var t1n = league ? league.teams?.find(x => x.id === m.team1_id)?.name || 'Éq.1' : [m.player1_id, m.player2_id].map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
  var t2n = league ? league.teams?.find(x => x.id === m.team2_id)?.name || 'Éq.2' : [m.player3_id, m.player4_id].map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
  var tm1 = league?.teams?.find(x => x.id === m.team1_id)
  var tm2 = league?.teams?.find(x => x.id === m.team2_id)
  var t1players = tm1 ? [tm1.player1_id, tm1.player2_id].filter(Boolean).map(id => { var p = players.find(x => x.id === id); return p ? p.name.split(' ')[0] : '?' }).join(' & ') : ''
var t2players = tm2 ? [tm2.player1_id, tm2.player2_id].filter(Boolean).map(id => { var p = players.find(x => x.id === id); return p ? p.name.split(' ')[0] : '?' }).join(' & ') : ''
 return (
    <div key={m.id} className="card" style={{ padding: '10px 14px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{t1n} {t.vs} {t2n}</div>
      {league && (t1players || t2players) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: '#06b6d4' }}>{t1players}</span>
          <span style={{ fontSize: 10, color: '#a855f7' }}>{t2players}</span>
        </div>
      )}
      {m.sets?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {m.sets.map((s, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '2px 8px', fontFamily: "'Bebas Neue',cursive", fontSize: 16, color: s.a > s.b ? '#06b6d4' : s.b > s.a ? '#a855f7' : '#9ca3af' }}>{s.a}-{s.b}</span>)}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {league && <span className="text-xs">{league.name}</span>}
        {(m.played_at || m.date) && <span className="text-xs">{m.played_at || m.date}</span>}
      </div>
    </div>
  )
})}
        </div>
      )}

      {showRating && (
        <RatingModal t={t} lang={lang} target={player} myExisting={getMyRatingFor(player.id)}
          submitRating={submitRating} onClose={() => setShowRating(false)}
        />
      )}
    </div>
  )
}

// ══ RATING MODAL ══
function RatingModal({ t, lang, target, myExisting, submitRating, onClose }) {
  var rl = RATING_LABELS[lang]
  var [ratings, setRatings] = useState({
    fairplay: myExisting?.fairplay || 0,
    service: myExisting?.service || 0,
    reflex: myExisting?.reflex || 0,
    power: myExisting?.power || 0,
    level: myExisting?.level_rating || 0
  })
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">⭐ {t.rate} {target.name}</div>
        {RATING_KEYS.map(k => (
          <div key={k} className="row mb12" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13 }}>{rl[k]}</span>
            <Stars val={ratings[k]} onChange={v => setRatings(p => ({ ...p, [k]: v }))} />
          </div>
        ))}
        <div className="row gap8">
          <button className="btn btn-outline flex1" onClick={onClose}>{t.cancelBtn}</button>
          <button className="btn btn-primary flex1" onClick={() => { submitRating(target.id, ratings); onClose() }}>{t.saveBtn}</button>
        </div>
      </div>
    </div>
  )
}

// ══ LEAGUES TAB ══
function LeaguesTab({ t, lang, me, leagues, players, createLeague, joinLeague, setViewLeagueId, setPreviewLeagueId }) {
  var [showCreate, setShowCreate] = useState(false)
  var myLeagues = leagues.filter(l => l.league_members?.some(lm => lm.player_id === me.id))
  var otherLeagues = leagues.filter(l => !l.league_members?.some(lm => lm.player_id === me.id))

  function renderLeague(l) {
    var isMem = l.league_members?.some(lm => lm.player_id === me.id)
    return (
      <div key={l.id} className="card card-purple">
        <div style={{ cursor: 'pointer' }} onClick={() => isMem ? setViewLeagueId(l.id) : setPreviewLeagueId(l.id)}>
          <div className="row mb4">
            <div className="fw700 flex1" style={{ fontSize: 15 }}>{l.is_private ? '🔒 ' : '🌍 '}{l.name}</div>
            {isMem && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>✓ {lang === 'en' ? 'Member' : 'Membre'}</span>}
          </div>
          <div className="text-sm mb4">{l.season}</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: isMem ? 0 : 8 }}>
            <span className="text-xs">{l.league_members?.length || 0} {t.memberCount}</span>
            <span className="text-xs">{t.duration}: {l.match_duration}min</span>
            <span className="text-xs">{t.minAgeShort}: {l.min_age}ans</span>
          </div>
        </div>
        {!isMem && (
          <button className="btn btn-green btn-sm" style={{ width: '100%' }} onClick={() => setPreviewLeagueId(l.id)}>
            {l.is_private ? '🔒 ' : '🌍 '}{t.joinLeague}
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="section-title" style={{ padding: 0 }}>{t.leagues}</div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>+ {t.createLeague}</button>
      </div>
      {myLeagues.length > 0 && (
  <div>
    <div style={{ padding: '12px 16px 4px', fontSize: 11, color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.myLeagues}</div>
    {myLeagues.map(renderLeague)}
  </div>
)}
      {otherLeagues.length > 0 && (
        <div>
          <div style={{ padding: '12px 16px 4px', fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.otherLeagues}</div>
          {otherLeagues.map(renderLeague)}
        </div>
      )}
      {leagues.length === 0 && <div className="empty">Aucune ligue.<br />Crée la première ! 🎾</div>}
      {showCreate && (
        <CreateLeagueModal t={t} lang={lang}
          onCreate={async d => { await createLeague(d); setShowCreate(false) }}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  )
}

// ══ LEAGUE PREVIEW ══
function LeaguePreview({ t, lang, league, players, me, joinLeague, setViewLeagueId, setPreviewLeagueId }) {
  var [code, setCode] = useState('')
  var [codeError, setCodeError] = useState('')
  var isMem = league.league_members?.some(lm => lm.player_id === me.id)
  var admin = players.find(p => p.id === league.admin_id)

  async function doJoin() {
    if (league.is_private) {
      if (!code.trim()) {
        setCodeError(lang === 'fr' ? 'Entre le code d\'accès.' : 'Enter the access code.')
        return
      }
      var { data: valid, error: rpcErr } = await supabase.rpc('verify_league_code', {
        p_league_id: league.id,
        p_code: code.trim()
      })
      if (rpcErr || !valid) {
        setCodeError(lang === 'fr' ? 'Code incorrect.' : 'Wrong code.')
        return
      }
    }
    await joinLeague(league.id)
    setViewLeagueId(league.id)
    setPreviewLeagueId(null)
  }

  function shareLeague() {
    var url = window.location.origin + '?league=' + league.id
    var txt = lang === 'fr'
      ? '🎾 Rejoins ma ligue PadelLink : *' + league.name + '*\n' + url
      : '🎾 Join my PadelLink league: *' + league.name + '*\n' + url
    var wa = 'https://wa.me/?text=' + encodeURIComponent(txt)
    window.open(wa, '_blank')
  }

  return (
    <div>
      <div className="row" style={{ padding: '14px 16px 8px' }}>
        <button className="btn btn-outline btn-sm" onClick={() => setPreviewLeagueId(null)}>← {lang === 'en' ? 'Back' : 'Retour'}</button>
        <span className="fw700" style={{ fontSize: 15, marginLeft: 8 }}>{league.is_private ? '🔒 ' : '🌍 '}{league.name}</span>
      </div>

      {!isMem && (
        <div style={{ padding: '0 16px 10px' }}>
          {league.is_private && (
            <div style={{ marginBottom: 8 }}>
              <input className="input" placeholder={t.enterCode + ' (max 10)'} value={code} maxLength={10}
                onChange={e => { setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()); setCodeError('') }}
                style={{ marginBottom: 4 }} />
              {codeError && <div style={{ fontSize: 11, color: '#ef4444' }}>{codeError}</div>}
            </div>
          )}
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={doJoin}>✅ {t.confirmJoin}</button>
        </div>
      )}
      {isMem && (
        <div style={{ padding: '0 16px 10px', display: 'flex', gap: 8 }}>
          <button className="btn btn-green flex1" onClick={() => { setViewLeagueId(league.id); setPreviewLeagueId(null) }}>
            {lang === 'en' ? 'Open league' : 'Ouvrir la ligue'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={shareLeague} title="Partager sur WhatsApp">📤</button>
        </div>
      )}

      <div className="card card-purple">
        <div className="fw700 mb4" style={{ fontSize: 16 }}>{league.name}</div>
        <div className="text-sm mb8">{league.season}</div>
        <div className="grid2" style={{ marginBottom: 12 }}>
          <div className="stat-box"><div className="stat-val">{league.league_members?.length || 0}</div><div className="stat-lbl">{t.memberCount}</div></div>
          <div className="stat-box"><div className="stat-val">{league.sets_per_match}</div><div className="stat-lbl">{t.setsPerMatch}</div></div>
          <div className="stat-box"><div className="stat-val">{league.match_duration}'</div><div className="stat-lbl">{t.duration}</div></div>
          <div className="stat-box"><div className="stat-val">{league.min_age}+</div><div className="stat-lbl">{t.minAgeShort}</div></div>
        </div>
        {league.rules && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>{t.leagueRules}</div>
            <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6 }}>{league.rules}</div>
          </div>
        )}
        {admin && <div className="text-xs mb4">Admin: {admin.name}</div>}
      </div>

      <div style={{ padding: '0 16px 4px', fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.leagueMembers} ({league.league_members?.length || 0})</div>
      {league.league_members?.map(lm => {
        var p = players.find(x => x.id === lm.player_id)
        if (!p) return null
        return (
          <div key={lm.player_id} className="rank-row">
            <Av size={36} photo={p.photo_url} name={p.name} />
            <div className="col flex1">
              <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}{lm.role === 'admin' ? ' 👑' : lm.role === 'sub_admin' ? ' ⭐' : ''}</span>
              <span className="text-xs">{p.city}</span>
            </div>
            <LvBadge val={p.level} lang={lang} />
          </div>
        )
      })}

    </div>
  )
}

// ══ CREATE LEAGUE MODAL ══
function CreateLeagueModal({ t, lang, onCreate, onClose }) {
  var [form, setForm] = useState({ name: '', season: '', rules: '', setsPerMatch: 3, matchDuration: 90, minAge: 16, isPrivate: false, code: '' })
  var set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">+ {t.createLeague}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input className="input" placeholder={t.leagueName} maxLength={50} value={form.name} onChange={e => set('name', e.target.value)} />
          <input className="input" placeholder={t.season} maxLength={50} value={form.season} onChange={e => set('season', e.target.value)} />
          <textarea className="input" placeholder={t.rules} value={form.rules} rows={3} maxLength={500} onChange={e => set('rules', e.target.value)} style={{ resize: 'none' }} />
          <div className="row gap8">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{t.setsMatch}</div>
              <select className="select" value={form.setsPerMatch} onChange={e => set('setsPerMatch', parseInt(e.target.value))}>
                <option value={1}>1 set</option>
                <option value={3}>Best of 3</option>
                <option value={5}>Best of 5</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{t.matchDuration}</div>
              <input className="input" type="number" value={form.matchDuration} onChange={e => set('matchDuration', parseInt(e.target.value) || 90)} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{t.minAge}</div>
            <input className="input" type="number" value={form.minAge} onChange={e => set('minAge', parseInt(e.target.value) || 0)} />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t.visibilityLabel}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10, lineHeight: 1.6 }}>{form.isPrivate ? t.visibilityPrivateDesc : t.visibilityPublicDesc}</div>
            <Toggle on={form.isPrivate} onToggle={() => set('isPrivate', !form.isPrivate)} label={t.privateToggleLabel} />
            {form.isPrivate && <input className="input" style={{ marginTop: 10 }} placeholder={t.privateCode + ' (max 10 car.)'}
              maxLength={10} value={form.code}
              onChange={e => set('code', e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10))} />}
          </div>
        </div>
        <div className="row gap8 mt12">
          <button className="btn btn-outline flex1" onClick={onClose}>{t.cancelBtn}</button>
          <button className="btn btn-primary flex1" disabled={!form.name || !form.season} onClick={() => { if (form.name && form.season) onCreate(form) }}>{t.create}</button>
        </div>
      </div>
    </div>
  )
}

// ══ LEAGUE VIEW ══
function LeagueView({ t, lang, league, players, me, leagueMatches, selectedTab, setSelectedTab, addLeagueMatch, expelMember, sendChatMsg, toggleSubAdmin, requestLeave, resolveLeave, randomDrawTeams, leaveRequests, onBack, loadLeagues }) {
  var isAdmin = league.admin_id === me.id
  var myRole = league.league_members?.find(lm => lm.player_id === me.id)?.role
  var isSubAdmin = myRole === 'sub_admin'
  var canPostScore = isAdmin || isSubAdmin
  var hasLeaveReq = leaveRequests.some(r => r.league_id === league.id && r.player_id === me.id)
  var myLeaveReqs = leaveRequests.filter(r => r.league_id === league.id)

  var LTABS = [
    { id: 'ranking2', label: t.ranking2 },
    { id: 'matches', label: t.matches },
    { id: 'teams', label: t.teams },
    { id: 'members', label: t.members },
    { id: 'chat', label: t.chat },
  ]

  function computeStandings() {
    var tbl = {}
    ;(league.teams || []).forEach(tm => { tbl[tm.id] = { id: tm.id, name: tm.name, P: 0, W: 0, D: 0, PTS: 0 } })
    ;(leagueMatches || []).forEach(m => {
      if (!tbl[m.team1_id]) tbl[m.team1_id] = { id: m.team1_id, name: '?', P: 0, W: 0, D: 0, PTS: 0 }
      if (!tbl[m.team2_id]) tbl[m.team2_id] = { id: m.team2_id, name: '?', P: 0, W: 0, D: 0, PTS: 0 }
      tbl[m.team1_id].P++; tbl[m.team2_id].P++
      if (m.winner_id === m.team1_id) { tbl[m.team1_id].W++; tbl[m.team1_id].PTS += 3; tbl[m.team2_id].D++ }
      else { tbl[m.team2_id].W++; tbl[m.team2_id].PTS += 3; tbl[m.team1_id].D++ }
    })
    return Object.values(tbl).sort((a, b) => b.PTS - a.PTS)
  }

  return (
    <div>
      <div className="row" style={{ padding: '14px 16px 4px' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>← {t.leagues}</button>
        <span className="fw700" style={{ fontSize: 14, marginLeft: 8 }}>{league.is_private ? '🔒 ' : '🌍 '}{league.name}</span>
        {isAdmin && (
          <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto', fontSize: 11 }}
            onClick={() => {
              var url = window.location.origin + '?league=' + league.id
              var txt = lang === 'fr'
                ? '🎾 Rejoins ma ligue PadelLink : *' + league.name + '*\n' + url
                : '🎾 Join my PadelLink league: *' + league.name + '*\n' + url
              window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank')
            }}>📤 Partager</button>
        )}
      </div>
      <div style={{ padding: '0 16px 6px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span className="text-xs">{t.duration}: {league.match_duration}min</span>
        <span className="text-xs">{t.minAgeShort}: {league.min_age}ans</span>
        <span className="text-xs">{t.setsPerMatch}: {league.sets_per_match}</span>
        {isAdmin && <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>👑 Admin</span>}
        {isSubAdmin && <span style={{ fontSize: 10, color: '#a855f7', fontWeight: 700 }}>⭐ Sub-admin</span>}
      </div>

      {!isAdmin && (
        <div style={{ padding: '0 16px 8px' }}>
          {hasLeaveReq
            ? <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>⏳ {t.leaveRequest}</div>
            : <button className="btn btn-danger btn-sm" onClick={() => requestLeave(league.id)}>{t.leaveLeague}</button>
          }
        </div>
      )}

      {isAdmin && myLeaveReqs.length > 0 && (
        <div style={{ margin: '0 16px 8px', padding: '10px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>{t.pendingLeaveRequests}</div>
          {myLeaveReqs.map(r => {
            var p = players.find(x => x.id === r.player_id)
            return (
              <div key={r.id} className="row" style={{ marginBottom: 6 }}>
                <span className="flex1" style={{ fontSize: 12 }}>{p?.name}</span>
                <button className="btn btn-green btn-sm" onClick={() => resolveLeave(league.id, r.player_id, true)}>✓ {t.leaveApprove}</button>
                <button className="btn btn-danger btn-sm" onClick={() => resolveLeave(league.id, r.player_id, false)}>✕ {t.leaveDecline}</button>
              </div>
            )
          })}
        </div>
      )}

      <div className="tab-bar">
        {LTABS.map(lt => <button key={lt.id} className={'tab-pill ' + (selectedTab === lt.id ? 'active' : '')} onClick={() => setSelectedTab(lt.id)}>{lt.label}</button>)}
      </div>

      {selectedTab === 'ranking2' && <LeagueStandings t={t} standings={computeStandings()} />}
      {selectedTab === 'matches' && <LeagueMatchesTab t={t} lang={lang} league={league} players={players} leagueMatches={leagueMatches} addLeagueMatch={addLeagueMatch} canPostScore={canPostScore} />}
      {selectedTab === 'teams' && <LeagueTeamsTab t={t} lang={lang} league={league} players={players} isAdmin={isAdmin} isSubAdmin={isSubAdmin} randomDrawTeams={randomDrawTeams} loadLeagues={loadLeagues} />}
      {selectedTab === 'members' && <LeagueMembersTab t={t} lang={lang} league={league} players={players} isAdmin={isAdmin} expelMember={expelMember} toggleSubAdmin={toggleSubAdmin} me={me} />}
      {selectedTab === 'chat' && <LeagueChatTab t={t} league={league} players={players} me={me} sendChatMsg={sendChatMsg} />}
    </div>
  )
}

function LeagueStandings({ t, standings }) {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 36px 36px 36px 44px', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
        <span>{t.teams}</span>
        <span style={{ textAlign: 'center' }}>{t.played}</span>
        <span style={{ textAlign: 'center' }}>{t.wins}</span>
        <span style={{ textAlign: 'center' }}>{t.losses}</span>
        <span style={{ textAlign: 'center' }}>{t.pts}</span>
      </div>
      {standings.map((row, idx) => (
        <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 36px 36px 36px 44px', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx === 0 ? 'rgba(139,92,246,0.05)' : 'transparent' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: idx === 0 ? '#a855f7' : '#e2e8f0' }}>{idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : ''}{row.name}</span>
          <span style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>{row.P}</span>
          <span style={{ textAlign: 'center', fontSize: 13, color: '#10b981' }}>{row.W}</span>
          <span style={{ textAlign: 'center', fontSize: 13, color: '#ef4444' }}>{row.D}</span>
          <span style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#a855f7' }}>{row.PTS}</span>
        </div>
      ))}
      {standings.length === 0 && <div className="empty">{t.noMatchYet}</div>}
    </div>
  )
}

function LeagueMatchesTab({ t, lang, league, players, leagueMatches, addLeagueMatch, canPostScore }) {
  var [t1, setT1] = useState('')
  var [t2, setT2] = useState('')
  var [sets, setSets] = useState([{ a: '', b: '' }])
  var [date, setDate] = useState('')
  var [saving, setSaving] = useState(false)
  var [errMsg, setErrMsg] = useState(null)

  function getTeamName(id) { return (league.teams || []).find(x => x.id == id)?.name || '?' }
  function getTeamPNames(id) {
    var tm = (league.teams || []).find(x => x.id == id)
    if (!tm) return ''
    return [tm.player1_id, tm.player2_id].map(pid => players.find(p => p.id === pid)?.name || '?').join(' & ')
  }

  var ps = sets.map(s => ({ a: parseInt(s.a) || 0, b: parseInt(s.b) || 0 })).filter(s => s.a > 0 || s.b > 0)

  async function handleAdd() {
    if (!t1 || !t2 || t1 === t2 || !ps.length) return
    setSaving(true); setErrMsg(null)
    var tid1 = t1, tid2 = t2
    var winnerId = matchWinner(tid1, tid2, ps)
    var err = await addLeagueMatch(league.id, { team1Id: tid1, team2Id: tid2, sets: ps, date, winnerId })
    setSaving(false)
    if (err) { setErrMsg(err.message); return }
    setT1(''); setT2(''); setSets([{ a: '', b: '' }]); setDate('')
  }

  return (
    <div style={{ padding: '0 16px' }}>
      {canPostScore ? (
        <div className="card mt8">
          <div className="fw600 mb8" style={{ fontSize: 13 }}>{t.addMatch}</div>
          <div className="row gap8 mb4">
            <div style={{ flex: 1 }}>
              <select className="select" value={t1} onChange={e => setT1(e.target.value)}>
                <option value="">{t.team1}</option>
                {(league.teams || []).map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
              </select>
              {t1 && <div style={{ fontSize: 10, color: '#06b6d4', marginTop: 4 }}>{getTeamPNames(t1)}</div>}
            </div>
            <span className="score-vs">vs</span>
            <div style={{ flex: 1 }}>
              <select className="select" value={t2} onChange={e => setT2(e.target.value)}>
                <option value="">{t.team2}</option>
                {(league.teams || []).filter(tm => '' + tm.id !== t1).map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
              </select>
              {t2 && <div style={{ fontSize: 10, color: '#a855f7', marginTop: 4 }}>{getTeamPNames(t2)}</div>}
            </div>
          </div>
          <div style={{ marginTop: 10, marginBottom: 6, fontSize: 11, color: '#a855f7', fontWeight: 700 }}>{t.enterSets}</div>
          <SetsInput sets={sets} onChange={setSets} t={t} />
          {t1 && t2 && ps.length > 0 && <SetsPreview sets={ps} t1name={getTeamName(t1)} t2name={getTeamName(t2)} />}
          <input className="input mb8 mt8" type="date" value={date} onChange={e => setDate(e.target.value)} />
          {errMsg && <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 8 }}>{errMsg}</div>}
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={saving} onClick={handleAdd}>{saving ? '⏳...' : t.addTeamMatch}</button>
        </div>
      ) : (
        <div className="card mt8" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>🔒</div>
          <div className="text-sm">{t.adminOnly}</div>
        </div>
      )}
      {leagueMatches.length === 0 && <div className="empty">{t.noMatchYet}</div>}
      {leagueMatches.slice().reverse().map(m => {
        var t1n = getTeamName(m.team1_id), t2n = getTeamName(m.team2_id)
        var t1pnames = getTeamPNames(m.team1_id), t2pnames = getTeamPNames(m.team2_id)
        var w = (league.teams || []).find(x => x.id === m.winner_id)
        return (
          <div key={m.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{t1n} {t.vs} {t2n}</span>
              {m.played_at && <span className="text-xs">{m.played_at}</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 10, color: '#06b6d4' }}>{t1pnames}</span>
              <span style={{ fontSize: 10, color: '#a855f7' }}>{t2pnames}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
              {(m.sets || []).map((s, i) => <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '4px 10px', fontFamily: "'Bebas Neue',cursive", fontSize: 18, color: s.a > s.b ? '#06b6d4' : s.b > s.a ? '#a855f7' : '#9ca3af' }}>{s.a}-{s.b}</div>)}
            </div>
            {w && <div style={{ fontSize: 11, color: '#10b981' }}>🏆 {t.winner}: {w.name}</div>}
          </div>
        )
      })}
    </div>
  )
}

function LeagueTeamsTab({ t, lang, league, players, isAdmin, isSubAdmin, randomDrawTeams, loadLeagues }) {
  var canEdit = isAdmin || isSubAdmin
  var [editId, setEditId] = useState(null)
  var [eName, setEName] = useState('')
  var [eP1, setEP1] = useState('')
  var [eP2, setEP2] = useState('')
  var [saving, setSaving] = useState(false)

  async function saveTeamEdit() {
    setSaving(true)
    await supabase.from('teams').update({ name: eName, player1_id: eP1 || null, player2_id: eP2 || null }).eq('id', editId)
    await loadLeagues()
    setEditId(null)
    setSaving(false)
  }

  async function handleDraw() {
    await randomDrawTeams(league.id)
  }
async function balanceTeams() {
  var leaguePlayerIds = (league.league_members || []).map(lm => lm.player_id)
  var lp = players.filter(p => leaguePlayerIds.includes(p.id)).slice().sort((a, b) => b.level - a.level)
  var existing = league.teams || []
  for (var tm of existing) { await supabase.from('teams').delete().eq('id', tm.id) }
  var n = Math.floor(lp.length / 2)
  for (var i = 0; i < n; i++) {
    await supabase.from('teams').insert({ league_id: league.id, name: (lang === 'en' ? 'Team ' : 'Équipe ') + (i + 1), player1_id: lp[i*2].id, player2_id: lp[i*2+1]?.id || null })
  }
  await loadLeagues()
}
var leaguePlayerIds = (league.league_members || []).map(lm => lm.player_id)
var leaguePlayers = players.filter(p => leaguePlayerIds.includes(p.id))
  
  return (
    <div style={{ padding: '0 16px' }}>
      {canEdit && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 12 }}>
  <button className="btn btn-outline flex1" onClick={handleDraw}>🎲 {t.randomDraw}</button>
  <button style={{ flex: 1, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4', borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }} onClick={balanceTeams}>⚖️ {lang === 'fr' ? 'Équilibrer' : 'Balance'}</button>
</div>
      )}
      {(league.teams || []).length === 0 && <div className="empty">{lang === 'en' ? 'No teams yet.' : 'Aucune équipe.'}</div>}
      {(league.teams || []).map(tm => {
        var p1 = players.find(p => p.id === tm.player1_id)
        var p2 = players.find(p => p.id === tm.player2_id)
        var isEd = editId === tm.id
        return (
          <div key={tm.id} className="card mb8">
            {isEd ? (
              <div>
                <input className="input mb8" value={eName} onChange={e => setEName(e.target.value)} placeholder={lang === 'en' ? 'Team name' : "Nom de l'équipe"} />
                <select className="select mb8" value={eP1} onChange={e => setEP1(e.target.value)}>
                  <option value="">{lang === 'en' ? 'Player 1' : 'Joueur 1'}</option>
                  {leaguePlayers.map(p => <option key={p.id} value={p.id}>{p.name} (Niv. {p.level})</option>)}
                </select>
                <select className="select mb8" value={eP2} onChange={e => setEP2(e.target.value)}>
                  <option value="">{lang === 'en' ? 'Player 2' : 'Joueur 2'}</option>
                  {players.filter(p => p.id !== eP1).map(p => <option key={p.id} value={p.id}>{p.name}(Niv. {p.level}</option>)}
                </select>
                <div className="row gap8">
                  <button className="btn btn-outline flex1" onClick={() => setEditId(null)}>{t.cancelBtn}</button>
                  <button className="btn btn-primary flex1" disabled={saving} onClick={saveTeamEdit}>{saving ? '⏳' : t.saveBtn}</button>
                </div>
              </div>
            ) : (
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="col">
                  <div className="fw600" style={{ fontSize: 13 }}>{tm.name}</div>
                  <div className="text-xs">{p1?.name || '?'} & {p2?.name || '?'}</div>
                </div>
                {canEdit && (
                  <button className="btn btn-outline btn-sm" onClick={() => { setEditId(tm.id); setEName(tm.name); setEP1(tm.player1_id || ''); setEP2(tm.player2_id || '') }}>✏️</button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function LeagueMembersTab({ t, lang, league, players, isAdmin, expelMember, toggleSubAdmin, me }) {
  return (
    <div style={{ padding: '0 16px' }}>
      {(league.league_members || []).map(lm => {
        var p = players.find(x => x.id === lm.player_id)
        if (!p) return null
        var isAdm = lm.role === 'admin'
        var isSub = lm.role === 'sub_admin'
        return (
          <div key={lm.player_id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="row">
              <Av size={36} photo={p.photo_url} name={p.name} />
              <div className="col flex1">
                <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}{isAdm ? ' 👑' : isSub ? ' ⭐' : ''}</span>
                <span className="text-xs">{p.city} · Niv {p.level}{isSub ? ' · ' + t.canPostScore : ''}</span>
              </div>
              {isAdmin && !isAdm && (
                <div className="row gap4">
                  <button className={'btn btn-sm ' + (isSub ? 'btn-yellow' : 'btn-outline')} style={{ fontSize: 10 }}
                    onClick={() => toggleSubAdmin(league.id, lm.player_id)}>
                    {isSub ? '⭐ ' + t.removeSubAdmin : '⭐ ' + t.addSubAdmin}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => expelMember(league.id, lm.player_id)}>{t.expel}</button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LeagueChatTab({ t, league, players, me, sendChatMsg }) {
  var [msg, setMsg] = useState('')
  var [messages, setMessages] = useState([])
  var [loading, setLoading] = useState(true)
  var chatEndRef = useRef(null)

  useEffect(() => {
    loadMessages()
    var channel = supabase
      .channel('chat:' + league.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'league_id=eq.' + league.id }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [league.id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function loadMessages() {
    var { data } = await supabase.from('chat_messages').select('*').eq('league_id', league.id).order('created_at', { ascending: true }).limit(100)
    if (data) setMessages(data)
    setLoading(false)
  }

  async function handleSend() {
    var clean = msg.trim().slice(0, 500)
    if (!clean) return
    await sendChatMsg(league.id, clean)
    setMsg('')
  }

  return (
    <div>
      <div style={{ padding: '10px 16px', minHeight: 200, maxHeight: 380, overflowY: 'auto' }}>
        {loading && <div className="loading-screen">{t.loading}</div>}
        {messages.map(c => {
          var isMe = c.player_id === me.id
          var sender = players.find(p => p.id === c.player_id)
          return (
            <div key={c.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
              {!isMe && <span style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>{sender?.name || '?'}</span>}
              <div className={'chat-bubble ' + (isMe ? 'chat-me' : 'chat-other')}>{c.content}</div>
              <span style={{ fontSize: 9, color: '#374151', marginTop: 2 }}>{new Date(c.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input-row">
        <input className="input flex1" placeholder={t.message} value={msg} maxLength={500}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()} />
        <button className="btn btn-primary btn-sm" onClick={handleSend}>{t.send}</button>
      </div>
    </div>
  )
}

// ══ RANKING ══
function RankingTab({ t, lang, players, leagues, leagueMatches, follows, ratings, rankTab, setRankTab, setViewPlayerId, setTab }) {
  var sorted = [...players].sort((a, b) => b.points - a.points)

  function formColor(h) {
    if (!h?.length) return '#6b7280'
    var last = h.slice(-5)
    var wr = last.filter(x => x === 1).length / last.length
    return wr >= 0.6 ? '#10b981' : wr >= 0.4 ? '#f59e0b' : '#ef4444'
  }

  return (
    <div>
      <div className="section-title">{t.ranking}</div>
      <div className="tab-bar">
        <button className={'tab-pill ' + (rankTab === 'world' ? 'active' : '')} onClick={() => setRankTab('world')}>{t.worldRank}</button>
        <button className={'tab-pill ' + (rankTab === 'league' ? 'active' : '')} onClick={() => setRankTab('league')}>{t.leagueRank}</button>
      </div>

      {rankTab === 'world' && (
        <div>
          {sorted.map((p, idx) => {
            var info = getLevelInfo(p.level)
            var lbl = lang === 'en' ? info.labelEn : info.label
            var nc = 'rank-num' + (idx === 0 ? ' top1' : idx === 1 ? ' top2' : idx === 2 ? ' top3' : '')
            var pRatings = ratings.filter(r => r.rated_id === p.id)
            var badges = computeBadges(p, pRatings)
            return (
              <div key={p.id} className="rank-row" onClick={() => { setViewPlayerId(p.id); setTab('players') }}>
                <div className={nc}>{idx + 1}</div>
                <Av size={34} photo={p.photo_url} name={p.name} />
                <div className="col flex1">
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}{badges.length ? ' ' + badges.slice(0, 2).join('') : ''}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <span style={{ fontSize: 10, color: info.color }}>{lbl}</span>
                    <span className="text-xs">{p.city}</span>
                  </div>
                </div>
                <span style={{ fontSize: 18, color: formColor(p.win_history) }}>●</span>
                <div style={{ textAlign: 'right', fontFamily: "'Bebas Neue',cursive", fontSize: 20, color: '#a855f7', minWidth: 50 }}>{p.points}</div>
              </div>
            )
          })}
          <div className="card mt8">
            <div className="fw600 mb8" style={{ fontSize: 12 }}>{lang === 'en' ? 'Point system:' : 'Système de points :'}</div>
            <div className="text-xs" style={{ lineHeight: 2 }}>
              🏆 {lang === 'en' ? 'Win' : 'Victoire'} = +10pts{'\n'}
              ⭐ {lang === 'en' ? 'Clean sweep' : 'Set blanc'} = +12pts{'\n'}
              ❌ {lang === 'en' ? 'Loss' : 'Défaite'} = +3pts
            </div>
          </div>
        </div>
      )}

      {rankTab === 'league' && (
        <div>
          {leagues.map(l => {
            var tbl = {}
            ;(l.teams || []).forEach(tm => { tbl[tm.id] = { id: tm.id, name: tm.name, P: 0, W: 0, D: 0, PTS: 0 } })
            leagueMatches.filter(m => m.league_id === l.id).forEach(m => {
              if (!tbl[m.team1_id]) tbl[m.team1_id] = { id: m.team1_id, name: '?', P: 0, W: 0, D: 0, PTS: 0 }
              if (!tbl[m.team2_id]) tbl[m.team2_id] = { id: m.team2_id, name: '?', P: 0, W: 0, D: 0, PTS: 0 }
              tbl[m.team1_id].P++; tbl[m.team2_id].P++
              if (m.winner_id === m.team1_id) { tbl[m.team1_id].W++; tbl[m.team1_id].PTS += 3; tbl[m.team2_id].D++ }
              else { tbl[m.team2_id].W++; tbl[m.team2_id].PTS += 3; tbl[m.team1_id].D++ }
            })
            var rows = Object.values(tbl).sort((a, b) => b.PTS - a.PTS)
            return (
              <div key={l.id} style={{ marginBottom: 16 }}>
                <div style={{ padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#a855f7' }}>{l.is_private ? '🔒 ' : '🌍 '}{l.name}</div>
                {rows.map((row, idx) => (
                  <div key={row.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 13, color: idx === 0 ? '#a855f7' : '#e2e8f0' }}>{idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : ''}{row.name}</span>
                    <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, color: '#a855f7' }}>{row.PTS} PTS</span>
                  </div>
                ))}
                {rows.length === 0 && <div className="empty" style={{ padding: '12px 16px' }}>{t.noMatchYet}</div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ══ PROFILE ══
function ProfileTab({ t, lang, me, players, myRatings, myBadges, myMatches, leagues, leagueMatches, updateProfile, uploadPhoto, onSignOut }) {
  var [editing, setEditing] = useState(false)
  var [eName, setEName] = useState(me.name)
  var [eCity, setECity] = useState(me.city)
  var [eLevel, setELevel] = useState(me.level)
  var [showLv, setShowLv] = useState(false)
  var [showBd, setShowBd] = useState(false)
  var fileRef = useRef(null)
  var info = getLevelInfo(me.level)
  var lbl = lang === 'en' ? info.labelEn : info.label
  var rl = RATING_LABELS[lang]

  // SVG points graph
  var n = Math.min(myMatches.length, 10)
  var SVG_W = 300, SVG_H = 80
  var cumPts = 0
  var ptsSeries = []
  for (var i = 0; i < n; i++) {
    cumPts += me.points / Math.max(me.matches, 1)
    ptsSeries.push(Math.round(cumPts))
  }
  var maxP = Math.max(...ptsSeries, 1)
  var sx = i2 => n <= 1 ? SVG_W / 2 : 20 + i2 * (SVG_W - 40) / (n - 1)
  var sy = v => SVG_H - 8 - (v / maxP) * (SVG_H - 16)
  var pPath = n > 0 ? ptsSeries.map((v, i2) => (i2 === 0 ? 'M' : 'L') + sx(i2) + ',' + sy(v)).join(' ') : ''

  async function save() {
    await updateProfile({ name: eName.trim().slice(0, 50), city: eCity.trim().slice(0, 50), level: eLevel })
    setEditing(false)
  }

  return (
    <div>
      <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="section-title" style={{ padding: 0 }}>{t.profile}</div>
        <button className="btn btn-danger btn-sm" onClick={onSignOut}>{t.signOut}</button>
      </div>

      <div className="card mt8">
        <div className="row mb12">
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileRef.current?.click()}>
            <Av size={64} photo={me.photo_url} name={me.name} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#7c3aed', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📷</div>
            <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={e => { var f = e.target.files[0]; if (f) uploadPhoto(f) }} />
          </div>
          {!editing ? (
            <div className="col flex1">
              <div className="fw700" style={{ fontSize: 18 }}>{me.name}</div>
              <div className="text-sm">{me.city} · {calcAge(me.date_of_birth) || me.age} {t.age}</div>
              <LvBadge val={me.level} lang={lang} />
              {myBadges.length > 0 && <div style={{ marginTop: 4 }}>{myBadges.map((b, i) => <span key={i} className="badge-chip">{b}</span>)}</div>}
            </div>
          ) : (
            <div className="col flex1" style={{ gap: 6 }}>
              <input className="input" value={eName} maxLength={50} onChange={e => setEName(e.target.value)} />
              <input className="input" value={eCity} maxLength={50} onChange={e => setECity(e.target.value)} />
              <select className="select" value={eLevel} onChange={e => setELevel(parseFloat(e.target.value))}>
                {LEVELS.map(lv => <option key={lv.val} value={lv.val}>{lv.val} — {lang === 'en' ? lv.labelEn : lv.label}</option>)}
              </select>
            </div>
          )}
        </div>
        {editing ? (
          <div className="row gap8">
            <button className="btn btn-outline flex1" onClick={() => setEditing(false)}>{t.cancelBtn}</button>
            <button className="btn btn-primary flex1" onClick={save}>{t.saveBtn}</button>
          </div>
        ) : (
          <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { setEName(me.name); setECity(me.city); setELevel(me.level); setEditing(true) }}>✏️ {t.editProfile}</button>
        )}
      </div>

      <div className="grid2" style={{ padding: '0 16px 12px' }}>
        <div className="stat-box"><div className="stat-val">{me.matches}</div><div className="stat-lbl">{t.matches}</div></div>
        <div className="stat-box"><div className="stat-val">{me.wins}</div><div className="stat-lbl">{t.wins}</div></div>
        <div className="stat-box"><div className="stat-val">{me.points}</div><div className="stat-lbl">Points</div></div>
        <div className="stat-box"><div className="stat-val">{me.matches > 0 ? Math.round(me.wins / me.matches * 100) : 0}%</div><div className="stat-lbl">Win%</div></div>
      </div>

      {n > 1 && (
        <div className="card">
          <div className="fw600 mb8" style={{ fontSize: 12 }}>{t.pointsHistory}</div>
          <svg width={SVG_W} height={SVG_H} style={{ display: 'block', margin: '0 auto' }}>
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={pPath + ' L' + sx(n - 1) + ',' + SVG_H + ' L' + sx(0) + ',' + SVG_H + ' Z'} fill="url(#pg)" />
            <path d={pPath} fill="none" stroke="#a855f7" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </div>
      )}

      <div className="card">
        <div className="fw600 mb8" style={{ fontSize: 12 }}>{t.currentForm}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {(me.win_history || []).slice(-10).map((w, i) => (
            <div key={i} style={{ width: 24, height: 24, borderRadius: 4, background: w === 1 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
              {w === 1 ? 'W' : 'L'}
            </div>
          ))}
          {!(me.win_history || []).length && <span className="text-xs">{t.noMatches}</span>}
        </div>
      </div>

      <div className="card">
        <div className="fw600 mb8" style={{ fontSize: 12 }}>{t.ratingsTitle}</div>
        {RATING_KEYS.map(key => {
          var avg = computeRatingAvg(myRatings, key === 'level' ? 'level_rating' : key)
          return (
            <div key={key} className="row mb8" style={{ justifyContent: 'space-between' }}>
              <span className="text-sm">{rl[key]}</span>
              <Stars val={avg} readOnly={true} />
              <span className="text-xs" style={{ marginLeft: 6 }}>{avg > 0 ? avg.toFixed(1) + ' (' + myRatings.length + ')' : '-'}</span>
            </div>
          )
        })}
      </div>

      <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8 }}>
        <button className="btn btn-outline flex1" onClick={() => setShowLv(!showLv)}>📊 {t.showLevels}</button>
        <button className="btn btn-outline flex1" onClick={() => setShowBd(!showBd)}>🏅 {t.showBadges}</button>
      </div>

      {showLv && (
        <div className="card">
          {LEVELS.map(lv => {
            var ll = lang === 'en' ? lv.labelEn : lv.label
            var ld = lang === 'en' ? lv.descEn : lv.desc
            return (
              <div key={lv.val} className="row mb8" style={{ opacity: me.level === lv.val ? 1 : 0.45 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: lv.color, display: 'inline-block', flexShrink: 0 }} />
                <div className="col">
                  <span style={{ fontSize: 12, fontWeight: 700, color: lv.color }}>{lv.val} — {ll}</span>
                  <span className="text-xs">{ld}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showBd && (
        <div className="card">
          <div className="fw600 mb8" style={{ fontSize: 12 }}>{t.badges}</div>
          {BADGE_DEFS.map(item => {
            var has = myBadges.includes(item.b)
            var bl = lang === 'en' ? item.en : item.fr
            var bd = lang === 'en' ? item.dEn : item.dFr
            return (
              <div key={item.b} className="row mb8" style={{ opacity: has ? 1 : 0.35 }}>
                <span style={{ fontSize: 20, marginRight: 8 }}>{item.b}</span>
                <div className="col">
                  <span style={{ fontSize: 12, fontWeight: 600, color: has ? '#a855f7' : '#6b7280' }}>{bl}</span>
                  <span className="text-xs">{bd}</span>
                </div>
                {has && <span style={{ marginLeft: 'auto', color: '#10b981' }}>✓</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
                    }
