import { rankFor, RANKS } from '../lib/constants'

// Écusson de club — badge de rang
export default function RankBadge({ points = 0, rankName, size = 34, showLabel = false }) {
  const rank = rankName ? RANKS.find((r) => r.name === rankName) || rankFor(points) : rankFor(points)
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 40 44" aria-label={rank.name}>
        <path
          d="M20 2 L36 8 V22 C36 33 28 40 20 42 C12 40 4 33 4 22 V8 Z"
          fill={rank.color}
          stroke={rank.ring}
          strokeWidth="2"
        />
        <path d="M20 2 L36 8 V22 C36 33 28 40 20 42 Z" fill="rgba(0,0,0,0.12)" />
        <circle cx="20" cy="20" r="7" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
        <text
          x="20"
          y="24"
          textAnchor="middle"
          fontFamily="Anton, sans-serif"
          fontSize="10"
          fill="rgba(0,0,0,0.65)"
        >
          {rank.name[0]}
        </text>
      </svg>
      {showLabel && (
        <span className="text-xs font-semibold" style={{ color: rank.color }}>
          {rank.name}
        </span>
      )}
    </span>
  )
}
