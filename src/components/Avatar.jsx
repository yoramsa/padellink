import { initials, avatarHue } from '../lib/helpers'

export default function Avatar({ name, url, size = 40, ring }) {
  const hue = avatarHue(name)
  const style = { width: size, height: size, fontSize: size * 0.4 }
  if (ring) {
    style.boxShadow = `0 0 0 2px ${ring}`
  }
  if (url) {
    return (
      <img
        src={url}
        alt={name || ''}
        className="rounded-full object-cover flex-shrink-0"
        style={style}
      />
    )
  }
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none"
      style={{
        ...style,
        background: `linear-gradient(135deg, hsl(${hue} 45% 32%), hsl(${(hue + 40) % 360} 50% 24%))`,
      }}
    >
      {initials(name)}
    </div>
  )
}
