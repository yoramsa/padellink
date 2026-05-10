import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react'
import { supabase } from './supabase'

const STYLES = `
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{width:100%;overflow-x:hidden;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#0e0e16;color:#fff;}
  .app{width:100%;max-width:430px;margin:0 auto;min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;background:#0e0e16;}
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
  .btn{padding:10px 18px;border-radius:12px;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:13px;transition:all 0.15s;display:inline-flex;align-items:center;justify-content:center;gap:6px;}
  .btn:active:not(:disabled){transform:scale(0.96);}
  .btn:disabled{opacity:0.5;cursor:not-allowed;}
  .btn-primary{background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;}
  .btn-primary:hover:not(:disabled){opacity:0.9;}
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
  @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .skeleton{background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 75%);background-size:1200px 100%;animation:shimmer 1.6s infinite linear;border-radius:10px;}
  .toast-wrap{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:500;width:calc(100% - 32px);max-width:398px;display:flex;flex-direction:column;gap:8px;pointer-events:none;}
  .toast{padding:12px 18px;border-radius:14px;font-size:13px;font-weight:600;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.6);animation:slideDown 0.25s ease;}
  .toast-ok{background:linear-gradient(135deg,#059669,#10b981);color:#fff;}
  .toast-err{background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;}
  .toast-info{background:linear-gradient(135deg,#6d28d9,#a855f7);color:#fff;}
  .spin{display:inline-block;width:13px;height:13px;border:2px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:spin 0.65s linear infinite;flex-shrink:0;}
`

// ── Toast & Confirm contexts ──
const ToastCtx = createContext(null)
const ConfirmCtx = createContext(null)
const useToast = () => useContext(ToastCtx)
const useConfirm = () => useContext(ConfirmCtx)

function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
      ))}
    </div>
  )
}

function ConfirmModal({ msg, onConfirm, onCancel, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', danger = true }) {
  return (
    <div className="modal-overlay" style={{ zIndex: 300 }} onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', padding: '28px 20px 32px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <div className="fw700 mb12" style={{ fontSize: 15, lineHeight: 1.6 }}>{msg}</div>
        <div className="row gap8" style={{ marginTop: 16 }}>
          <button className="btn btn-outline flex1" onClick={onCancel}>{cancelLabel}</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'} flex1`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

function Spin() { return <span className="spin" /> }

// ── Level definitions ──
const LEVELS = [
  {val:1.0,label:'Débutant',labelEn:'Beginner',labelHe:'מתחיל',color:'#6b7280',desc:'Débute le padel, apprentissage des bases.',descEn:'Just starting padel, learning the basics.'},
  {val:1.5,label:'Débutant+',labelEn:'Beginner+',labelHe:'מתחיל+',color:'#9ca3af',desc:'Connait les règles, quelques échanges.',descEn:'Knows the rules, can rally.'},
  {val:2.0,label:'Intermédiaire',labelEn:'Intermediate',labelHe:'בינוני',color:'#3b82f6',desc:'Régularité, coups de base maîtrisés.',descEn:'Consistency, basic shots mastered.'},
  {val:2.5,label:'Intermédiaire+',labelEn:'Intermediate+',labelHe:'בינוני+',color:'#06b6d4',desc:'Bonne lecture du jeu, tactique simple.',descEn:'Good game reading, simple tactics.'},
  {val:3.0,label:'Confirmé',labelEn:'Confirmed',labelHe:'מאושר',color:'#10b981',desc:'Maîtrise du mur, variations de jeu.',descEn:'Wall control, game variations.'},
  {val:3.5,label:'Confirmé+',labelEn:'Confirmed+',labelHe:'מאושר+',color:'#84cc16',desc:'Bandejas, viboras, jeu complet.',descEn:'Bandejas, viboras, complete game.'},
  {val:4.0,label:'Avancé',labelEn:'Advanced',labelHe:'מתקדם',color:'#f59e0b',desc:'Tournois régionaux, constance élevée.',descEn:'Regional tournaments, high consistency.'},
  {val:4.5,label:'Expert',labelEn:'Expert',labelHe:'מומחה',color:'#f97316',desc:'Niveau compétitif national.',descEn:'National competitive level.'},
  {val:5.0,label:'Pro',labelEn:'Pro',labelHe:'פרו',color:'#ef4444',desc:'Niveau professionnel ou semi-pro.',descEn:'Professional or semi-pro level.'},
]

const getLevelInfo = v => LEVELS.find(l => l.val === v) || LEVELS[2]

const RATING_KEYS = ['fairplay','service','reflex','power','level']
const RATING_LABELS = {
  fr:{fairplay:'Fair Play',service:'Service',reflex:'Réflexe',power:'Puissance',level:'Niveau'},
  en:{fairplay:'Fair Play',service:'Service',reflex:'Reflex',power:'Power',level:'Level'},
  he:{fairplay:'פייר פליי',service:'סרביס',reflex:'רפלקס',power:'עוצמה',level:'רמה'}
}

const BADGE_DEFS = [
  {b:'🏆',fr:'Champion',en:'Champion',he:'אלוף',dFr:'10 victoires',dEn:'10 wins',dHe:'10 ניצחונות'},
  {b:'🥇',fr:'Légende',en:'Legend',he:'אגדה',dFr:'25 victoires',dEn:'25 wins',dHe:'25 ניצחונות'},
  {b:'🎯',fr:'Pro',en:'Pro',he:'פרו',dFr:'Niveau 4.5+',dEn:'Level 4.5+',dHe:'רמה 4.5+'},
  {b:'⚡',fr:'Série',en:'Streak',he:'רצף',dFr:'5V consécutives',dEn:'5 wins in a row',dHe:'5 ניצחונות רצופים'},
  {b:'🤝',fr:'Fair Play',en:'Fair Play',he:'פייר פליי',dFr:'Note FP >4.8',dEn:'FP rating >4.8',dHe:'דירוג FP >4.8'},
  {b:'🏅',fr:'Régulier',en:'Regular',he:'קבוע',dFr:'20+ matchs',dEn:'20+ matches',dHe:'20+ משחקים'},
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
    confirmSignOut:'Se déconnecter ?',
    confirmExpel:'Expulser ce joueur de la ligue ?',
    confirmDraw:'Lancer le tirage ? Les équipes existantes seront supprimées.',
    confirmBalance:'Équilibrer les équipes ? Les équipes existantes seront supprimées.',
    confirmLeave:'Envoyer une demande de sortie à l\'admin ?',
    errorGeneric:'Une erreur est survenue.',
    saved:'✓ Sauvegardé !',profileUpdated:'✓ Profil mis à jour !',
    matchConfirmed:'✓ Match confirmé !',matchRefused:'Match refusé.',
    leagueJoined:'✓ Ligue rejointe !',leagueLeft:'Demande de sortie envoyée.',
    wrongCode:'Code incorrect.',nameRequired:'Nom trop court (min. 2 car.).',cityRequired:'Ville requise.',
    maxPlayers:'Limite de joueurs',maxPlayersHint:'0 = illimité',leagueFull:'La ligue est complète',
    deleteLeague:'Supprimer la ligue',confirmDeleteLeague:'Supprimer définitivement cette ligue et toutes ses données ?',
    leagueFormError:'Vous devez remplir toutes les cases pour pouvoir créer la ligue.',
    durationHint:'0 = illimité',
    drawDesc:'Mélange aléatoire — les équipes sont formées au hasard.',
    balanceDesc:'1er avec le 3e, 2e avec le 4e — équipes de niveau similaire.',
    availablePlayers:'Joueurs disponibles',
    completeTeams:'⚡ Générer les équipes restantes automatiquement',
    tournamentTab:'Tournoi',createTournament:'Créer un tournoi',noTournament:'Aucun tournoi dans cette ligue.',
    tournamentName:'Nom du tournoi',tournamentType:'Type de tournoi',elimination:'Élimination directe',
    roundRobin:'Round Robin (tous vs tous)',selectTournamentTeams:'Sélectionner les équipes',
    thirdPlace:'Match pour la 3ème place',startTournament:'🏆 Lancer le tournoi',
    round:'Round',semifinal:'Demi-finale',final:'Finale',thirdPlaceMatch:'Match 3ème place',
    bye:'Exempt',enterScore:'Saisir le score',tournamentWinner:'Champion du tournoi',
    tournamentFinished:'Tournoi terminé',deleteTournament:'Supprimer le tournoi',
    confirmDeleteTournament:'Supprimer ce tournoi définitivement ?',standingsRR:'Classement',
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
    confirmSignOut:'Sign out?',
    confirmExpel:'Expel this player from the league?',
    confirmDraw:'Start draw? Existing teams will be deleted.',
    confirmBalance:'Balance teams? Existing teams will be deleted.',
    confirmLeave:'Send a leave request to the admin?',
    errorGeneric:'Something went wrong.',
    saved:'✓ Saved!',profileUpdated:'✓ Profile updated!',
    matchConfirmed:'✓ Match confirmed!',matchRefused:'Match declined.',
    leagueJoined:'✓ League joined!',leagueLeft:'Leave request sent.',
    wrongCode:'Wrong code.',nameRequired:'Name too short (min. 2 chars).',cityRequired:'City required.',
    maxPlayers:'Player limit',maxPlayersHint:'0 = unlimited',leagueFull:'League is full',
    deleteLeague:'Delete league',confirmDeleteLeague:'Permanently delete this league and all its data?',
    leagueFormError:'You must fill all fields to create the league.',
    durationHint:'0 = unlimited',
    drawDesc:'Random shuffle — teams are formed randomly.',
    balanceDesc:'1st with 3rd, 2nd with 4th — teams of similar level.',
    availablePlayers:'Available players',
    completeTeams:'⚡ Auto-generate remaining teams',
    tournamentTab:'Tournament',createTournament:'Create tournament',noTournament:'No tournament in this league.',
    tournamentName:'Tournament name',tournamentType:'Tournament type',elimination:'Single Elimination',
    roundRobin:'Round Robin (all vs all)',selectTournamentTeams:'Select teams',
    thirdPlace:'3rd place match',startTournament:'🏆 Start tournament',
    round:'Round',semifinal:'Semifinal',final:'Final',thirdPlaceMatch:'3rd place match',
    bye:'Bye',enterScore:'Enter score',tournamentWinner:'Tournament champion',
    tournamentFinished:'Tournament finished',deleteTournament:'Delete tournament',
    confirmDeleteTournament:'Permanently delete this tournament?',standingsRR:'Standings',
  },
  he:{
    home:'בית',players:'שחקנים',leagues:'ליגות',ranking:'דירוג',profile:'פרופיל',
    follow:'עקוב',unfollow:'הפסק לעקוב',rate:'דרג',
    matchPending:'משחק ממתין',confirm:'אשר',refuse:'דחה',
    createMatch:'צור משחק',myMatches:'היסטוריית משחקים',
    pendingMatches:'ממתין לאישור',
    noFollowing:'אינך עוקב אחרי אף שחקן.',followFirst:'עקוב אחרי שחקנים כדי ליצור משחק חופשי.',
    vs:'נגד',winner:'מנצח',set:'סט',addSet:'+ הוסף סט',
    joinLeague:'הצטרף לליגה',createLeague:'צור ליגה',
    ranking2:'דירוג',matches:'משחקים',teams:'קבוצות',members:'שחקנים',chat:'צ\'אט',
    pts:'נק',wins:'נ',losses:'ה',played:'מ',
    addMatch:'הוסף תוצאה',team1:'קבוצה 1',team2:'קבוצה 2',
    selectTeam:'בחר קבוצה',addTeamMatch:'אשר משחק',
    randomDraw:'הגרלה אקראית',send:'שלח',message:'הודעה...',
    editProfile:'ערוך פרופיל',name:'שם',city:'עיר',
    showLevels:'ראה רמות',showBadges:'התגים שלי',
    ratingsTitle:'הדירוגים שלי',signOut:'התנתק',
    expel:'הוצא',privateCode:'קוד גישה',enterCode:'הכנס קוד',access:'כניסה',
    leagueName:'שם הליגה',season:'עונה',rules:'חוקים',
    setsMatch:'סטים למשחק',matchDuration:'משך (דק\')',minAge:'גיל מינימלי',
    visibilityLabel:'נראות הליגה',
    visibilityPublicDesc:'🌍 ציבורי — כולם יכולים לראות ולהצטרף חופשית.',
    visibilityPrivateDesc:'🔒 פרטי — רק אנשים עם הקוד יכולים להצטרף.',
    privateToggleLabel:'הפוך את הליגה לפרטית',
    create:'צור',currentForm:'כושר נוכחי',pointsHistory:'היסטוריית נקודות',
    noMatches:'לא שוחקו משחקים',badges:'תגים',worldRank:'עולמי',leagueRank:'ליגות',
    chooseTeams:'1. בחר שחקנים',enterSets:'2. הכנס תוצאות סט אחר סט',
    submitMatch:'הגש משחק',selectLeague:'בחר ליגה',
    myLeagues:'הליגות שלי',otherLeagues:'ליגות אחרות',memberCount:'שחקנים',
    duration:'משך',minAgeShort:'גיל מינ.',setsPerMatch:'סטים',
    noMatchYet:'אין משחקים עדיין.',
    leagueRules:'חוקים',leagueMembers:'חברים',confirmJoin:'הצטרף לליגה',
    leaveLeague:'עזוב ליגה',leaveRequest:'בקשת עזיבה נשלחה למנהל.',
    leaveApprove:'אשר',leaveDecline:'דחה',pendingLeaveRequests:'בקשות עזיבה',
    subAdmins:'מנהלי משנה',addSubAdmin:'מנה מנהל משנה',removeSubAdmin:'הסר',
    canPostScore:'יכול להוסיף תוצאות',
    adminOnly:'רק מנהל או מנהל משנה יכול להוסיף תוצאות.',
    matchWin:'ניצחון',matchLoss:'הפסד',matchFree:'משחק חופשי',
    waitingConfirm:'ממתין ל',pendingCount:'אישור(ים)',
    cancelBtn:'בטל',saveBtn:'שמור',loading:'טוען...',
    age:'שנים',followedPlayers:'שחקנים עוקבים',
    confirmSignOut:'להתנתק?',
    confirmExpel:'להוציא שחקן זה מהליגה?',
    confirmDraw:'להתחיל הגרלה? הקבוצות הקיימות יימחקו.',
    confirmBalance:'לאזן קבוצות? הקבוצות הקיימות יימחקו.',
    confirmLeave:'לשלוח בקשת עזיבה למנהל?',
    errorGeneric:'אירעה שגיאה.',
    saved:'✓ נשמר!',profileUpdated:'✓ פרופיל עודכן!',
    matchConfirmed:'✓ משחק אושר!',matchRefused:'משחק נדחה.',
    leagueJoined:'✓ הצטרפת לליגה!',leagueLeft:'בקשת עזיבה נשלחה.',
    wrongCode:'קוד שגוי.',nameRequired:'שם קצר מדי (מינ. 2 תווים).',cityRequired:'עיר נדרשת.',
    maxPlayers:'מגבלת שחקנים',maxPlayersHint:'0 = ללא הגבלה',leagueFull:'הליגה מלאה',
    deleteLeague:'מחק ליגה',confirmDeleteLeague:'למחוק לצמיתות את הליגה וכל הנתונים שלה?',
    leagueFormError:'עליך למלא את כל השדות כדי ליצור את הליגה.',
    durationHint:'0 = ללא הגבלה',
    drawDesc:'ערבוב אקראי — הקבוצות נוצרות באקראי.',
    balanceDesc:'ראשון עם שלישי, שני עם רביעי — קבוצות ברמה דומה.',
    availablePlayers:'שחקנים זמינים',
    completeTeams:'⚡ הגנרט את הקבוצות הנותרות אוטומטית',
    tournamentTab:'טורניר',createTournament:'צור טורניר',noTournament:'אין טורניר בליגה זו.',
    tournamentName:'שם הטורניר',tournamentType:'סוג הטורניר',elimination:'נוקאאוט',
    roundRobin:'ליגה (כולם נגד כולם)',selectTournamentTeams:'בחר קבוצות',
    thirdPlace:'משחק מקום שלישי',startTournament:'🏆 התחל טורניר',
    round:'סיבוב',semifinal:'חצי גמר',final:'גמר',thirdPlaceMatch:'משחק מקום שלישי',
    bye:'פטור',enterScore:'הכנס תוצאה',tournamentWinner:'אלוף הטורניר',
    tournamentFinished:'הטורניר הסתיים',deleteTournament:'מחק טורניר',
    confirmDeleteTournament:'למחוק טורניר זה לצמיתות?',standingsRR:'טבלת דירוג',
  }
}

// ── Helpers ──
function calcAge(dob) {
  if (!dob) return null
  const today = new Date(), birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function computeRatingAvg(ratings, key) {
  if (!ratings || !ratings.length) return 0
  return ratings.reduce((a, r) => a + (r[key] || 0), 0) / ratings.length
}

function computeBadges(player, ratings) {
  const b = []
  if (player.wins >= 25) b.push('🥇')
  else if (player.wins >= 10) b.push('🏆')
  if (player.level >= 4.5) b.push('🎯')
  const h = player.win_history || []
  if (h.length >= 5 && h.slice(-5).every(x => x === 1)) b.push('⚡')
  if (player.matches >= 20) b.push('🏅')
  if (ratings && ratings.length >= 3) {
    if (computeRatingAvg(ratings, 'fairplay') > 4.8) b.push('🤝')
  }
  return b
}

function matchWinner(t1Id, t2Id, sets) {
  let w1 = 0, w2 = 0
  ;(sets || []).forEach(s => { if (s.a > s.b) w1++; else if (s.b > s.a) w2++ })
  return w1 > w2 ? t1Id : t2Id
}

// ── UI Components ──
function Av({ size = 40, photo, name = '?' }) {
  const init = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (photo) return <img src={photo} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} alt={name} />
  return <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.36, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>{init}</div>
}

function LvBadge({ val, lang = 'fr' }) {
  const info = getLevelInfo(val)
  const lbl = lang === 'en' ? info.labelEn : lang === 'he' ? info.labelHe : info.label
  return <span style={{ background: info.color + '22', border: '1px solid ' + info.color + '55', color: info.color, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{lbl} ({val})</span>
}

function Stars({ val, onChange, readOnly }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className="star" style={{ color: i <= Math.round(val) ? '#f59e0b' : '#374151' }}
          onClick={readOnly ? null : () => onChange(i)}>★</span>
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
    const clean = v.replace(/[^0-9]/g, '')
    const num = parseInt(clean)
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
  let w1 = 0, w2 = 0
  sets.forEach(s => { if (s.a > s.b) w1++; else if (s.b > s.a) w2++ })
  const win = w1 > w2 ? t1name : w2 > w1 ? t2name : ''
  return (
    <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '10px', margin: '8px 0' }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {sets.map((s, i) => <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '4px 12px', fontFamily: "'Bebas Neue',cursive", fontSize: 20, color: s.a > s.b ? '#06b6d4' : s.b > s.a ? '#a855f7' : '#9ca3af' }}>{s.a}-{s.b}</div>)}
      </div>
      {win && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12, fontWeight: 700, color: '#10b981' }}>🏆 {win}</div>}
    </div>
  )
}

// ── Searchable player picker ──
function PlayerPicker({ players, value, onChange, placeholder, excludeIds = [], lang }) {
  const [search, setSearch] = useState('')
  const selected = players.find(p => p.id === value)
  const filtered = players.filter(p =>
    !excludeIds.includes(p.id) &&
    (search.length < 1 || p.name.toLowerCase().includes(search.toLowerCase()) || (p.city || '').toLowerCase().includes(search.toLowerCase()))
  )
  const wp = p => p.matches > 0 ? Math.round(p.wins / p.matches * 100) : 0
  return (
    <div style={{ marginBottom: 8 }}>
      {selected ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{selected.name} · Niv.{selected.level} · {wp(selected)}%V</span>
          <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18, lineHeight: 1 }} onClick={() => { onChange(''); setSearch('') }}>✕</button>
        </div>
      ) : (
        <input className="input" style={{ marginBottom: 4 }} placeholder={'🔍 ' + placeholder}
          value={search} onChange={e => setSearch(e.target.value)} />
      )}
      {!selected && search.length >= 1 && (
        <div style={{ maxHeight: 160, overflowY: 'auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
          {filtered.length === 0
            ? <div style={{ padding: '10px', fontSize: 12, color: '#6b7280', textAlign: 'center' }}>{lang === 'fr' ? 'Aucun joueur trouvé' : lang === 'he' ? 'שחקן לא נמצא' : 'No player found'}</div>
            : filtered.map(p => (
              <div key={p.id} style={{ padding: '9px 12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}
                onMouseDown={() => { onChange(p.id); setSearch('') }}>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 6 }}>Niv.{p.level} · {wp(p)}%V · {p.city}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}

// ── Skeleton rows for background loading ──
function SkeletonCard({ lines = 2 }) {
  return (
    <div className="card" style={{ opacity: 0.7 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 14, marginBottom: i < lines - 1 ? 10 : 0, width: i === 0 ? '70%' : '50%' }} />
      ))}
    </div>
  )
}

// ══════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════
const LANG_LABELS = { fr: '🇫🇷 FR', en: '🇬🇧 EN', he: '🇮🇱 HE' }
const ALL_LANGS = ['fr', 'en', 'he']

export default function PadelLink({ session, player: initialPlayer, pendingLeagueId, onClearPendingLeague, onSignOut, lang, setLang }) {
  const [tab, setTab] = useState('home')
  const [me, setMe] = useState(initialPlayer)
  const [players, setPlayers] = useState([])
  const [follows, setFollows] = useState([])
  const [ratings, setRatings] = useState([])
  const [leagues, setLeagues] = useState([])
  const [freeMatches, setFreeMatches] = useState([])
  const [leagueMatches, setLeagueMatches] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [matchConfirmations, setMatchConfirmations] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [viewPlayerId, setViewPlayerId] = useState(null)
  const [viewLeagueId, setViewLeagueId] = useState(null)
  const [previewLeagueId, setPreviewLeagueId] = useState(null)
  const [selectedLeagueTab, setSelectedLeagueTab] = useState('ranking2')
  const [rankTab, setRankTab] = useState('world')
  const [loadingData, setLoadingData] = useState(true)
  const [loadingBg, setLoadingBg] = useState(true)

  // Toast state
  const [toasts, setToasts] = useState([])
  const [confirmState, setConfirmState] = useState(null)

  const t = T[lang]

  const showToast = useCallback((msg, type = 'ok') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3000)
  }, [])

  const confirm = useCallback((msg) => new Promise(resolve => {
    setConfirmState({ msg, resolve })
  }), [])

  const handleConfirm = () => { confirmState?.resolve(true); setConfirmState(null) }
  const handleConfirmCancel = () => { confirmState?.resolve(false); setConfirmState(null) }

  useEffect(() => { loadAll() }, [])

  useEffect(() => {
    if (tab === 'players') loadPlayers('', 0)
    if (tab === 'leagues') loadLeagues(0)
    if (tab === 'ranking') loadPlayers('', 0)
  }, [tab])

  // Handle league invitation URL
  useEffect(() => {
    if (!pendingLeagueId || loadingBg) return
    const league = leagues.find(l => l.id === pendingLeagueId)
    if (league) {
      setTab('leagues')
      setPreviewLeagueId(pendingLeagueId)
      onClearPendingLeague?.()
    }
  }, [pendingLeagueId, loadingBg, leagues])

  // Phase 1: critical user data only → show UI fast
  // Phase 2: players + leagues (background)
  async function loadAll() {
    setLoadingData(true)
    await Promise.all([loadFollows(), loadRatings(), loadFreeMatches(), loadLeaveRequests()])
    setLoadingData(false)
    // Background phase
    await Promise.all([loadPlayers('', 0), loadLeagues(0)])
    await loadLeagueMatches()
    setLoadingBg(false)
  }

  async function loadPlayers(searchText = '', page = 0) {
    const from = page * 20, to = from + 19
    let q = supabase.from('players').select('*').order('points', { ascending: false }).range(from, to)
    const clean = (searchText || '').trim()
    if (clean.length >= 2) q = q.or('name.ilike.%' + clean + '%,city.ilike.%' + clean + '%')
    const { data } = await q
    if (data) setPlayers(prev => page === 0 ? data : [...prev, ...data.filter(p => !prev.some(x => x.id === p.id))])
  }

  async function loadPlayersByIds(ids) {
    const uniqueIds = [...new Set((ids || []).filter(Boolean))]
    if (!uniqueIds.length) return
    const missing = uniqueIds.filter(id => !players.some(p => p.id === id))
    if (!missing.length) return
    const { data } = await supabase.from('players').select('*').in('id', missing)
    if (data) setPlayers(prev => [...prev, ...data.filter(p => !prev.some(x => x.id === p.id))])
  }

  async function loadFollows() {
    const { data } = await supabase.from('follows').select('*').or(`follower_id.eq.${me.id},following_id.eq.${me.id}`)
    if (data) setFollows(data)
  }

  async function loadRatings() {
    const { data } = await supabase.from('ratings').select('*').or(`rater_id.eq.${me.id},rated_id.eq.${me.id}`)
    if (data) setRatings(data)
  }

  async function loadLeagues(page = 0) {
    const from = page * 20, to = from + 19
    const { data: myMemberships } = await supabase.from('league_members').select('league_id,player_id,role').eq('player_id', me.id)
    const myLeagueIds = (myMemberships || []).map(m => m.league_id)
    let loaded = []
    if (myLeagueIds.length > 0) {
      const { data: mine } = await supabase.from('leagues').select('*').in('id', myLeagueIds).order('created_at', { ascending: false })
      loaded = loaded.concat(mine || [])
    }
    let publicQuery = supabase.from('leagues').select('*').eq('is_private', false).order('created_at', { ascending: false }).range(from, to)
    if (myLeagueIds.length > 0) publicQuery = publicQuery.not('id', 'in', '(' + myLeagueIds.join(',') + ')')
    const { data: publicLeagues } = await publicQuery
    loaded = loaded.concat(publicLeagues || [])
    const unique = []
    loaded.forEach(l => { if (!unique.some(x => x.id === l.id)) unique.push(l) })
    const leagueIds = unique.map(l => l.id)
    if (!leagueIds.length) { setLeagues([]); return }
    const { data: members } = await supabase.from('league_members').select('league_id,player_id,role').in('league_id', leagueIds)
    const { data: teams } = await supabase.from('teams').select('*').in('league_id', leagueIds)
    const withDetails = unique.map(l => ({
      ...l,
      league_members: (members || []).filter(m => m.league_id === l.id),
      teams: (teams || []).filter(tm => tm.league_id === l.id)
    }))
    await loadPlayersByIds([
      ...unique.map(l => l.admin_id),
      ...(members || []).map(m => m.player_id),
      ...(teams || []).flatMap(tm => [tm.player1_id, tm.player2_id])
    ])
    setLeagues(prev => page === 0 ? withDetails : [...prev, ...withDetails.filter(l => !prev.some(x => x.id === l.id))])
    if (leagueIds.length) await loadTournaments(leagueIds)
  }

  async function loadFreeMatches() {
    const { data } = await supabase.from('free_matches').select('*')
      .or(`creator_id.eq.${me.id},player1_id.eq.${me.id},player2_id.eq.${me.id},player3_id.eq.${me.id},player4_id.eq.${me.id}`)
      .order('created_at', { ascending: false }).limit(50)
    if (data) {
      setFreeMatches(data)
      await loadPlayersByIds(data.flatMap(m => [m.creator_id, m.player1_id, m.player2_id, m.player3_id, m.player4_id]))
      const matchIds = data.map(m => m.id)
      if (matchIds.length) {
        const { data: confs } = await supabase.from('free_match_confirmations').select('*').in('match_id', matchIds)
        if (confs) setMatchConfirmations(confs)
      }
    }
  }

  async function loadLeagueMatches() {
    const { data: myMemberships } = await supabase.from('league_members').select('league_id').eq('player_id', me.id)
    const ids = (myMemberships || []).map(m => m.league_id)
    if (!ids.length) { setLeagueMatches([]); return }
    const { data } = await supabase.from('matches').select('*').in('league_id', ids).order('created_at', { ascending: false }).limit(50)
    if (data) setLeagueMatches(data)
  }

  async function loadTournaments(leagueIds) {
    if (!leagueIds || !leagueIds.length) { setTournaments([]); return }
    const { data } = await supabase.from('tournaments').select('*').in('league_id', leagueIds).order('created_at', { ascending: false })
    if (data) setTournaments(data)
  }

  async function loadLeaveRequests() {
    const { data } = await supabase.from('leave_requests').select('*').eq('status', 'pending').limit(50)
    if (data) setLeaveRequests(data)
  }

  async function refreshMe() {
    const { data } = await supabase.from('players').select('*').eq('id', me.id).single()
    if (data) setMe(data)
  }

  // ── Follow ──
  async function toggleFollow(targetId) {
    const isF = follows.some(f => f.follower_id === me.id && f.following_id === targetId)
    if (isF) {
      await supabase.from('follows').delete().eq('follower_id', me.id).eq('following_id', targetId)
    } else {
      await supabase.from('follows').insert({ follower_id: me.id, following_id: targetId })
    }
    await loadFollows()
  }

  function isFollowing(targetId) { return follows.some(f => f.follower_id === me.id && f.following_id === targetId) }
  function getFollowedPlayers() {
    const ids = follows.filter(f => f.follower_id === me.id).map(f => f.following_id)
    return players.filter(p => ids.includes(p.id))
  }

  // ── Ratings ──
  async function submitRating(targetId, newRatings) {
    await supabase.from('ratings').upsert({
      rater_id: me.id, rated_id: targetId,
      fairplay: newRatings.fairplay, service: newRatings.service,
      reflex: newRatings.reflex, power: newRatings.power,
      level_rating: newRatings.level
    }, { onConflict: 'rater_id,rated_id' })
    await loadRatings()
  }

  function getPlayerRatings(playerId) { return ratings.filter(r => r.rated_id === playerId) }
  function getMyRatingFor(targetId) { return ratings.find(r => r.rater_id === me.id && r.rated_id === targetId) }

  // ── Profile ──
  async function updateProfile(updates) {
    const { error } = await supabase.from('players').update(updates).eq('id', me.id)
    if (error) throw error
    await refreshMe()
    await loadPlayers('', 0)
  }

  async function uploadPhoto(file) {
    const ext = file.name.split('.').pop()
    const path = `${me.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      await updateProfile({ photo_url: data.publicUrl })
    }
  }

  // ── Free matches ──
  async function createFreeMatch(data) {
    const { error } = await supabase.from('free_matches').insert({
      creator_id: me.id,
      player1_id: data.playerIds[0], player2_id: data.playerIds[1],
      player3_id: data.playerIds[2], player4_id: data.playerIds[3],
      sets: data.sets, played_at: data.date || null, status: 'pending'
    })
    if (error) throw error
    await loadFreeMatches()
  }

  async function awardMatchPoints(match) {
    const sets = match.sets || []
    let w1 = 0, w2 = 0
    sets.forEach(s => { if (s.a > s.b) w1++; else if (s.b > s.a) w2++ })
    const team1wins = w1 > w2
    const isCleanSweep = team1wins ? w2 === 0 : w1 === 0
    const winPts = isCleanSweep ? 12 : 10
    const team1 = [match.player1_id, match.player2_id].filter(Boolean)
    const team2 = [match.player3_id, match.player4_id].filter(Boolean)
    const winners = team1wins ? team1 : team2
    const losers = team1wins ? team2 : team1
    for (const pid of winners) {
      const { data: p } = await supabase.from('players').select('wins,matches,points,win_history').eq('id', pid).single()
      if (!p) continue
      await supabase.from('players').update({ wins: p.wins + 1, matches: p.matches + 1, points: p.points + winPts, win_history: [...(p.win_history || []), 1] }).eq('id', pid)
    }
    for (const pid of losers) {
      const { data: p } = await supabase.from('players').select('wins,matches,points,win_history').eq('id', pid).single()
      if (!p) continue
      await supabase.from('players').update({ matches: p.matches + 1, points: p.points + 3, win_history: [...(p.win_history || []), 0] }).eq('id', pid)
    }
  }

  async function respondFreeMatch(matchId, responded) {
    const { data: existing } = await supabase.from('free_match_confirmations')
      .select('id').eq('match_id', matchId).eq('player_id', me.id).maybeSingle()
    if (!existing) {
      const { error } = await supabase.from('free_match_confirmations').insert({ match_id: matchId, player_id: me.id, confirmed: responded })
      if (error) throw error
    }
    if (responded) {
      const match = freeMatches.find(m => m.id === matchId)
      if (match) {
        const nonCreatorIds = [match.player1_id, match.player2_id, match.player3_id, match.player4_id].filter(id => id && id !== match.creator_id)
        const { data: confs } = await supabase.from('free_match_confirmations').select('*').eq('match_id', matchId).eq('confirmed', true)
        const confirmedIds = (confs || []).map(c => c.player_id)
        if (nonCreatorIds.every(id => confirmedIds.includes(id))) {
          await supabase.from('free_matches').update({ status: 'confirmed' }).eq('id', matchId)
          await awardMatchPoints(match)
        }
      }
    }
    await loadFreeMatches()
    await refreshMe()
    await loadPlayers('', 0)
  }

  // ── Leagues ──
  async function createLeague(data) {
    const { data: newL, error } = await supabase.from('leagues').insert({
      name: data.name, season: data.season, rules: data.rules,
      sets_per_match: data.setsPerMatch, match_duration: data.matchDuration,
      min_age: data.minAge, is_private: data.isPrivate,
      access_code_hash: data.isPrivate ? data.code : null, admin_id: me.id,
      max_players: data.maxPlayers || 0
    }).select().single()
    if (error) throw error
    await supabase.from('league_members').insert({ league_id: newL.id, player_id: me.id, role: 'admin' })
    await loadLeagues(0)
  }

  async function joinLeague(leagueId) {
    const league = leagues.find(l => l.id === leagueId)
    const already = league?.league_members?.some(lm => lm.player_id === me.id)
    if (already) return
    const memberCount = league?.league_members?.length || 0
    const maxPlayers = league?.max_players || 0
    if (maxPlayers > 0 && memberCount >= maxPlayers) {
      throw new Error(lang === 'fr' ? 'La ligue est complète' : lang === 'he' ? 'הליגה מלאה' : 'League is full')
    }
    const { error } = await supabase.from('league_members').insert({ league_id: leagueId, player_id: me.id, role: 'member' })
    if (error) throw error
    await loadLeagues(0)
  }

  async function requestLeave(leagueId) {
    const already = leaveRequests.some(r => r.league_id === leagueId && r.player_id === me.id)
    if (already) return
    const { error } = await supabase.from('leave_requests').insert({ league_id: leagueId, player_id: me.id })
    if (error) throw error
    await loadLeaveRequests()
  }

  async function resolveLeave(leagueId, playerId, approve) {
    await supabase.from('leave_requests').update({ status: approve ? 'approved' : 'declined', resolved_at: new Date().toISOString() })
      .eq('league_id', leagueId).eq('player_id', playerId).eq('status', 'pending')
    if (approve) await supabase.from('league_members').delete().eq('league_id', leagueId).eq('player_id', playerId)
    await loadLeagues(0)
    await loadLeaveRequests()
  }

  async function expelMember(leagueId, playerId) {
    const { error } = await supabase.from('league_members').delete().eq('league_id', leagueId).eq('player_id', playerId)
    if (error) throw error
    await loadLeagues(0)
  }

  async function deleteLeague(leagueId) {
    await supabase.from('leagues').delete().eq('id', leagueId)
    await loadLeagues(0)
  }

  async function toggleSubAdmin(leagueId, playerId) {
    const lm = leagues.find(l => l.id === leagueId)?.league_members?.find(m => m.player_id === playerId)
    const newRole = lm?.role === 'sub_admin' ? 'member' : 'sub_admin'
    await supabase.from('league_members').update({ role: newRole }).eq('league_id', leagueId).eq('player_id', playerId)
    await loadLeagues(0)
  }

  async function addLeagueMatch(leagueId, matchData) {
    const { error } = await supabase.from('matches').insert({
      league_id: leagueId, team1_id: matchData.team1Id, team2_id: matchData.team2Id,
      sets: matchData.sets, winner_id: matchData.winnerId,
      played_at: matchData.date || null, posted_by: me.id
    })
    if (!error) { await loadLeagueMatches(); await loadLeagues(0); await refreshMe(); await loadPlayers('', 0) }
    return error
  }

  async function sendChatMsg(leagueId, text) {
    await supabase.from('chat_messages').insert({ league_id: leagueId, player_id: me.id, content: text.trim().slice(0, 500) })
  }

  async function randomDrawTeams(leagueId) {
    const league = leagues.find(l => l.id === leagueId)
    const leaguePlayerIds = (league?.league_members || []).map(lm => lm.player_id)
    const lp = players.filter(p => leaguePlayerIds.includes(p.id)).slice().sort(() => Math.random() - 0.5)
    await supabase.from('teams').delete().eq('league_id', leagueId)
    const newTeams = []
    for (let i = 0; i < lp.length; i += 2) {
      newTeams.push({ league_id: leagueId, name: (lang === 'fr' ? 'Équipe ' : lang === 'he' ? 'קבוצה ' : 'Team ') + (i / 2 + 1), player1_id: lp[i]?.id || null, player2_id: lp[i + 1]?.id || null })
    }
    if (newTeams.length) await supabase.from('teams').insert(newTeams)
    await loadLeagues(0)
  }

  // ── Computed ──
  const followedPlayers = getFollowedPlayers()
  const pendingForMe = freeMatches.filter(m =>
    m.status === 'pending' &&
    [m.player1_id, m.player2_id, m.player3_id, m.player4_id].includes(me.id) &&
    m.creator_id !== me.id
  )
  const myAdminLeagues = leagues.filter(l => l.admin_id === me.id)
  const myLeaveReqs = leaveRequests.filter(r => myAdminLeagues.some(l => l.id === r.league_id))
  const totalNotifs = pendingForMe.length + myLeaveReqs.length
  const activeLeague = viewLeagueId ? leagues.find(l => l.id === viewLeagueId) : null
  const previewLeague = previewLeagueId ? leagues.find(l => l.id === previewLeagueId) : null
  const confirmedFreeMatches = freeMatches.filter(m => m.status === 'confirmed')
  const myMatches = [
    ...confirmedFreeMatches.filter(m => [m.player1_id, m.player2_id, m.player3_id, m.player4_id].includes(me.id)),
    ...leagueMatches.filter(m => {
      const league = leagues.find(l => l.id === m.league_id)
      return league?.teams?.some(tm => tm.player1_id === me.id || tm.player2_id === me.id)
    })
  ]
  const myRatings = getPlayerRatings(me.id)
  const myBadges = computeBadges(me, myRatings)

  if (loadingData) return (
    <div style={{ minHeight: '100vh', background: '#0e0e16', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
      <style>{STYLES}</style>
      <div style={{ color: '#a855f7', fontSize: 20, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>⚡ PADELLINK</div>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(168,85,247,0.2)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <ToastCtx.Provider value={showToast}>
      <ConfirmCtx.Provider value={confirm}>
        <div className="app" dir={lang === 'he' ? 'rtl' : 'ltr'}>
          <style>{STYLES}</style>

          <div className="header">
            <span className="header-logo">PadelLink</span>
            <div className="header-right">
              {totalNotifs > 0 && <div className="notif-dot">{totalNotifs}</div>}
              {ALL_LANGS.filter(l => l !== lang).map(l => (
                <button key={l} className="lang-btn" onClick={() => setLang(l)}>{LANG_LABELS[l]}</button>
              ))}
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
                loadingBg={loadingBg} matchConfirmations={matchConfirmations}
              />
            )}
            {tab === 'players' && !viewPlayerId && (
              <PlayersTab t={t} lang={lang} me={me} players={players} follows={follows}
                ratings={ratings} loadPlayers={loadPlayers} toggleFollow={toggleFollow}
                isFollowing={isFollowing} submitRating={submitRating}
                getMyRatingFor={getMyRatingFor} setViewPlayerId={setViewPlayerId}
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
                loadLeagues={loadLeagues} deleteLeague={deleteLeague}
                tournaments={tournaments} loadTournaments={loadTournaments}
              />
            )}
            {tab === 'ranking' && (
              <RankingTab t={t} lang={lang} players={players} leagues={leagues}
                leagueMatches={leagueMatches} follows={follows} ratings={ratings}
                rankTab={rankTab} setRankTab={setRankTab}
                setViewPlayerId={setViewPlayerId} setTab={setTab}
                me={me}
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

          <ToastContainer toasts={toasts} />
          {confirmState && (
            <ConfirmModal
              msg={confirmState.msg}
              confirmLabel={lang === 'fr' ? 'Confirmer' : lang === 'he' ? 'אשר' : 'Confirm'}
              cancelLabel={lang === 'fr' ? 'Annuler' : lang === 'he' ? 'בטל' : 'Cancel'}
              onConfirm={handleConfirm}
              onCancel={handleConfirmCancel}
            />
          )}
        </div>
      </ConfirmCtx.Provider>
    </ToastCtx.Provider>
  )
}


// ══ HOME ══
function HomeTab({ t, lang, me, players, followedPlayers, pendingForMe, myMatches, leagues, leagueMatches, myAdminLeagues, myLeaveReqs, resolveLeave, createFreeMatch, respondFreeMatch, setViewPlayerId, setTab, loadingBg, matchConfirmations }) {
  const [showCreate, setShowCreate] = useState(false)
  const [respondingId, setRespondingId] = useState(null)
  const [resolvingId, setResolvingId] = useState(null)
  const [showAllMatches, setShowAllMatches] = useState(false)
  const showToast = useToast()

  async function handleRespond(matchId, accepted) {
    if (respondingId) return
    setRespondingId(matchId + (accepted ? '_y' : '_n'))
    try {
      await respondFreeMatch(matchId, accepted)
      showToast(accepted ? t.matchConfirmed : t.matchRefused, accepted ? 'ok' : 'info')
    } catch {
      showToast(t.errorGeneric, 'err')
    }
    setRespondingId(null)
  }

  async function handleResolveLeave(leagueId, playerId, approve) {
    const key = leagueId + playerId
    if (resolvingId === key) return
    setResolvingId(key)
    try { await resolveLeave(leagueId, playerId, approve) } catch { showToast(t.errorGeneric, 'err') }
    setResolvingId(null)
  }

  return (
    <div>
      <div className="section-title">👋 {me.name.split(' ')[0]}</div>

      {myLeaveReqs.length > 0 && (
        <div>
          <div style={{ padding: '0 16px 6px', fontSize: 11, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>⚙️ {t.pendingLeaveRequests}</div>
          {myLeaveReqs.map(r => {
            const p = players.find(x => x.id === r.player_id)
            const l = myAdminLeagues.find(x => x.id === r.league_id)
            const key = r.league_id + r.player_id
            return (
              <div key={r.id} className="card card-yellow">
                <div className="fw600 mb8" style={{ fontSize: 13 }}>{p?.name} → {l?.name}</div>
                <div className="row gap8">
                  <button className="btn btn-green btn-sm flex1" disabled={resolvingId === key}
                    onClick={() => handleResolveLeave(r.league_id, r.player_id, true)}>
                    {resolvingId === key ? <Spin /> : '✓'} {t.leaveApprove}
                  </button>
                  <button className="btn btn-danger btn-sm flex1" disabled={resolvingId === key}
                    onClick={() => handleResolveLeave(r.league_id, r.player_id, false)}>
                    {resolvingId === key ? <Spin /> : '✕'} {t.leaveDecline}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {pendingForMe.length > 0 && (
        <div>
          <div style={{ padding: '0 16px 6px', fontSize: 11, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>⏳ {t.pendingMatches}</div>
          {pendingForMe.map(m => {
            const creator = players.find(p => p.id === m.creator_id)
            const pids = [m.player1_id, m.player2_id, m.player3_id, m.player4_id].filter(Boolean)
            const myConf = (matchConfirmations || []).find(c => c.match_id === m.id && c.player_id === me.id)
            const busyY = respondingId === m.id + '_y'
            const busyN = respondingId === m.id + '_n'
            const nonCreatorIds = pids.filter(id => id !== m.creator_id)
            const confirmedIds = (matchConfirmations || []).filter(c => c.match_id === m.id && c.confirmed).map(c => c.player_id)
            const waitingFor = nonCreatorIds.filter(id => !confirmedIds.includes(id) && id !== me.id).map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?')
            return (
              <div key={m.id} className="card card-yellow">
                <div className="fw600 mb4" style={{ fontSize: 13 }}>{creator?.name} — {t.matchFree}</div>
                <div className="text-xs mb8">{pids.map(id => players.find(p => p.id === id)?.name || '?').join(', ')}</div>
                {m.sets?.length > 0 && <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 600, marginBottom: 8 }}>{m.sets.map(s => s.a + '-' + s.b).join('  ')}</div>}
                {myConf ? (
                  <div style={{ fontSize: 12, fontWeight: 600, padding: '4px 0' }}>
                    <span style={{ color: myConf.confirmed ? '#10b981' : '#ef4444' }}>
                      {myConf.confirmed ? '✓ ' + (lang === 'fr' ? 'Confirmé' : lang === 'he' ? 'אושר' : 'Confirmed') : '✕ ' + (lang === 'fr' ? 'Refusé' : lang === 'he' ? 'נדחה' : 'Declined')}
                    </span>
                    {myConf.confirmed && waitingFor.length > 0 && (
                      <span style={{ color: '#f59e0b', marginLeft: 8 }}>
                        · {lang === 'fr' ? 'En attente de' : lang === 'he' ? 'ממתין ל' : 'Waiting for'} {waitingFor.join(', ')}
                      </span>
                    )}
                    {myConf.confirmed && waitingFor.length === 0 && (
                      <span style={{ color: '#10b981', marginLeft: 8 }}>· {lang === 'fr' ? 'Tous ont confirmé ✓' : lang === 'he' ? 'כולם אישרו ✓' : 'All confirmed ✓'}</span>
                    )}
                  </div>
                ) : (
                  <div className="row gap8">
                    <button className="btn btn-primary btn-sm flex1" disabled={!!respondingId}
                      onClick={() => handleRespond(m.id, true)}>
                      {busyY ? <Spin /> : '✓'} {t.confirm}
                    </button>
                    <button className="btn btn-danger btn-sm flex1" disabled={!!respondingId}
                      onClick={() => handleRespond(m.id, false)}>
                      {busyN ? <Spin /> : '✕'} {t.refuse}
                    </button>
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

      <div style={{ padding: '0 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.myMatches} ({myMatches.length})</span>
        {myMatches.length > 3 && <button style={{ fontSize: 11, color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowAllMatches(v => !v)}>{showAllMatches ? (lang === 'fr' ? '▲ Réduire' : lang === 'he' ? '▲ צמצם' : '▲ Show less') : (lang === 'fr' ? '▼ Tout voir' : lang === 'he' ? '▼ הצג הכל' : '▼ Show all')}</button>}
      </div>
      {loadingBg && myMatches.length === 0 && (
        <div>{[1,2,3].map(i => <SkeletonCard key={i} lines={2} />)}</div>
      )}
      {!loadingBg && myMatches.length === 0 && <div className="empty">{t.noMatches}</div>}
      {myMatches.slice().reverse().slice(0, showAllMatches ? undefined : 3).map(m => {
        const isLeagueMatch = !!m.league_id
        const league = isLeagueMatch ? leagues.find(l => l.id === m.league_id) : null
        let t1n = '?', t2n = '?', iWon = false
        if (isLeagueMatch && league) {
          const tt1 = league.teams?.find(x => x.id === m.team1_id)
          const tt2 = league.teams?.find(x => x.id === m.team2_id)
          if (tt1) t1n = tt1.name
          if (tt2) t2n = tt2.name
          const myTeam = league.teams?.find(tm => tm.player1_id === me.id || tm.player2_id === me.id)
          if (myTeam && m.winner_id) iWon = myTeam.id === m.winner_id
        } else {
          t1n = [m.player1_id, m.player2_id].map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
          t2n = [m.player3_id, m.player4_id].map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
          const inTeam1 = m.player1_id === me.id || m.player2_id === me.id
          if (m.sets?.length) {
            let w1 = 0, w2 = 0
            m.sets.forEach(s => { if (s.a > s.b) w1++; else if (s.b > s.a) w2++ })
            iWon = inTeam1 ? w1 > w2 : w2 > w1
          }
        }
        const hasResult = isLeagueMatch ? !!m.winner_id : m.status === 'confirmed' && m.sets?.length > 0
        const resultColor = !hasResult ? '#374151' : iWon ? '#10b981' : '#ef4444'
        const resultLabel = !hasResult ? '🔵 ' + t.matchFree : iWon ? '🏆 ' + t.matchWin : '❌ ' + t.matchLoss
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

      <div style={{ padding: '12px 16px 4px', fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>👥 {t.followedPlayers}</div>
      {loadingBg && followedPlayers.length === 0
        ? <SkeletonCard lines={1} />
        : followedPlayers.length === 0
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
  const [sel, setSel] = useState([me.id])
  const [sets, setSets] = useState([{ a: '', b: '' }])
  const [date, setDate] = useState('')
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const showToast = useToast()

  function toggleSel(pid) {
    setSel(prev => {
      const n = prev.slice()
      const i = n.indexOf(pid)
      if (i >= 0) n.splice(i, 1)
      else if (n.length < 4) n.push(pid)
      return n
    })
  }

  const ps = sets.map(s => ({ a: parseInt(s.a) || 0, b: parseInt(s.b) || 0 })).filter(s => s.a > 0 || s.b > 0)
  const t1names = sel.slice(0, 2).map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
  const t2names = sel.slice(2, 4).map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
  const allSelectable = [me, ...followedPlayers.filter(p => p.id !== me.id)]
  const filtered = search.trim().length >= 1
    ? allSelectable.filter(p => p.id === me.id || p.name.toLowerCase().includes(search.toLowerCase()) || (p.city || '').toLowerCase().includes(search.toLowerCase()))
    : allSelectable

  async function handleCreate() {
    if (saving) return
    setSaving(true)
    try { await onCreate({ playerIds: sel, sets: ps, date }) }
    catch { showToast(t.errorGeneric, 'err') }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">⚡ {t.createMatch}</div>
        {step === 1 && (
          <div>
            <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 700, marginBottom: 6 }}>{t.chooseTeams}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>{lang === 'fr' ? 'Éq.1 = joueurs 1&2 · Éq.2 = joueurs 3&4' : lang === 'he' ? 'קב.1 = שחקנים 1&2 · קב.2 = שחקנים 3&4' : 'Team1 = players 1&2 · Team2 = players 3&4'}</div>
            <input className="input" style={{ marginBottom: 8 }} placeholder={'🔍 ' + (lang === 'fr' ? 'Rechercher un joueur...' : lang === 'he' ? 'חפש שחקן...' : 'Search player...')}
              value={search} onChange={e => setSearch(e.target.value)} />
            <div style={{ maxHeight: 240, overflowY: 'auto', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
              {filtered.map(p => {
                const isSel = sel.includes(p.id)
                const isMe = p.id === me.id
                const idx = sel.indexOf(p.id)
                const teamTag = idx === 0 || idx === 1 ? '🔵 Éq.1' : idx === 2 || idx === 3 ? '🟣 Éq.2' : ''
                const isFollowed = followedPlayers.some(fp => fp.id === p.id)
                return (
                  <div key={p.id} className="row" style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: isMe ? 'default' : 'pointer', opacity: isMe ? 0.5 : 1, background: isSel ? 'rgba(124,58,237,0.1)' : 'transparent' }}
                    onClick={isMe ? null : () => toggleSel(p.id)}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, border: '2px solid ' + (isSel ? '#7c3aed' : '#374151'), background: isSel ? '#7c3aed' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>{isSel ? '✓' : ''}</div>
                    <Av size={30} photo={p.photo_url} name={p.name} />
                    <div className="col" style={{ flex: 1 }}>
                      <span style={{ fontSize: 13 }}>{p.name}{isMe ? ' (moi)' : ''}{isFollowed ? ' 👥' : ''}</span>
                      <span style={{ fontSize: 10, color: '#9ca3af' }}>Niv.{p.level} · {p.matches > 0 ? Math.round(p.wins / p.matches * 100) : 0}%V · {p.city}</span>
                    </div>
                    {isSel && <span style={{ fontSize: 10, color: '#a855f7', fontWeight: 700, flexShrink: 0 }}>{teamTag}</span>}
                  </div>
                )
              })}
              {filtered.length === 0 && <div style={{ padding: '12px', fontSize: 12, color: '#6b7280', textAlign: 'center' }}>{lang === 'fr' ? 'Aucun joueur trouvé' : lang === 'he' ? 'שחקן לא נמצא' : 'No player found'}</div>}
            </div>
            <div style={{ fontSize: 10, color: '#6b7280', margin: '8px 0 8px' }}>
              {sel.length}/4 · {lang === 'fr' ? `${followedPlayers.length} joueurs suivis disponibles` : lang === 'he' ? `${followedPlayers.length} שחקנים עוקבים זמינים` : `${followedPlayers.length} followed players available`}
            </div>
            {followedPlayers.length < 3 && (
              <div style={{ fontSize: 11, color: '#f59e0b', padding: '8px 10px', background: 'rgba(245,158,11,0.07)', borderRadius: 8, marginBottom: 8 }}>
                ⚠️ {lang === 'fr' ? 'Suis plus de joueurs pour créer un match !' : lang === 'he' ? 'עקוב אחרי יותר שחקנים כדי ליצור משחק!' : 'Follow more players to create a match!'}
              </div>
            )}
            <input className="input mb12" type="date" value={date} onChange={e => setDate(e.target.value)} />
            <div className="row gap8">
              <button className="btn btn-outline flex1" onClick={onClose}>{t.cancelBtn}</button>
              <button className="btn btn-primary flex1" disabled={sel.length !== 4} onClick={() => sel.length === 4 && setStep(2)}>{lang === 'fr' ? 'Suivant →' : lang === 'he' ? 'הבא →' : 'Next →'}</button>
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
              <button className="btn btn-primary flex1" disabled={saving} onClick={handleCreate}>
                {saving ? <Spin /> : null} {t.submitMatch}
              </button>
            </div>
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(139,92,246,0.07)', borderRadius: 8, fontSize: 11, color: '#6b7280', lineHeight: 1.6 }}>
              ℹ️ {lang === 'fr' ? 'Ce match sera envoyé aux 3 autres joueurs pour confirmation.' : lang === 'he' ? 'המשחק ישלח ל-3 שחקנים האחרים לאישור.' : 'This match will be sent to the 3 other players for confirmation.'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ══ PLAYERS TAB ══
function PlayersTab({ t, lang, me, players, follows, ratings, loadPlayers, toggleFollow, isFollowing, submitRating, getMyRatingFor, setViewPlayerId }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [ratingModal, setRatingModal] = useState(null)
  const [followingId, setFollowingId] = useState(null)
  const showToast = useToast()

  useEffect(() => {
    const timer = setTimeout(() => { setPage(0); loadPlayers(search, 0) }, 350)
    return () => clearTimeout(timer)
  }, [search])

  async function handleToggleFollow(p) {
    if (followingId) return
    setFollowingId(p.id)
    try { await toggleFollow(p.id) }
    catch { showToast(t.errorGeneric, 'err') }
    setFollowingId(null)
  }

  return (
    <div>
      <div style={{ padding: '12px 16px 8px' }}>
        <input className="input" placeholder={'🔍 ' + t.players + '...'} value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {players.map(p => {
        const isMe = p.id === me.id
        const isF = isFollowing(p.id)
        const info = getLevelInfo(p.level)
        const lbl = lang === 'en' ? info.labelEn : lang === 'he' ? info.labelHe : info.label
        const pRatings = ratings.filter(r => r.rated_id === p.id)
        const badges = computeBadges(p, pRatings)
        const busy = followingId === p.id
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
                  <button className={'btn btn-sm ' + (isF ? 'btn-danger' : 'btn-outline')} disabled={busy}
                    onClick={() => handleToggleFollow(p)}>
                    {busy ? <Spin /> : (isF ? t.unfollow : t.follow)}
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => setRatingModal(p)}>⭐ {t.rate}</button>
                </div>
              )}
            </div>
          </div>
        )
      })}
      <div style={{ padding: '0 16px 16px' }}>
        <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { const next = page + 1; setPage(next); loadPlayers(search, next) }}>
          {lang === 'fr' ? 'Charger plus' : lang === 'he' ? 'טען עוד' : 'Load more'}
        </button>
      </div>
      {ratingModal && (
        <RatingModal t={t} lang={lang} target={ratingModal} myExisting={getMyRatingFor(ratingModal.id)}
          submitRating={submitRating} onClose={() => setRatingModal(null)} />
      )}
    </div>
  )
}

// ══ PLAYER PROFILE ══
function PlayerProfile({ t, lang, me, player, players, follows, ratings, myMatches, leagues, leagueMatches, isFollowing, toggleFollow, submitRating, getMyRatingFor, onBack }) {
  const [showRating, setShowRating] = useState(false)
  const [followingBusy, setFollowingBusy] = useState(false)
  const [allPlayerRatings, setAllPlayerRatings] = useState(null)
  const [showAllPlayerMatches, setShowAllPlayerMatches] = useState(false)
  const showToast = useToast()

  useEffect(() => {
    if (!player) return
    setAllPlayerRatings(null)
    supabase.from('ratings').select('*').eq('rated_id', player.id).then(({ data }) => {
      if (data) setAllPlayerRatings(data)
    })
  }, [player?.id])

  if (!player) return <div className="empty">{lang === 'fr' ? 'Joueur introuvable' : lang === 'he' ? 'שחקן לא נמצא' : 'Player not found'}</div>

  const isMe = player.id === me.id
  const isF = isFollowing(player.id)
  const info = getLevelInfo(player.level)
  const pRatings = allPlayerRatings ?? ratings.filter(r => r.rated_id === player.id)
  const badges = computeBadges(player, pRatings)
  const rl = RATING_LABELS[lang] || RATING_LABELS.en

  const playerMatches = myMatches.filter(m => {
    if (m.league_id) {
      const league = leagues.find(l => l.id === m.league_id)
      return league?.teams?.some(tm => tm.player1_id === player.id || tm.player2_id === player.id)
    }
    return [m.player1_id, m.player2_id, m.player3_id, m.player4_id].includes(player.id)
  })

  async function handleToggleFollow() {
    if (followingBusy) return
    setFollowingBusy(true)
    try { await toggleFollow(player.id) } catch { showToast(t.errorGeneric, 'err') }
    setFollowingBusy(false)
  }

  return (
    <div>
      <div className="row" style={{ padding: '14px 16px 8px' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>← {lang === 'fr' ? 'Retour' : lang === 'he' ? 'חזרה' : 'Back'}</button>
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
            <button className={'btn ' + (isF ? 'btn-danger' : 'btn-primary') + ' btn-sm flex1'} disabled={followingBusy} onClick={handleToggleFollow}>
              {followingBusy ? <Spin /> : (isF ? t.unfollow : t.follow)}
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
          const avg = computeRatingAvg(pRatings, key === 'level' ? 'level_rating' : key)
          return (
            <div key={key} className="row mb8" style={{ justifyContent: 'space-between' }}>
              <span className="text-sm">{rl[key]}</span>
              <Stars val={avg} readOnly />
              <span className="text-xs" style={{ marginLeft: 6 }}>{avg > 0 ? avg.toFixed(1) + ' (' + pRatings.length + ')' : '-'}</span>
            </div>
          )
        })}
      </div>
      {playerMatches.length > 0 && (
        <div>
          <div style={{ padding: '0 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t.myMatches} ({playerMatches.length})</span>
            {playerMatches.length > 3 && <button style={{ fontSize: 11, color: '#a855f7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowAllPlayerMatches(v => !v)}>{showAllPlayerMatches ? (lang === 'fr' ? '▲ Réduire' : lang === 'he' ? '▲ צמצם' : '▲ Less') : (lang === 'fr' ? '▼ Tout voir' : lang === 'he' ? '▼ הצג הכל' : '▼ All')}</button>}
          </div>
          {playerMatches.slice(0, showAllPlayerMatches ? undefined : 3).map(m => {
            const league = m.league_id ? leagues.find(l => l.id === m.league_id) : null
            const t1n = league ? league.teams?.find(x => x.id === m.team1_id)?.name || 'Éq.1' : [m.player1_id, m.player2_id].map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
            const t2n = league ? league.teams?.find(x => x.id === m.team2_id)?.name || 'Éq.2' : [m.player3_id, m.player4_id].map(id => players.find(p => p.id === id)?.name?.split(' ')[0] || '?').join(' & ')
            return (
              <div key={m.id} className="card" style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{t1n} {t.vs} {t2n}</div>
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
          submitRating={submitRating} onClose={() => setShowRating(false)} />
      )}
    </div>
  )
}

// ══ RATING MODAL ══
function RatingModal({ t, lang, target, myExisting, submitRating, onClose }) {
  const rl = RATING_LABELS[lang] || RATING_LABELS.en
  const [ratings, setRatings] = useState({
    fairplay: myExisting?.fairplay || 0, service: myExisting?.service || 0,
    reflex: myExisting?.reflex || 0, power: myExisting?.power || 0,
    level: myExisting?.level_rating || 0
  })
  const [saving, setSaving] = useState(false)
  const showToast = useToast()

  async function handleSave() {
    setSaving(true)
    try { await submitRating(target.id, ratings); showToast(t.saved, 'ok'); onClose() }
    catch { showToast(t.errorGeneric, 'err') }
    setSaving(false)
  }

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
          <button className="btn btn-primary flex1" disabled={saving} onClick={handleSave}>
            {saving ? <Spin /> : null} {t.saveBtn}
          </button>
        </div>
      </div>
    </div>
  )
}

// ══ LEAGUES TAB ══
function LeaguesTab({ t, lang, me, leagues, players, createLeague, joinLeague, setViewLeagueId, setPreviewLeagueId }) {
  const [showCreate, setShowCreate] = useState(false)
  const showToast = useToast()
  const myLeagues = leagues.filter(l => l.league_members?.some(lm => lm.player_id === me.id))
  const otherLeagues = leagues.filter(l => !l.league_members?.some(lm => lm.player_id === me.id))

  function renderLeague(l) {
    const isMem = l.league_members?.some(lm => lm.player_id === me.id)
    const memberCount = l.league_members?.length || 0
    const maxPlayers = l.max_players || 0
    const isFull = maxPlayers > 0 && memberCount >= maxPlayers
    const memberLabel = maxPlayers > 0 ? `${memberCount}/${maxPlayers} ${t.memberCount}` : `${memberCount} ${t.memberCount}`
    return (
      <div key={l.id} className="card card-purple">
        <div style={{ cursor: 'pointer' }} onClick={() => isMem ? setViewLeagueId(l.id) : setPreviewLeagueId(l.id)}>
          <div className="row mb4">
            <div className="fw700 flex1" style={{ fontSize: 15 }}>{l.is_private ? '🔒 ' : '🌍 '}{l.name}</div>
            {isMem && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>✓ {lang === 'fr' ? 'Membre' : lang === 'he' ? 'חבר' : 'Member'}</span>}
            {!isMem && isFull && <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>🔴 {t.leagueFull}</span>}
          </div>
          <div className="text-sm mb4">{l.season}</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: isMem ? 0 : 8 }}>
            <span className="text-xs">{memberLabel}</span>
            <span className="text-xs">{t.duration}: {l.match_duration}min</span>
            <span className="text-xs">{t.minAgeShort}: {l.min_age}ans</span>
          </div>
        </div>
        {!isMem && !isFull && (
          <button className="btn btn-green btn-sm" style={{ width: '100%' }} onClick={() => setPreviewLeagueId(l.id)}>
            {l.is_private ? '🔒 ' : '🌍 '}{t.joinLeague}
          </button>
        )}
        {!isMem && isFull && (
          <div style={{ width: '100%', textAlign: 'center', padding: '8px 0', fontSize: 12, color: '#ef4444', fontWeight: 700 }}>
            🔴 {t.leagueFull}
          </div>
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
      {leagues.length === 0 && <div className="empty">{lang === 'fr' ? 'Aucune ligue.\nCrée la première ! 🎾' : lang === 'he' ? 'אין ליגות עדיין.\nצור את הראשונה! 🎾' : 'No leagues yet.\nCreate the first one! 🎾'}</div>}
      {showCreate && (
        <CreateLeagueModal t={t} lang={lang}
          onCreate={async d => { try { await createLeague(d); setShowCreate(false); showToast(lang === 'fr' ? '✓ Ligue créée !' : lang === 'he' ? '✓ ליגה נוצרה!' : '✓ League created!', 'ok') } catch { showToast(t.errorGeneric, 'err') } }}
          onClose={() => setShowCreate(false)} />
      )}
    </div>
  )
}

// ══ LEAGUE PREVIEW ══
function LeaguePreview({ t, lang, league, players, me, joinLeague, setViewLeagueId, setPreviewLeagueId }) {
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [joining, setJoining] = useState(false)
  const showToast = useToast()
  const isMem = league.league_members?.some(lm => lm.player_id === me.id)
  const admin = players.find(p => p.id === league.admin_id)
  const memberCount = league.league_members?.length || 0
  const maxPlayers = league.max_players || 0
  const isFull = maxPlayers > 0 && memberCount >= maxPlayers

  async function doJoin() {
    if (league.is_private) {
      if (!code.trim()) { setCodeError(t.wrongCode); return }
    }
    if (joining) return
    setJoining(true)
    setCodeError('')
    try {
      await joinLeague(league.id)
      showToast(t.leagueJoined, 'ok')
      setViewLeagueId(league.id)
      setPreviewLeagueId(null)
    } catch (e) {
      showToast(e?.message || t.errorGeneric, 'err')
    }
    setJoining(false)
  }

  return (
    <div>
      <div className="row" style={{ padding: '14px 16px 8px' }}>
        <button className="btn btn-outline btn-sm" onClick={() => setPreviewLeagueId(null)}>← {lang === 'en' ? 'Back' : 'Retour'}</button>
        <span className="fw700" style={{ fontSize: 15, marginLeft: 8 }}>{league.is_private ? '🔒 ' : '🌍 '}{league.name}</span>
      </div>
      <div className="card card-purple">
        <div className="fw700 mb4" style={{ fontSize: 16 }}>{league.name}</div>
        <div className="text-sm mb8">{league.season}</div>
        <div className="grid2" style={{ marginBottom: 12 }}>
          <div className="stat-box"><div className="stat-val">{maxPlayers > 0 ? `${memberCount}/${maxPlayers}` : memberCount}</div><div className="stat-lbl">{t.memberCount}</div></div>
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
        const p = players.find(x => x.id === lm.player_id)
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
      {!isMem && !isFull && (
        <div style={{ padding: '12px 16px' }}>
          {league.is_private && (
            <div style={{ marginBottom: 10 }}>
              <input className="input" placeholder={t.enterCode} value={code} maxLength={10}
                onChange={e => { setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()); setCodeError('') }}
                style={{ marginBottom: codeError ? 6 : 0 }} />
              {codeError && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{codeError}</div>}
            </div>
          )}
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={joining} onClick={doJoin}>
            {joining ? <Spin /> : '✅'} {t.confirmJoin}
          </button>
        </div>
      )}
      {!isMem && isFull && (
        <div style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#ef4444' }}>
          🔴 {t.leagueFull}
        </div>
      )}
      {isMem && (
        <div style={{ padding: '12px 16px' }}>
          <button className="btn btn-green" style={{ width: '100%' }} onClick={() => { setViewLeagueId(league.id); setPreviewLeagueId(null) }}>
            {lang === 'fr' ? 'Ouvrir la ligue' : lang === 'he' ? 'פתח ליגה' : 'Open league'}
          </button>
        </div>
      )}
    </div>
  )
}

// ══ CREATE LEAGUE MODAL ══
function CreateLeagueModal({ t, lang, onCreate, onClose }) {
  const [form, setForm] = useState({ name: '', season: '', rules: '', setsPerMatch: 3, matchDuration: 90, minAge: 16, maxPlayers: 0, isPrivate: false, code: '' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const set = (k, v) => { setFormError(''); setForm(p => ({ ...p, [k]: v })) }

  function parseNum(val, fallback = 0) {
    const n = parseInt(val, 10)
    return isNaN(n) ? fallback : n
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.season.trim()) {
      setFormError(t.leagueFormError)
      return
    }
    setSaving(true)
    try { await onCreate(form) } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">+ {t.createLeague}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input className="input" placeholder={t.leagueName + ' *'} maxLength={50} value={form.name} onChange={e => set('name', e.target.value)} />
          <input className="input" placeholder={t.season + ' *'} maxLength={50} value={form.season} onChange={e => set('season', e.target.value)} />
          <textarea className="input" placeholder={t.rules} value={form.rules} rows={3} maxLength={500} onChange={e => set('rules', e.target.value)} style={{ resize: 'none' }} />
          <div className="row gap8">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{t.setsMatch}</div>
              <select className="select" value={form.setsPerMatch} onChange={e => set('setsPerMatch', parseInt(e.target.value))}>
                <option value={1}>1 set</option><option value={3}>Best of 3</option><option value={5}>Best of 5</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{t.matchDuration} <span style={{ color: '#4b5563' }}>({t.durationHint})</span></div>
              <input className="input" type="number" min={0} value={form.matchDuration} onChange={e => set('matchDuration', parseNum(e.target.value))} />
            </div>
          </div>
          <div className="row gap8">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{t.minAge}</div>
              <input className="input" type="number" value={form.minAge} onChange={e => set('minAge', parseNum(e.target.value))} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{t.maxPlayers} <span style={{ color: '#4b5563' }}>({t.maxPlayersHint})</span></div>
              <input className="input" type="number" min={0} value={form.maxPlayers} onChange={e => set('maxPlayers', parseNum(e.target.value))} />
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t.visibilityLabel}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10, lineHeight: 1.6 }}>{form.isPrivate ? t.visibilityPrivateDesc : t.visibilityPublicDesc}</div>
            <Toggle on={form.isPrivate} onToggle={() => set('isPrivate', !form.isPrivate)} label={t.privateToggleLabel} />
            {form.isPrivate && <input className="input" style={{ marginTop: 10 }} placeholder={t.privateCode + ' (max 10)'}
              maxLength={10} value={form.code}
              onChange={e => set('code', e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10))} />}
          </div>
          {formError && (
            <div style={{ padding: '10px 12px', borderRadius: 10, fontSize: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
              {formError}
            </div>
          )}
        </div>
        <div className="row gap8 mt12">
          <button className="btn btn-outline flex1" onClick={onClose}>{t.cancelBtn}</button>
          <button className="btn btn-primary flex1" disabled={saving} onClick={handleCreate}>
            {saving ? <Spin /> : null} {t.create}
          </button>
        </div>
      </div>
    </div>
  )
}

// ══ LEAGUE VIEW ══
function LeagueView({ t, lang, league, players, me, leagueMatches, selectedTab, setSelectedTab, addLeagueMatch, expelMember, sendChatMsg, toggleSubAdmin, requestLeave, resolveLeave, randomDrawTeams, leaveRequests, onBack, loadLeagues, deleteLeague, tournaments, loadTournaments }) {
  const isAdmin = league.admin_id === me.id
  const myRole = league.league_members?.find(lm => lm.player_id === me.id)?.role
  const isSubAdmin = myRole === 'sub_admin'
  const canPostScore = isAdmin || isSubAdmin
  const hasLeaveReq = leaveRequests.some(r => r.league_id === league.id && r.player_id === me.id)
  const myLeaveReqs = leaveRequests.filter(r => r.league_id === league.id)
  const [leaveBusy, setLeaveBusy] = useState(false)
  const [deletingLeague, setDeletingLeague] = useState(false)
  const showToast = useToast()
  const confirm = useConfirm()

  async function handleDeleteLeague() {
    const ok = await confirm(t.confirmDeleteLeague)
    if (!ok) return
    setDeletingLeague(true)
    try { await deleteLeague(league.id); onBack() }
    catch { showToast(t.errorGeneric, 'err'); setDeletingLeague(false) }
  }

  const LTABS = [
    { id: 'ranking2', label: t.ranking2 },
    { id: 'matches', label: t.matches },
    { id: 'teams', label: t.teams },
    { id: 'tournament', label: '🏆 ' + t.tournamentTab },
    { id: 'members', label: t.members },
    { id: 'chat', label: t.chat },
  ]

  function computeStandings() {
    const tbl = {}
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

  async function handleLeave() {
    const ok = await confirm(t.confirmLeave)
    if (!ok) return
    setLeaveBusy(true)
    try { await requestLeave(league.id); showToast(t.leagueLeft, 'info') }
    catch { showToast(t.errorGeneric, 'err') }
    setLeaveBusy(false)
  }

  return (
    <div>
      <div className="row" style={{ padding: '14px 16px 4px' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>← {t.leagues}</button>
        <span className="fw700 flex1" style={{ fontSize: 14, marginLeft: 8 }}>{league.is_private ? '🔒 ' : '🌍 '}{league.name}</span>
        {isAdmin && <button className="btn btn-danger btn-sm" disabled={deletingLeague} onClick={handleDeleteLeague}>🗑 {t.deleteLeague}</button>}
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
            : <button className="btn btn-danger btn-sm" disabled={leaveBusy} onClick={handleLeave}>
                {leaveBusy ? <Spin /> : null} {t.leaveLeague}
              </button>
          }
        </div>
      )}
      {isAdmin && myLeaveReqs.length > 0 && (
        <div style={{ margin: '0 16px 8px', padding: '10px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>{t.pendingLeaveRequests}</div>
          {myLeaveReqs.map(r => {
            const p = players.find(x => x.id === r.player_id)
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
      {selectedTab === 'tournament' && <TournamentTab t={t} lang={lang} league={league} players={players} isAdmin={isAdmin} isSubAdmin={isSubAdmin} tournaments={tournaments} loadTournaments={loadTournaments} />}
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
  const [t1, setT1] = useState('')
  const [t2, setT2] = useState('')
  const [sets, setSets] = useState([{ a: '', b: '' }])
  const [date, setDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [errMsg, setErrMsg] = useState(null)

  function getTeamName(id) { return (league.teams || []).find(x => x.id == id)?.name || '?' }
  function getTeamPNames(id) {
    const tm = (league.teams || []).find(x => x.id == id)
    if (!tm) return ''
    return [tm.player1_id, tm.player2_id].map(pid => players.find(p => p.id === pid)?.name || '?').join(' & ')
  }

  const ps = sets.map(s => ({ a: parseInt(s.a) || 0, b: parseInt(s.b) || 0 })).filter(s => s.a > 0 || s.b > 0)

  async function handleAdd() {
    if (!t1 || !t2 || t1 === t2 || !ps.length) return
    setSaving(true); setErrMsg(null)
    const winnerId = matchWinner(t1, t2, ps)
    const err = await addLeagueMatch(league.id, { team1Id: t1, team2Id: t2, sets: ps, date, winnerId })
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
                {(league.teams || []).map(tm => {
                  const op1 = players.find(p => p.id === tm.player1_id)
                  const op2 = players.find(p => p.id === tm.player2_id)
                  const avg = op1 && op2 ? ((op1.level + op2.level) / 2).toFixed(1) : ''
                  return <option key={tm.id} value={tm.id}>{tm.name}{avg ? ' (moy.' + avg + ')' : ''}</option>
                })}
              </select>
              {t1 && <div style={{ fontSize: 10, color: '#06b6d4', marginTop: 4 }}>{getTeamPNames(t1)}</div>}
            </div>
            <span className="score-vs">vs</span>
            <div style={{ flex: 1 }}>
              <select className="select" value={t2} onChange={e => setT2(e.target.value)}>
                <option value="">{t.team2}</option>
                {(league.teams || []).filter(tm => '' + tm.id !== t1).map(tm => {
                  const op1 = players.find(p => p.id === tm.player1_id)
                  const op2 = players.find(p => p.id === tm.player2_id)
                  const avg = op1 && op2 ? ((op1.level + op2.level) / 2).toFixed(1) : ''
                  return <option key={tm.id} value={tm.id}>{tm.name}{avg ? ' (moy.' + avg + ')' : ''}</option>
                })}
              </select>
              {t2 && <div style={{ fontSize: 10, color: '#a855f7', marginTop: 4 }}>{getTeamPNames(t2)}</div>}
            </div>
          </div>
          <div style={{ marginTop: 10, marginBottom: 6, fontSize: 11, color: '#a855f7', fontWeight: 700 }}>{t.enterSets}</div>
          <SetsInput sets={sets} onChange={setSets} t={t} />
          {t1 && t2 && ps.length > 0 && <SetsPreview sets={ps} t1name={getTeamName(t1)} t2name={getTeamName(t2)} />}
          <input className="input mb8 mt8" type="date" value={date} onChange={e => setDate(e.target.value)} />
          {errMsg && <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 8 }}>{errMsg}</div>}
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={saving || !t1 || !t2 || t1 === t2 || !ps.length} onClick={handleAdd}>
            {saving ? <Spin /> : null} {t.addTeamMatch}
          </button>
        </div>
      ) : (
        <div className="card mt8" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>🔒</div>
          <div className="text-sm">{t.adminOnly}</div>
        </div>
      )}
      {leagueMatches.length === 0 && <div className="empty">{t.noMatchYet}</div>}
      {leagueMatches.slice().reverse().map(m => {
        const t1n = getTeamName(m.team1_id), t2n = getTeamName(m.team2_id)
        const t1pn = getTeamPNames(m.team1_id), t2pn = getTeamPNames(m.team2_id)
        const w = (league.teams || []).find(x => x.id === m.winner_id)
        const isT1Win = m.winner_id === m.team1_id, isT2Win = m.winner_id === m.team2_id
        return (
          <div key={m.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isT1Win ? '#06b6d4' : '#e2e8f0' }}>{isT1Win ? '🏆 ' : ''}{t1n}</div>
                    {t1pn && <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>{t1pn}</div>}
                  </div>
                  <span style={{ fontSize: 11, color: '#4b5563', fontWeight: 700 }}>{t.vs}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isT2Win ? '#a855f7' : '#e2e8f0' }}>{isT2Win ? '🏆 ' : ''}{t2n}</div>
                    {t2pn && <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>{t2pn}</div>}
                  </div>
                </div>
              </div>
              {m.played_at && <span className="text-xs" style={{ flexShrink: 0, marginLeft: 8 }}>{m.played_at}</span>}
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {(m.sets || []).map((s, i) => <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '4px 10px', fontFamily: "'Bebas Neue',cursive", fontSize: 18, color: s.a > s.b ? '#06b6d4' : s.b > s.a ? '#a855f7' : '#9ca3af' }}>{s.a}-{s.b}</div>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LeagueTeamsTab({ t, lang, league, players, isAdmin, isSubAdmin, randomDrawTeams, loadLeagues }) {
  const canEdit = isAdmin || isSubAdmin
  const [editId, setEditId] = useState(null)
  const [eName, setEName] = useState('')
  const [eP1, setEP1] = useState('')
  const [eP2, setEP2] = useState('')
  const [saving, setSaving] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [balancing, setBalancing] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newP1, setNewP1] = useState('')
  const [newP2, setNewP2] = useState('')
  const [creating, setCreating] = useState(false)
  const showToast = useToast()
  const confirm = useConfirm()
  const leaguePlayerIds = (league.league_members || []).map(lm => lm.player_id)
  const leaguePlayers = players.filter(p => leaguePlayerIds.includes(p.id))

  const assignedIds = new Set(
    (league.teams || []).flatMap(tm => [tm.player1_id, tm.player2_id]).filter(Boolean)
  )
  const unassigned = leaguePlayers.filter(p => !assignedIds.has(p.id))

  const teamPrefix = lang === 'fr' ? 'Équipe ' : lang === 'he' ? 'קבוצה ' : 'Team '

  function makeBalancedPairs(ps) {
    const sorted = ps.slice().sort((a, b) => b.level - a.level)
    const pairs = []
    for (let i = 0; i < sorted.length; i += 4) {
      if (sorted[i]) pairs.push([sorted[i], sorted[i + 2] || null])
      if (sorted[i + 1]) pairs.push([sorted[i + 1], sorted[i + 3] || null])
    }
    return pairs
  }

  async function handleCreate() {
    if (!newName.trim()) return
    setCreating(true)
    try {
      await supabase.from('teams').insert({ league_id: league.id, name: newName.trim(), player1_id: newP1 || null, player2_id: newP2 || null })
      await loadLeagues(0)
      showToast(t.saved, 'ok')
      setShowCreate(false); setNewName(''); setNewP1(''); setNewP2('')
    } catch { showToast(t.errorGeneric, 'err') }
    setCreating(false)
  }

  async function handleDelete(teamId) {
    const ok = await confirm(lang === 'fr' ? 'Supprimer cette équipe ?' : lang === 'he' ? 'למחוק קבוצה זו?' : 'Delete this team?')
    if (!ok) return
    try {
      await supabase.from('teams').delete().eq('id', teamId)
      await loadLeagues(0)
      showToast(lang === 'fr' ? 'Équipe supprimée' : lang === 'he' ? 'קבוצה נמחקה' : 'Team deleted', 'ok')
    } catch { showToast(t.errorGeneric, 'err') }
  }

  async function saveTeamEdit() {
    setSaving(true)
    await supabase.from('teams').update({ name: eName, player1_id: eP1 || null, player2_id: eP2 || null }).eq('id', editId)
    await loadLeagues(0)
    setEditId(null); setSaving(false)
    showToast(t.saved, 'ok')
  }

  async function handleDraw() {
    const ok = await confirm(t.confirmDraw)
    if (!ok) return
    setDrawing(true)
    try { await randomDrawTeams(league.id); showToast(lang === 'fr' ? '🎲 Tirage effectué !' : lang === 'he' ? '🎲 הגרלה בוצעה!' : '🎲 Draw done!', 'ok') }
    catch { showToast(t.errorGeneric, 'err') }
    setDrawing(false)
  }

  async function handleBalance() {
    const ok = await confirm(t.confirmBalance)
    if (!ok) return
    setBalancing(true)
    try {
      await supabase.from('teams').delete().eq('league_id', league.id)
      const pairs = makeBalancedPairs(leaguePlayers)
      const newTeams = pairs.map((pair, i) => ({
        league_id: league.id, name: teamPrefix + (i + 1),
        player1_id: pair[0]?.id || null, player2_id: pair[1]?.id || null
      }))
      if (newTeams.length) await supabase.from('teams').insert(newTeams)
      await loadLeagues(0)
      showToast(lang === 'fr' ? '⚖️ Équipes équilibrées !' : lang === 'he' ? '⚖️ קבוצות אוזנו!' : '⚖️ Teams balanced!', 'ok')
    } catch { showToast(t.errorGeneric, 'err') }
    setBalancing(false)
  }

  async function handleCompleteRemaining() {
    if (unassigned.length < 2) return
    setCompleting(true)
    try {
      const pairs = makeBalancedPairs(unassigned)
      const existingCount = (league.teams || []).length
      const newTeams = pairs.map((pair, i) => ({
        league_id: league.id, name: teamPrefix + (existingCount + i + 1),
        player1_id: pair[0]?.id || null, player2_id: pair[1]?.id || null
      }))
      if (newTeams.length) await supabase.from('teams').insert(newTeams)
      await loadLeagues(0)
      showToast(lang === 'fr' ? '⚡ Équipes complétées !' : lang === 'he' ? '⚡ קבוצות הושלמו!' : '⚡ Teams completed!', 'ok')
    } catch { showToast(t.errorGeneric, 'err') }
    setCompleting(false)
  }

  function teamAvg(tm) {
    const lvls = [players.find(p => p.id === tm.player1_id)?.level, players.find(p => p.id === tm.player2_id)?.level].filter(Boolean)
    return lvls.length ? (lvls.reduce((a, b) => a + b, 0) / lvls.length).toFixed(1) : null
  }

  const allAssigned = leaguePlayers.length > 0 && unassigned.length === 0
  const hasPartialTeams = (league.teams || []).length > 0 && unassigned.length >= 2

  function pickPlayer(pid) {
    if (!newP1) setNewP1(pid)
    else if (!newP2 && pid !== newP1) setNewP2(pid)
  }

  return (
    <div style={{ padding: '0 16px' }}>
      {canEdit && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <button className="btn btn-outline" style={{ width: '100%' }} disabled={drawing} onClick={handleDraw}>
              {drawing ? <Spin /> : '🎲'} {t.randomDraw}
            </button>
            <div style={{ fontSize: 10, color: '#6b7280', marginTop: 4, lineHeight: 1.4 }}>{t.drawDesc}</div>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <button style={{ width: '100%', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4', borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} disabled={balancing} onClick={handleBalance}>
              {balancing ? <Spin /> : '⚖️'} {lang === 'fr' ? 'Équilibrer' : lang === 'he' ? 'אזן' : 'Balance'}
            </button>
            <div style={{ fontSize: 10, color: '#6b7280', marginTop: 4, lineHeight: 1.4 }}>{t.balanceDesc}</div>
          </div>
        </div>
      )}
      {canEdit && !allAssigned && (
        <button className="btn btn-green" style={{ width: '100%', marginBottom: 8, marginTop: 4 }} onClick={() => { setShowCreate(true); setNewName(''); setNewP1(''); setNewP2('') }}>
          + {lang === 'fr' ? 'Créer une équipe' : lang === 'he' ? 'צור קבוצה' : 'Create a team'}
        </button>
      )}
      {showCreate && canEdit && (
        <div className="card card-green mb8">
          <div className="fw600 mb8" style={{ fontSize: 13 }}>{lang === 'fr' ? 'Nouvelle équipe' : lang === 'he' ? 'קבוצה חדשה' : 'New team'}</div>
          <input className="input mb8" value={newName} onChange={e => setNewName(e.target.value)} placeholder={lang === 'fr' ? "Nom de l'équipe" : lang === 'he' ? 'שם הקבוצה' : 'Team name'} maxLength={40} />
          {unassigned.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>{t.availablePlayers}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {unassigned.map(p => {
                  const isP1 = newP1 === p.id, isP2 = newP2 === p.id
                  const wp = p.matches > 0 ? Math.round(p.wins / p.matches * 100) : 0
                  return (
                    <button key={p.id} onClick={() => {
                      if (isP1) setNewP1('')
                      else if (isP2) setNewP2('')
                      else pickPlayer(p.id)
                    }} style={{
                      padding: '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      cursor: 'pointer', border: '1.5px solid',
                      borderColor: isP1 ? '#06b6d4' : isP2 ? '#a855f7' : 'rgba(255,255,255,0.12)',
                      background: isP1 ? 'rgba(6,182,212,0.2)' : isP2 ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                      color: isP1 ? '#06b6d4' : isP2 ? '#a855f7' : '#d1d5db',
                    }}>
                      {p.name} · {p.level} · {wp}%V {isP1 ? '①' : isP2 ? '②' : ''}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{lang === 'fr' ? 'Joueur 1' : lang === 'he' ? 'שחקן 1' : 'Player 1'}</div>
          <PlayerPicker players={leaguePlayers} value={newP1} onChange={setNewP1}
            placeholder={lang === 'fr' ? 'Rechercher joueur 1...' : lang === 'he' ? 'חפש שחקן 1...' : 'Search player 1...'} excludeIds={newP2 ? [newP2] : []} lang={lang} />
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{lang === 'fr' ? 'Joueur 2' : lang === 'he' ? 'שחקן 2' : 'Player 2'}</div>
          <PlayerPicker players={leaguePlayers} value={newP2} onChange={setNewP2}
            placeholder={lang === 'fr' ? 'Rechercher joueur 2...' : lang === 'he' ? 'חפש שחקן 2...' : 'Search player 2...'} excludeIds={newP1 ? [newP1] : []} lang={lang} />
          <div className="row gap8 mt8">
            <button className="btn btn-outline flex1" onClick={() => setShowCreate(false)}>{t.cancelBtn}</button>
            <button className="btn btn-primary flex1" disabled={!newName.trim() || creating} onClick={handleCreate}>
              {creating ? <Spin /> : t.create}
            </button>
          </div>
        </div>
      )}
      {(league.teams || []).length === 0 && <div className="empty">{lang === 'fr' ? 'Aucune équipe.' : lang === 'he' ? 'אין קבוצות עדיין.' : 'No teams yet.'}</div>}
      {(league.teams || []).map(tm => {
        const p1 = players.find(p => p.id === tm.player1_id)
        const p2 = players.find(p => p.id === tm.player2_id)
        const isEd = editId === tm.id
        const avg = teamAvg(tm)
        return (
          <div key={tm.id} className="card mb8">
            {isEd ? (
              <div>
                <input className="input mb8" value={eName} onChange={e => setEName(e.target.value)} placeholder={lang === 'fr' ? "Nom de l'équipe" : lang === 'he' ? 'שם הקבוצה' : 'Team name'} />
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{lang === 'fr' ? 'Joueur 1' : lang === 'he' ? 'שחקן 1' : 'Player 1'}</div>
                <PlayerPicker players={leaguePlayers} value={eP1} onChange={setEP1}
                  placeholder={lang === 'fr' ? 'Rechercher joueur 1...' : lang === 'he' ? 'חפש שחקן 1...' : 'Search player 1...'} excludeIds={eP2 ? [eP2] : []} lang={lang} />
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{lang === 'fr' ? 'Joueur 2' : lang === 'he' ? 'שחקן 2' : 'Player 2'}</div>
                <PlayerPicker players={leaguePlayers} value={eP2} onChange={setEP2}
                  placeholder={lang === 'fr' ? 'Rechercher joueur 2...' : lang === 'he' ? 'חפש שחקן 2...' : 'Search player 2...'} excludeIds={eP1 ? [eP1] : []} lang={lang} />
                <div className="row gap8 mt8">
                  <button className="btn btn-outline flex1" onClick={() => setEditId(null)}>{t.cancelBtn}</button>
                  <button className="btn btn-primary flex1" disabled={saving} onClick={saveTeamEdit}>{saving ? <Spin /> : t.saveBtn}</button>
                </div>
              </div>
            ) : (
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="col" style={{ flex: 1 }}>
                  <div className="row gap4">
                    <div className="fw600" style={{ fontSize: 13 }}>{tm.name}</div>
                    {avg && <span style={{ fontSize: 10, color: '#a855f7', background: 'rgba(139,92,246,0.15)', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>moy. {avg}</span>}
                  </div>
                  <div className="text-xs">
                    {p1 ? `${p1.name} · ${p1.level} · ${p1.matches > 0 ? Math.round(p1.wins / p1.matches * 100) : 0}%V` : '—'} &amp; {p2 ? `${p2.name} · ${p2.level} · ${p2.matches > 0 ? Math.round(p2.wins / p2.matches * 100) : 0}%V` : '—'}
                  </div>
                </div>
                {canEdit && (
                  <div className="row gap4">
                    <button className="btn btn-outline btn-sm" onClick={() => { setEditId(tm.id); setEName(tm.name); setEP1(tm.player1_id || ''); setEP2(tm.player2_id || '') }}>✏️</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tm.id)}>🗑️</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
      {canEdit && hasPartialTeams && (
        <button style={{ width: '100%', marginTop: 4, marginBottom: 8, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.4)', color: '#a855f7', borderRadius: 12, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }} disabled={completing} onClick={handleCompleteRemaining}>
          {completing ? <Spin /> : t.completeTeams}
        </button>
      )}
    </div>
  )
}

// ══ TOURNAMENT SYSTEM ══

function generateElimBracket(teamIds, hasThirdPlace) {
  const teams = [...teamIds]
  for (let i = teams.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[teams[i], teams[j]] = [teams[j], teams[i]]
  }
  const n = teams.length
  if (n < 2) return null
  const size = Math.pow(2, Math.ceil(Math.log2(n)))
  const seeded = [...teams, ...Array(size - n).fill(null)]
  const r1 = []
  for (let i = 0; i < seeded.length; i += 2) {
    const t1 = seeded[i], t2 = seeded[i + 1]
    if (t1 === null && t2 === null) continue
    const isBye = (t1 === null) !== (t2 === null)
    const w = isBye ? (t1 !== null ? t1 : t2) : null
    r1.push({ id: `r1m${Math.floor(i / 2)}`, t1, t2, sets: [], winner: w, bye: isBye })
  }
  const rounds = [{ round: 1, matches: r1 }]
  let cnt = Math.floor(size / 4)
  for (let r = 2; cnt >= 1; r++, cnt = Math.floor(cnt / 2)) {
    rounds.push({ round: r, matches: Array.from({ length: cnt }, (_, i) => ({ id: `r${r}m${i}`, t1: null, t2: null, sets: [], winner: null, bye: false })) })
  }
  r1.forEach((m, i) => {
    if (m.winner && rounds[1]) {
      const nm = Math.floor(i / 2)
      const slot = i % 2 === 0 ? 't1' : 't2'
      if (rounds[1].matches[nm]) {
        rounds[1].matches[nm][slot] = m.winner
        const next = rounds[1].matches[nm]
        if ((next.t1 !== null && next.t2 === null) || (next.t1 === null && next.t2 !== null)) {
          next.winner = next.t1 !== null ? next.t1 : next.t2; next.bye = true
        }
      }
    }
  })
  return {
    type: 'elimination', hasThirdPlace, teams: teamIds, rounds, status: 'active',
    winner: null, second: null, third: null,
    thirdPlaceMatch: hasThirdPlace ? { id: '3rd', t1: null, t2: null, sets: [], winner: null } : null
  }
}

function generateRRBracket(teamIds) {
  const teams = [...teamIds]
  const matches = []
  let idx = 0
  for (let i = 0; i < teams.length; i++)
    for (let j = i + 1; j < teams.length; j++)
      matches.push({ id: `m${idx++}`, t1: teams[i], t2: teams[j], sets: [], winner: null, played: false })
  return { type: 'roundrobin', teams: teamIds, matches, status: 'active', winner: null }
}

function computeRRStandings(bracket) {
  const stats = {}
  ;(bracket.teams || []).forEach(t => { stats[t] = { teamId: t, W: 0, L: 0, P: 0 } })
  ;(bracket.matches || []).forEach(m => {
    if (!m.played || !m.winner) return
    const loser = m.t1 === m.winner ? m.t2 : m.t1
    if (stats[m.winner]) { stats[m.winner].W++; stats[m.winner].P += 3 }
    if (loser && stats[loser]) stats[loser].L++
  })
  return Object.values(stats).sort((a, b) => b.P - a.P || b.W - a.W)
}

function TournamentTab({ t, lang, league, players, isAdmin, isSubAdmin, tournaments, loadTournaments }) {
  const [creating, setCreating] = useState(false)
  const [viewId, setViewId] = useState(null)
  const showToast = useToast()
  const confirm = useConfirm()
  const myTournaments = (tournaments || []).filter(tr => tr.league_id === league.id)
  const viewing = myTournaments.find(tr => tr.id === viewId)
  const canEdit = isAdmin || isSubAdmin

  function getTeamName(id) { return (league.teams || []).find(tm => tm.id === id)?.name || '?' }

  async function handleDelete(trId) {
    const ok = await confirm(t.confirmDeleteTournament)
    if (!ok) return
    await supabase.from('tournaments').delete().eq('id', trId)
    await loadTournaments([league.id])
    if (viewId === trId) setViewId(null)
    showToast(lang === 'fr' ? 'Tournoi supprimé' : lang === 'he' ? 'טורניר נמחק' : 'Tournament deleted', 'ok')
  }

  if (viewing) return (
    <TournamentView t={t} lang={lang} tournament={viewing} league={league} players={players}
      isAdmin={isAdmin} isSubAdmin={isSubAdmin} loadTournaments={loadTournaments}
      onBack={() => setViewId(null)} onDelete={() => handleDelete(viewing.id)} />
  )

  return (
    <div style={{ padding: '0 16px' }}>
      {canEdit && (
        <button className="btn btn-primary mt8" style={{ width: '100%' }} onClick={() => setCreating(true)}>
          🏆 {t.createTournament}
        </button>
      )}
      {myTournaments.length === 0 && <div className="empty mt8">{t.noTournament}</div>}
      {myTournaments.map(tr => {
        const bracket = tr.bracket || {}
        const isFinished = bracket.status === 'finished'
        const winnerTeam = bracket.winner ? (league.teams || []).find(tm => tm.id === bracket.winner) : null
        const typeLabel = bracket.type === 'elimination'
          ? (lang === 'fr' ? '🎯 Élimination' : lang === 'he' ? '🎯 נוקאאוט' : '🎯 Elimination')
          : (lang === 'fr' ? '🔄 Round Robin' : lang === 'he' ? '🔄 ליגה' : '🔄 Round Robin')
        return (
          <div key={tr.id} className="card mt8" onClick={() => setViewId(tr.id)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{tr.name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{typeLabel} · {(bracket.teams || []).length} {t.teams.toLowerCase()}</div>
                {isFinished && winnerTeam && (
                  <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700, marginTop: 6 }}>🏆 {winnerTeam.name}</div>
                )}
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, flexShrink: 0,
                background: isFinished ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                color: isFinished ? '#10b981' : '#f59e0b',
                border: `1px solid ${isFinished ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                {isFinished ? (lang === 'fr' ? '✓ Terminé' : lang === 'he' ? '✓ הסתיים' : '✓ Done') : (lang === 'fr' ? '▶ En cours' : lang === 'he' ? '▶ פעיל' : '▶ Active')}
              </span>
            </div>
          </div>
        )
      })}
      {creating && (
        <CreateTournamentModal t={t} lang={lang} league={league} players={players}
          onClose={() => setCreating(false)} loadTournaments={loadTournaments} />
      )}
    </div>
  )
}

function CreateTournamentModal({ t, lang, league, players, onClose, loadTournaments }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('elimination')
  const [selectedTeams, setSelectedTeams] = useState([])
  const [hasThirdPlace, setHasThirdPlace] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)
  const showToast = useToast()
  const allTeams = league.teams || []

  function toggleTeam(teamId) {
    setSelectedTeams(prev => prev.includes(teamId) ? prev.filter(x => x !== teamId) : [...prev, teamId])
  }

  async function handleCreate() {
    if (!name.trim()) { setErr(lang === 'fr' ? 'Entrez un nom.' : lang === 'he' ? 'הכנס שם.' : 'Enter a name.'); return }
    if (selectedTeams.length < 2) { setErr(lang === 'fr' ? 'Sélectionnez au moins 2 équipes.' : lang === 'he' ? 'בחר לפחות 2 קבוצות.' : 'Select at least 2 teams.'); return }
    setSaving(true); setErr(null)
    const bracket = type === 'elimination' ? generateElimBracket(selectedTeams, hasThirdPlace) : generateRRBracket(selectedTeams)
    const { error } = await supabase.from('tournaments').insert({ league_id: league.id, name: name.trim(), type, bracket })
    setSaving(false)
    if (error) { setErr(error.message); return }
    await loadTournaments([league.id])
    showToast(lang === 'fr' ? '🏆 Tournoi créé !' : lang === 'he' ? '🏆 טורניר נוצר!' : '🏆 Tournament created!', 'ok')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">🏆 {t.createTournament}</div>

        <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{t.tournamentName}</div>
        <input className="input mb12" value={name} onChange={e => setName(e.target.value)} placeholder={lang === 'fr' ? 'Coupe de Tel Aviv' : lang === 'he' ? 'גביע תל אביב' : 'Tel Aviv Cup'} maxLength={60} />

        <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t.tournamentType}</div>
        <div className="row gap8 mb12">
          {['elimination', 'roundrobin'].map(tp => (
            <button key={tp} onClick={() => setType(tp)} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, border: `1px solid ${type === tp ? '#a855f7' : 'rgba(255,255,255,0.1)'}`, background: type === tp ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)', color: type === tp ? '#c4b5fd' : '#9ca3af', fontSize: 12, fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
              {tp === 'elimination' ? '🎯 ' + t.elimination : '🔄 ' + t.roundRobin}
            </button>
          ))}
        </div>

        {type === 'elimination' && (
          <div className="row mb12" style={{ cursor: 'pointer' }} onClick={() => setHasThirdPlace(!hasThirdPlace)}>
            <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${hasThirdPlace ? '#a855f7' : '#4b5563'}`, background: hasThirdPlace ? '#a855f7' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {hasThirdPlace && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ fontSize: 13, color: '#e2e8f0', marginLeft: 8 }}>🥉 {t.thirdPlace}</span>
          </div>
        )}

        <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          {t.selectTournamentTeams} ({selectedTeams.length}/{allTeams.length})
        </div>
        {allTeams.length === 0 ? (
          <div style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', padding: '12px 0', marginBottom: 12 }}>
            {lang === 'fr' ? 'Créez d\'abord des équipes dans l\'onglet Équipes.' : lang === 'he' ? 'צור תחילה קבוצות בלשונית קבוצות.' : 'Create teams first in the Teams tab.'}
          </div>
        ) : (
          <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {allTeams.map(tm => {
              const p1 = players.find(p => p.id === tm.player1_id)
              const p2 = players.find(p => p.id === tm.player2_id)
              const selected = selectedTeams.includes(tm.id)
              return (
                <button key={tm.id} onClick={() => toggleTeam(tm.id)} style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${selected ? '#a855f7' : 'rgba(255,255,255,0.15)'}`, background: selected ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)', color: selected ? '#c4b5fd' : '#9ca3af', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  {selected && '✓ '}{tm.name}
                  {p1 && p2 && <span style={{ fontSize: 10, opacity: 0.6 }}> ({((p1.level + p2.level) / 2).toFixed(1)})</span>}
                </button>
              )
            })}
          </div>
        )}

        {err && <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 10, textAlign: 'center' }}>{err}</div>}
        <div className="row gap8">
          <button className="btn btn-outline flex1" onClick={onClose}>{t.cancelBtn}</button>
          <button className="btn btn-primary flex1" disabled={saving || !name.trim() || selectedTeams.length < 2} onClick={handleCreate}>
            {saving ? <Spin /> : t.startTournament}
          </button>
        </div>
      </div>
    </div>
  )
}

function TournamentView({ t, lang, tournament, league, players, isAdmin, isSubAdmin, loadTournaments, onBack, onDelete }) {
  const bracket = tournament.bracket || {}
  const canEdit = isAdmin || isSubAdmin
  const isFinished = bracket.status === 'finished'
  function getTeamName(id) { return (league.teams || []).find(tm => tm.id === id)?.name || '?' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 4px' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>← {t.tournamentTab}</button>
        {canEdit && <button className="btn btn-danger btn-sm" onClick={onDelete}>🗑 {t.deleteTournament}</button>}
      </div>
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{tournament.name}</div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>
          {bracket.type === 'elimination'
            ? (lang === 'fr' ? '🎯 Élimination directe' : lang === 'he' ? '🎯 נוקאאוט' : '🎯 Single Elimination')
            : (lang === 'fr' ? '🔄 Round Robin' : lang === 'he' ? '🔄 ליגה' : '🔄 Round Robin')}
          {' · '}{(bracket.teams || []).length} {t.teams.toLowerCase()}
        </div>
      </div>

      {isFinished && (
        <Podium t={t} lang={lang}
          winner={bracket.winner ? getTeamName(bracket.winner) : null}
          second={bracket.second ? getTeamName(bracket.second) : null}
          third={bracket.third ? getTeamName(bracket.third) : null}
        />
      )}

      {bracket.type === 'elimination' && (
        <BracketView t={t} lang={lang} tournament={tournament} league={league} players={players} canEdit={canEdit} loadTournaments={loadTournaments} />
      )}
      {bracket.type === 'roundrobin' && (
        <RoundRobinView t={t} lang={lang} tournament={tournament} league={league} players={players} canEdit={canEdit} loadTournaments={loadTournaments} />
      )}
    </div>
  )
}

function Podium({ t, lang, winner, second, third }) {
  if (!winner) return null
  return (
    <div style={{ margin: '0 16px 20px', background: 'linear-gradient(135deg,rgba(245,158,11,0.07),rgba(139,92,246,0.07))', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 18, padding: '18px 14px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>🏆 {t.tournamentWinner}</div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 10 }}>
        {second && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 26 }}>🥈</span>
            <div style={{ background: 'rgba(156,163,175,0.12)', border: '1px solid rgba(156,163,175,0.25)', borderRadius: 10, padding: '20px 6px 8px', width: '100%', minHeight: 72, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textAlign: 'center', lineHeight: 1.3 }}>{second}</span>
            </div>
          </div>
        )}
        <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 36 }}>🥇</span>
          <div style={{ background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.4)', borderRadius: 10, padding: '32px 8px 10px', width: '100%', minHeight: 96, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', textAlign: 'center', lineHeight: 1.3 }}>{winner}</span>
          </div>
        </div>
        {third && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 22 }}>🥉</span>
            <div style={{ background: 'rgba(146,64,14,0.1)', border: '1px solid rgba(146,64,14,0.25)', borderRadius: 10, padding: '12px 6px 8px', width: '100%', minHeight: 52, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e', textAlign: 'center', lineHeight: 1.3 }}>{third}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BracketMatch({ t, lang, match, getTeamName, canEdit, onEnterScore }) {
  const t1Name = getTeamName(match.t1)
  const t2Name = getTeamName(match.t2)
  const isW1 = match.winner && match.winner === match.t1
  const isW2 = match.winner && match.winner === match.t2

  if (match.bye) {
    return (
      <div style={{ padding: '8px 12px', marginBottom: 6, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)', borderRadius: 10 }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{getTeamName(match.winner)}</span>
        <span style={{ fontSize: 10, color: '#4b5563', marginLeft: 6 }}>— {t.bye} ✓</span>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
      {[{ name: t1Name, isWin: isW1, teamId: match.t1 }, { name: t2Name, isWin: isW2, teamId: match.t2 }].map((side, idx) => (
        <div key={idx} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: idx === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: side.isWin ? 'rgba(16,185,129,0.07)' : 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 20, textAlign: 'center' }}>{side.isWin ? '🏆' : ''}</span>
            <span style={{ fontSize: 13, fontWeight: side.isWin ? 700 : 500, color: side.isWin ? '#10b981' : side.teamId ? '#e2e8f0' : '#4b5563' }}>
              {side.name}
            </span>
          </div>
          {(match.sets || []).length > 0 && (
            <div style={{ display: 'flex', gap: 4 }}>
              {match.sets.map((s, si) => {
                const myS = idx === 0 ? s.a : s.b, opS = idx === 0 ? s.b : s.a
                return <span key={si} style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 16, color: parseInt(myS) > parseInt(opS) ? '#06b6d4' : '#6b7280', minWidth: 30, textAlign: 'center' }}>{myS}-{opS}</span>
              })}
            </div>
          )}
        </div>
      ))}
      {canEdit && (
        <button onClick={onEnterScore} style={{ width: '100%', padding: '8px', background: 'rgba(139,92,246,0.08)', border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#a855f7', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          ✏️ {t.enterScore}
        </button>
      )}
    </div>
  )
}

function BracketView({ t, lang, tournament, league, players, canEdit, loadTournaments }) {
  const [scoreModal, setScoreModal] = useState(null)
  const bracket = tournament.bracket || {}
  const rounds = bracket.rounds || []
  const showToast = useToast()

  function getTeamName(id) {
    if (!id) return lang === 'fr' ? 'À déterminer' : lang === 'he' ? 'לא נקבע' : 'TBD'
    return (league.teams || []).find(tm => tm.id === id)?.name || '?'
  }

  function getRoundLabel(r, totalRounds) {
    const rIdx = rounds.findIndex(rd => rd.round === r.round)
    if (rIdx === totalRounds - 1) return '🏆 ' + t.final
    if (rIdx === totalRounds - 2 && totalRounds > 2) return t.semifinal
    return t.round + ' ' + r.round
  }

  async function handleSaveScore(roundIdx, matchIdx, sets) {
    const nb = JSON.parse(JSON.stringify(bracket))
    const match = nb.rounds[roundIdx].matches[matchIdx]
    match.sets = sets
    let w1 = 0, w2 = 0
    sets.forEach(s => { if (parseInt(s.a) > parseInt(s.b)) w1++; else if (parseInt(s.b) > parseInt(s.a)) w2++ })
    match.winner = w1 >= w2 ? match.t1 : match.t2
    const isLastRound = roundIdx === nb.rounds.length - 1
    if (isLastRound) {
      nb.winner = match.winner
      nb.second = match.t1 === match.winner ? match.t2 : match.t1
      if (nb.hasThirdPlace && nb.thirdPlaceMatch && roundIdx > 0) {
        const sfRound = nb.rounds[roundIdx - 1]
        const losers = (sfRound?.matches || []).map(m => m.winner === m.t1 ? m.t2 : m.t1).filter(Boolean)
        if (losers[0]) nb.thirdPlaceMatch.t1 = losers[0]
        if (losers[1]) nb.thirdPlaceMatch.t2 = losers[1]
      }
      if (!nb.hasThirdPlace) nb.status = 'finished'
    } else {
      const nextRound = nb.rounds[roundIdx + 1]
      if (nextRound) {
        const nm = Math.floor(matchIdx / 2)
        const slot = matchIdx % 2 === 0 ? 't1' : 't2'
        if (nextRound.matches[nm]) nextRound.matches[nm][slot] = match.winner
      }
    }
    const { error } = await supabase.from('tournaments').update({ bracket: nb }).eq('id', tournament.id)
    if (error) { showToast(t.errorGeneric, 'err'); return }
    await loadTournaments([league.id])
    setScoreModal(null)
    showToast(t.saved, 'ok')
  }

  async function handleThirdPlaceScore(sets) {
    const nb = JSON.parse(JSON.stringify(bracket))
    const match = nb.thirdPlaceMatch
    match.sets = sets
    let w1 = 0, w2 = 0
    sets.forEach(s => { if (parseInt(s.a) > parseInt(s.b)) w1++; else if (parseInt(s.b) > parseInt(s.a)) w2++ })
    match.winner = w1 >= w2 ? match.t1 : match.t2
    nb.third = match.winner
    nb.status = 'finished'
    const { error } = await supabase.from('tournaments').update({ bracket: nb }).eq('id', tournament.id)
    if (error) { showToast(t.errorGeneric, 'err'); return }
    await loadTournaments([league.id])
    setScoreModal(null)
    showToast(t.saved, 'ok')
  }

  return (
    <div style={{ padding: '0 16px' }}>
      {rounds.map((r, rIdx) => {
        const label = getRoundLabel(r, rounds.length)
        const isF = rIdx === rounds.length - 1
        return (
          <div key={r.round} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, color: isF ? '#f59e0b' : '#a855f7' }}>
              {label}
            </div>
            {r.matches.map((m, mIdx) => {
              const matchCanEdit = canEdit && !m.bye && m.t1 && m.t2 && !m.winner
              return (
                <BracketMatch key={m.id} t={t} lang={lang} match={m} getTeamName={getTeamName}
                  canEdit={matchCanEdit}
                  onEnterScore={() => setScoreModal({ roundIdx: rIdx, matchIdx: mIdx, match: m, isThirdPlace: false })} />
              )
            })}
          </div>
        )
      })}

      {bracket.hasThirdPlace && bracket.thirdPlaceMatch && (bracket.thirdPlaceMatch.t1 || bracket.thirdPlaceMatch.t2) && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            🥉 {t.thirdPlaceMatch}
          </div>
          <BracketMatch t={t} lang={lang} match={bracket.thirdPlaceMatch} getTeamName={getTeamName}
            canEdit={canEdit && bracket.thirdPlaceMatch.t1 && bracket.thirdPlaceMatch.t2 && !bracket.thirdPlaceMatch.winner}
            onEnterScore={() => setScoreModal({ roundIdx: -1, matchIdx: -1, match: bracket.thirdPlaceMatch, isThirdPlace: true })} />
        </div>
      )}

      {scoreModal && (
        <TournamentScoreModal t={t} lang={lang}
          team1Name={getTeamName(scoreModal.match.t1)}
          team2Name={getTeamName(scoreModal.match.t2)}
          existingSets={scoreModal.match.sets || []}
          onClose={() => setScoreModal(null)}
          onSave={sets => scoreModal.isThirdPlace ? handleThirdPlaceScore(sets) : handleSaveScore(scoreModal.roundIdx, scoreModal.matchIdx, sets)}
        />
      )}
    </div>
  )
}

function RoundRobinView({ t, lang, tournament, league, players, canEdit, loadTournaments }) {
  const [scoreModal, setScoreModal] = useState(null)
  const bracket = tournament.bracket || {}
  const standings = computeRRStandings(bracket)
  const showToast = useToast()

  function getTeamName(id) {
    if (!id) return '?'
    return (league.teams || []).find(tm => tm.id === id)?.name || '?'
  }

  async function handleSave(matchId, sets) {
    const nb = JSON.parse(JSON.stringify(bracket))
    const match = nb.matches.find(m => m.id === matchId)
    if (!match) return
    match.sets = sets
    let w1 = 0, w2 = 0
    sets.forEach(s => { if (parseInt(s.a) > parseInt(s.b)) w1++; else if (parseInt(s.b) > parseInt(s.a)) w2++ })
    match.winner = w1 >= w2 ? match.t1 : match.t2
    match.played = true
    if (nb.matches.every(m => m.played)) {
      nb.status = 'finished'
      const st = computeRRStandings(nb)
      nb.winner = st[0]?.teamId || null
    }
    const { error } = await supabase.from('tournaments').update({ bracket: nb }).eq('id', tournament.id)
    if (error) { showToast(t.errorGeneric, 'err'); return }
    await loadTournaments([league.id])
    setScoreModal(null)
    showToast(t.saved, 'ok')
  }

  const playedCount = (bracket.matches || []).filter(m => m.played).length
  const totalCount = (bracket.matches || []).length

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t.standingsRR}</div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 36px 36px 36px 44px', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 10, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
          <span>{t.teams}</span>
          <span style={{ textAlign: 'center' }}>{t.played}</span>
          <span style={{ textAlign: 'center' }}>{t.wins}</span>
          <span style={{ textAlign: 'center' }}>{t.losses}</span>
          <span style={{ textAlign: 'center' }}>{t.pts}</span>
        </div>
        {standings.map((row, idx) => (
          <div key={row.teamId} style={{ display: 'grid', gridTemplateColumns: '1fr 36px 36px 36px 44px', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx === 0 ? 'rgba(245,158,11,0.05)' : 'transparent' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: idx === 0 ? '#f59e0b' : '#e2e8f0' }}>
              {idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : ''}{getTeamName(row.teamId)}
            </span>
            <span style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>{row.W + row.L}</span>
            <span style={{ textAlign: 'center', fontSize: 13, color: '#10b981' }}>{row.W}</span>
            <span style={{ textAlign: 'center', fontSize: 13, color: '#ef4444' }}>{row.L}</span>
            <span style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#a855f7' }}>{row.P}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>{t.matches}</div>
        <div style={{ fontSize: 11, color: '#6b7280' }}>{playedCount}/{totalCount}</div>
      </div>
      {(bracket.matches || []).map(m => {
        const t1n = getTeamName(m.t1), t2n = getTeamName(m.t2)
        const hasScore = m.played && (m.sets || []).length > 0
        const canClick = canEdit && !m.played
        return (
          <div key={m.id} style={{ marginBottom: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${m.played ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: m.winner === m.t1 ? 700 : 500, color: m.winner === m.t1 ? '#10b981' : '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t1n}</span>
                <span style={{ fontSize: 11, color: '#4b5563', fontWeight: 700, flexShrink: 0 }}>vs</span>
                <span style={{ fontSize: 13, fontWeight: m.winner === m.t2 ? 700 : 500, color: m.winner === m.t2 ? '#10b981' : '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t2n}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                {hasScore && (
                  <div style={{ display: 'flex', gap: 3 }}>
                    {m.sets.map((s, si) => <span key={si} style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 15, color: '#9ca3af' }}>{s.a}-{s.b}</span>)}
                  </div>
                )}
                {canClick && (
                  <button onClick={() => setScoreModal({ matchId: m.id, match: m })} style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a855f7', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                    ✏️
                  </button>
                )}
                {m.played && <span style={{ fontSize: 14, color: '#10b981' }}>✓</span>}
              </div>
            </div>
          </div>
        )
      })}

      {scoreModal && (
        <TournamentScoreModal t={t} lang={lang}
          team1Name={getTeamName(scoreModal.match.t1)}
          team2Name={getTeamName(scoreModal.match.t2)}
          existingSets={scoreModal.match.sets || []}
          onClose={() => setScoreModal(null)}
          onSave={sets => handleSave(scoreModal.matchId, sets)}
        />
      )}
    </div>
  )
}

function TournamentScoreModal({ t, lang, team1Name, team2Name, existingSets, onClose, onSave }) {
  const [sets, setSets] = useState(existingSets && existingSets.length > 0 ? existingSets.map(s => ({ a: String(s.a), b: String(s.b) })) : [{ a: '', b: '' }])
  const [saving, setSaving] = useState(false)
  const ps = sets.map(s => ({ a: parseInt(s.a) || 0, b: parseInt(s.b) || 0 })).filter(s => s.a > 0 || s.b > 0)

  async function handleSave() {
    if (!ps.length) return
    setSaving(true)
    await onSave(ps)
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>✏️ {t.enterScore}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#06b6d4' }}>{team1Name}</span>
            <span style={{ fontSize: 12, color: '#4b5563', fontWeight: 700 }}>vs</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#a855f7' }}>{team2Name}</span>
          </div>
        </div>
        <SetsInput sets={sets} onChange={setSets} t={t} />
        {ps.length > 0 && <SetsPreview sets={ps} t1name={team1Name} t2name={team2Name} />}
        <div className="row gap8 mt12">
          <button className="btn btn-outline flex1" onClick={onClose}>{t.cancelBtn}</button>
          <button className="btn btn-primary flex1" disabled={saving || !ps.length} onClick={handleSave}>
            {saving ? <Spin /> : t.saveBtn}
          </button>
        </div>
      </div>
    </div>
  )
}

function LeagueMembersTab({ t, lang, league, players, isAdmin, expelMember, toggleSubAdmin, me }) {
  const [expellingId, setExpellingId] = useState(null)
  const [subAdminBusy, setSubAdminBusy] = useState(null)
  const showToast = useToast()
  const confirm = useConfirm()

  async function handleExpel(playerId, playerName) {
    const ok = await confirm(t.confirmExpel + ' (' + playerName + ')')
    if (!ok) return
    setExpellingId(playerId)
    try { await expelMember(league.id, playerId); showToast(lang === 'fr' ? 'Joueur expulsé' : lang === 'he' ? 'שחקן הוצא' : 'Player expelled', 'ok') }
    catch { showToast(t.errorGeneric, 'err') }
    setExpellingId(null)
  }

  async function handleToggleSub(playerId) {
    setSubAdminBusy(playerId)
    try { await toggleSubAdmin(league.id, playerId) }
    catch { showToast(t.errorGeneric, 'err') }
    setSubAdminBusy(null)
  }

  return (
    <div style={{ padding: '0 16px' }}>
      {(league.league_members || []).map(lm => {
        const p = players.find(x => x.id === lm.player_id)
        if (!p) return null
        const isAdm = lm.role === 'admin'
        const isSub = lm.role === 'sub_admin'
        const busyExp = expellingId === lm.player_id
        const busySub = subAdminBusy === lm.player_id
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
                    disabled={busySub} onClick={() => handleToggleSub(lm.player_id)}>
                    {busySub ? <Spin /> : '⭐'} {isSub ? t.removeSubAdmin : t.addSubAdmin}
                  </button>
                  <button className="btn btn-danger btn-sm" disabled={busyExp}
                    onClick={() => handleExpel(lm.player_id, p.name)}>
                    {busyExp ? <Spin /> : t.expel}
                  </button>
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
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    loadMessages()
    const channel = supabase.channel('chat:' + league.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'league_id=eq.' + league.id }, payload => {
        setMessages(prev => [...prev, payload.new])
      }).subscribe()
    return () => supabase.removeChannel(channel)
  }, [league.id])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  async function loadMessages() {
    const { data } = await supabase.from('chat_messages').select('*').eq('league_id', league.id).order('created_at', { ascending: true }).limit(100)
    if (data) setMessages(data)
    setLoading(false)
  }

  async function handleSend() {
    const clean = msg.trim().slice(0, 500)
    if (!clean || sending) return
    setSending(true)
    await sendChatMsg(league.id, clean)
    setMsg('')
    setSending(false)
  }

  return (
    <div>
      <div style={{ padding: '10px 16px', minHeight: 200, maxHeight: 380, overflowY: 'auto' }}>
        {loading && <div className="loading-screen">{t.loading}</div>}
        {messages.map(c => {
          const isMe = c.player_id === me.id
          const sender = players.find(p => p.id === c.player_id)
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
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()} />
        <button className="btn btn-primary btn-sm" disabled={sending || !msg.trim()} onClick={handleSend}>
          {sending ? <Spin /> : t.send}
        </button>
      </div>
    </div>
  )
}

// ══ RANKING ══
function RankingTab({ t, lang, players, follows, ratings, rankTab, setRankTab, setViewPlayerId, setTab, me }) {
  const sorted = [...players].sort((a, b) => b.points - a.points)
  const followedIds = follows.filter(f => f.follower_id === me.id).map(f => f.following_id)
  const followedSorted = [...players].filter(p => followedIds.includes(p.id)).sort((a, b) => b.points - a.points)

  function formColor(h) {
    if (!h?.length) return '#6b7280'
    const last = h.slice(-5)
    const wr = last.filter(x => x === 1).length / last.length
    return wr >= 0.6 ? '#10b981' : wr >= 0.4 ? '#f59e0b' : '#ef4444'
  }

  function renderRow(p, rank, isMe = false) {
    const info = getLevelInfo(p.level)
    const lbl = lang === 'en' ? info.labelEn : lang === 'he' ? info.labelHe : info.label
    const nc = 'rank-num' + (rank === 0 ? ' top1' : rank === 1 ? ' top2' : rank === 2 ? ' top3' : '')
    const pRatings = ratings.filter(r => r.rated_id === p.id)
    const badges = computeBadges(p, pRatings)
    const wp = p.matches > 0 ? Math.round(p.wins / p.matches * 100) : 0
    return (
      <div key={p.id} className="rank-row" onClick={() => { setViewPlayerId(p.id); setTab('players') }}
        style={isMe ? { background: 'rgba(168,85,247,0.10)', borderRadius: 10 } : {}}>
        <div className={nc}>{rank + 1}</div>
        <Av size={34} photo={p.photo_url} name={p.name} />
        <div className="col flex1">
          <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}{isMe ? ' 👤' : ''}{badges.length ? ' ' + badges.slice(0, 2).join('') : ''}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <span style={{ fontSize: 10, color: info.color }}>{lbl}</span>
            <span className="text-xs">{p.city}</span>
            <span className="text-xs">{wp}%V</span>
          </div>
        </div>
        <span style={{ fontSize: 18, color: formColor(p.win_history) }}>●</span>
        <div style={{ textAlign: 'right', fontFamily: "'Bebas Neue',cursive", fontSize: 20, color: '#a855f7', minWidth: 50 }}>{p.points}</div>
      </div>
    )
  }

  const myRank = sorted.findIndex(p => p.id === me.id)
  const windowStart = myRank < 15 ? 0 : Math.max(0, Math.min(myRank - 7, sorted.length - 15))
  const visible = sorted.slice(windowStart, windowStart + 15)

  return (
    <div>
      <div className="section-title">{t.ranking}</div>
      <div className="tab-bar">
        <button className={'tab-pill ' + (rankTab === 'world' ? 'active' : '')} onClick={() => setRankTab('world')}>{t.worldRank}</button>
        <button className={'tab-pill ' + (rankTab === 'league' ? 'active' : '')} onClick={() => setRankTab('league')}>
          {lang === 'fr' ? '👥 Suivis' : lang === 'he' ? '👥 עוקבים' : '👥 Followed'}
        </button>
      </div>
      {rankTab === 'world' && (
        <div>
          {windowStart > 0 && (
            <div style={{ textAlign: 'center', fontSize: 11, color: '#4b5563', padding: '4px 0 2px', letterSpacing: 2 }}>···</div>
          )}
          {visible.map((p, i) => renderRow(p, windowStart + i, p.id === me.id))}
          <div className="card mt8">
            <div className="fw600 mb8" style={{ fontSize: 12 }}>{lang === 'fr' ? 'Système de points :' : lang === 'he' ? 'מערכת נקודות:' : 'Point system:'}</div>
            <div className="text-xs" style={{ lineHeight: 2 }}>
              🏆 {lang === 'fr' ? 'Victoire' : lang === 'he' ? 'ניצחון' : 'Win'} = +10pts{'\n'}
              ⭐ {lang === 'fr' ? 'Set blanc' : lang === 'he' ? 'ניצחון נקי' : 'Clean sweep'} = +12pts{'\n'}
              ❌ {lang === 'fr' ? 'Défaite' : lang === 'he' ? 'הפסד' : 'Loss'} = +3pts
            </div>
          </div>
        </div>
      )}
      {rankTab === 'league' && (
        <div>
          {followedSorted.length === 0
            ? <div className="empty">{lang === 'fr' ? 'Tu ne suis aucun joueur.' : lang === 'he' ? 'אינך עוקב אחרי אף שחקן.' : 'You follow no players.'}</div>
            : followedSorted.map((p, idx) => renderRow(p, idx))
          }
        </div>
      )}
    </div>
  )
}

// ══ PROFILE ══
function ProfileTab({ t, lang, me, players, myRatings, myBadges, myMatches, leagues, leagueMatches, updateProfile, uploadPhoto, onSignOut }) {
  const [editing, setEditing] = useState(false)
  const [eName, setEName] = useState(me.name)
  const [eCity, setECity] = useState(me.city)
  const [eLevel, setELevel] = useState(me.level)
  const [showLv, setShowLv] = useState(false)
  const [showBd, setShowBd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
  const showToast = useToast()
  const confirm = useConfirm()
  const info = getLevelInfo(me.level)
  const lbl = lang === 'en' ? info.labelEn : lang === 'he' ? info.labelHe : info.label
  const rl = RATING_LABELS[lang] || RATING_LABELS.en

  const n = Math.min(myMatches.length, 10)
  const SVG_W = 300, SVG_H = 80
  let cumPts = 0
  const ptsSeries = []
  for (let i = 0; i < n; i++) {
    cumPts += me.points / Math.max(me.matches, 1)
    ptsSeries.push(Math.round(cumPts))
  }
  const maxP = Math.max(...ptsSeries, 1)
  const sx = i2 => n <= 1 ? SVG_W / 2 : 20 + i2 * (SVG_W - 40) / (n - 1)
  const sy = v => SVG_H - 8 - (v / maxP) * (SVG_H - 16)
  const pPath = n > 0 ? ptsSeries.map((v, i2) => (i2 === 0 ? 'M' : 'L') + sx(i2) + ',' + sy(v)).join(' ') : ''

  async function save() {
    if (!eName.trim() || eName.trim().length < 2) { showToast(t.nameRequired, 'err'); return }
    if (!eCity.trim()) { showToast(t.cityRequired, 'err'); return }
    setSaving(true)
    try {
      await updateProfile({ name: eName.trim().slice(0, 50), city: eCity.trim().slice(0, 50), level: eLevel })
      showToast(t.profileUpdated, 'ok')
      setEditing(false)
    } catch { showToast(t.errorGeneric, 'err') }
    setSaving(false)
  }

  async function handleUpload(file) {
    setUploading(true)
    try { await uploadPhoto(file); showToast(lang === 'fr' ? '✓ Photo mise à jour !' : '✓ Photo updated!', 'ok') }
    catch { showToast(t.errorGeneric, 'err') }
    setUploading(false)
  }

  async function handleSignOut() {
    const ok = await confirm(t.confirmSignOut)
    if (ok) onSignOut()
  }

  return (
    <div>
      <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="section-title" style={{ padding: 0 }}>{t.profile}</div>
        <button className="btn btn-danger btn-sm" onClick={handleSignOut}>{t.signOut}</button>
      </div>

      <div className="card mt8">
        <div className="row mb12">
          <div style={{ position: 'relative', cursor: uploading ? 'wait' : 'pointer' }} onClick={() => !uploading && fileRef.current?.click()}>
            <Av size={64} photo={me.photo_url} name={me.name} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: uploading ? '#374151' : '#7c3aed', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
              {uploading ? <Spin /> : '📷'}
            </div>
            <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={e => { const f = e.target.files[0]; if (f) handleUpload(f) }} />
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
                {LEVELS.map(lv => <option key={lv.val} value={lv.val}>{lv.val} — {lang === 'en' ? lv.labelEn : lang === 'he' ? lv.labelHe : lv.label}</option>)}
              </select>
            </div>
          )}
        </div>
        {editing ? (
          <div className="row gap8">
            <button className="btn btn-outline flex1" onClick={() => setEditing(false)}>{t.cancelBtn}</button>
            <button className="btn btn-primary flex1" disabled={saving} onClick={save}>
              {saving ? <Spin /> : null} {t.saveBtn}
            </button>
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
            <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0" /></linearGradient></defs>
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
          const avg = computeRatingAvg(myRatings, key === 'level' ? 'level_rating' : key)
          return (
            <div key={key} className="row mb8" style={{ justifyContent: 'space-between' }}>
              <span className="text-sm">{rl[key]}</span>
              <Stars val={avg} readOnly />
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
            const ll = lang === 'en' ? lv.labelEn : lv.label
            const ld = lang === 'en' ? lv.descEn : lv.desc
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
            const has = myBadges.includes(item.b)
            const bl = lang === 'en' ? item.en : lang === 'he' ? item.he : item.fr
            const bd = lang === 'en' ? item.dEn : lang === 'he' ? item.dHe : item.dFr
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
      <div style={{ height: 16 }} />
    </div>
  )
}
