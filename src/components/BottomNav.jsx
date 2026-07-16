const TABS = [
  { key: 'home', label: 'Accueil', icon: IconHome },
  { key: 'matches', label: 'Matchs', icon: IconPitch },
  { key: 'leagues', label: 'Ligues', icon: IconTrophy },
  { key: 'players', label: 'Joueurs', icon: IconPlayers },
  { key: 'profile', label: 'Profil', icon: IconUser },
]

export default function BottomNav({ tab, setTab }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-grass-deep/95 backdrop-blur-lg border-t border-grass-light/20 flex z-[100] pb-[env(safe-area-inset-bottom)]">
      {TABS.map((t) => {
        const active = tab === t.key
        const Icon = t.icon
        return (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 flex flex-col items-center gap-1 pt-2.5 pb-2 transition"
            aria-current={active ? 'page' : undefined}
          >
            <Icon active={active} />
            <span
              className={
                'text-[9px] font-semibold uppercase tracking-wide ' +
                (active ? 'text-floodlight' : 'text-chalk/40')
              }
            >
              {t.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

function base(active) {
  return { width: 22, height: 22, fill: 'none', stroke: active ? '#FFC542' : '#7a9488', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
}
function IconHome({ active }) {
  return (
    <svg viewBox="0 0 24 24" {...base(active)}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}
function IconPitch({ active }) {
  return (
    <svg viewBox="0 0 24 24" {...base(active)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
function IconTrophy({ active }) {
  return (
    <svg viewBox="0 0 24 24" {...base(active)}>
      <path d="M6 4h12v4a6 6 0 0 1-12 0V4z" />
      <path d="M6 6H3v2a3 3 0 0 0 3 3M18 6h3v2a3 3 0 0 1-3 3" />
      <path d="M9 20h6M12 14v6" />
    </svg>
  )
}
function IconPlayers({ active }) {
  return (
    <svg viewBox="0 0 24 24" {...base(active)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
      <path d="M16 6a3 3 0 0 1 0 6M18 20c0-2-1-3.5-2.5-4.5" />
    </svg>
  )
}
function IconUser({ active }) {
  return (
    <svg viewBox="0 0 24 24" {...base(active)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  )
}
