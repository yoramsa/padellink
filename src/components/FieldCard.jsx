import { useMemo } from 'react'
import { assignPlayersToSlots } from '../lib/formations'
import { POSITION_COLOR, POSITION_SHORT } from '../lib/constants'
import { initials } from '../lib/helpers'

// Élément signature — le match vu comme un mini-terrain du dessus.
// props: format, players[], onSlotTap(slot), meId, interactive
export default function FieldCard({ format, players = [], onSlotTap, meId, interactive = true, animate = true }) {
  const W = 100
  const H = 150
  const px = (x) => 12 + x * 76 // marge gauche/droite
  const py = (y) => 10 + y * 130 // marge haut/bas

  const { slots, assigned } = useMemo(() => assignPlayersToSlots(format, players), [format, players])
  // Trace des lignes : keyframes scopées (fiables quel que soit le build) + pathLength normalisé
  const lineProps = animate
    ? { pathLength: 100, style: { strokeDasharray: 100, animation: 'sl-draw 0.7s ease forwards' } }
    : {}

  return (
    <div className="relative w-full mow-stripes rounded-pitch overflow-hidden" style={{ background: '#0F5136' }}>
      <style>{`@keyframes sl-draw{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}@keyframes sl-pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}`}</style>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" role="img" aria-label={`Terrain ${format}`}>
        {/* Lignes à la craie */}
        <g fill="none" stroke="#F4F7F0" strokeWidth="0.7" opacity="0.9">
          <rect {...lineProps} x="6" y="6" width="88" height="138" rx="2" />
          <line {...lineProps} x1="6" y1="75" x2="94" y2="75" />
          <circle {...lineProps} cx="50" cy="75" r="12" />
          <circle cx="50" cy="75" r="0.9" fill="#F4F7F0" stroke="none" />
          {/* Surfaces de réparation */}
          <rect {...lineProps} x="28" y="6" width="44" height="20" />
          <rect {...lineProps} x="38" y="6" width="24" height="9" />
          <rect {...lineProps} x="28" y="124" width="44" height="20" />
          <rect {...lineProps} x="38" y="129" width="24" height="9" />
        </g>

        {/* Pastilles */}
        {slots.map((slot, i) => {
          const p = assigned[slot.id]
          const cx = px(slot.x)
          const cy = py(slot.y)
          if (p) return <FilledJersey key={slot.id} cx={cx} cy={cy} player={p} isMe={p.id === meId} delay={animate ? i * 45 : 0} />
          return (
            <FreeSlot
              key={slot.id}
              cx={cx}
              cy={cy}
              role={slot.role}
              interactive={interactive}
              onTap={() => interactive && onSlotTap && onSlotTap(slot)}
            />
          )
        })}
      </svg>
    </div>
  )
}

function FilledJersey({ cx, cy, player, isMe, delay }) {
  const color = POSITION_COLOR[player.position] || '#1B7A4F'
  return (
    <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: `sl-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both` }}>
      <circle cx={cx} cy={cy} r="5.4" fill={color} stroke={isMe ? '#FFC542' : 'rgba(0,0,0,0.35)'} strokeWidth={isMe ? 1.4 : 0.8} />
      <text x={cx} y={cy + 1.6} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="4" fill="#fff">
        {initials(player.full_name)}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="3" fill="#F4F7F0" opacity="0.85">
        {(player.full_name || '').split(' ')[0]}
      </text>
    </g>
  )
}

function FreeSlot({ cx, cy, role, onTap, interactive }) {
  return (
    <g
      onClick={onTap}
      className={interactive ? 'cursor-pointer' : ''}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? `Place libre — ${role}` : undefined}
    >
      {/* zone tactile élargie */}
      {interactive && <circle cx={cx} cy={cy} r="8" fill="transparent" />}
      <circle
        cx={cx}
        cy={cy}
        r="5.4"
        fill="rgba(255,197,66,0.08)"
        stroke="#FFC542"
        strokeWidth="1"
        strokeDasharray="2.4 1.8"
        className="animate-pulse-slot"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <text x={cx} y={cy + 1.4} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="3.2" fill="#FFC542">
        {POSITION_SHORT[role]}
      </text>
    </g>
  )
}
