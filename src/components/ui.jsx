import { createContext, useContext, useState, useCallback, useEffect } from 'react'

// ── Toasts ──
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((msg, type = 'info') => {
    const id = `${Date.now()}-${Math.round(performance.now())}`
    setToasts((t) => [...t, { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[500] w-[calc(100%-32px)] max-w-[398px] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              'px-4 py-3 rounded-2xl text-sm font-semibold text-center shadow-lift animate-[flap_0.3s_ease] ' +
              (t.type === 'ok'
                ? 'bg-grass-light text-chalk'
                : t.type === 'err'
                  ? 'bg-card text-white'
                  : 'bg-grass text-chalk border border-grass-light/40')
            }
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function Spinner({ className = '' }) {
  return (
    <span
      className={
        'inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin ' +
        className
      }
    />
  )
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-3 py-1.5 text-xs rounded-xl', md: 'px-4 py-2.5 text-sm', lg: 'px-5 py-3 text-base w-full' }
  const variants = {
    primary: 'bg-floodlight text-grass-deep hover:brightness-105',
    outline: 'bg-transparent border border-chalk/25 text-chalk hover:bg-chalk/5',
    ghost: 'bg-chalk/5 text-chalk hover:bg-chalk/10',
    danger: 'bg-card/15 border border-card/40 text-card hover:bg-card/25',
    grass: 'bg-grass-light text-chalk hover:brightness-110',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="block mb-3">
      {label && <span className="block text-xs font-semibold text-chalk/60 mb-1.5 uppercase tracking-wide">{label}</span>}
      {children}
      {hint && <span className="block text-[11px] text-chalk/40 mt-1">{hint}</span>}
    </label>
  )
}

const inputCls =
  'w-full bg-grass-deep/60 border border-chalk/12 rounded-xl px-3 py-2.5 text-sm text-chalk outline-none focus:border-floodlight/60 placeholder:text-chalk/30'

export function Input(props) {
  return <input {...props} className={`${inputCls} ${props.className || ''}`} />
}
export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${inputCls} appearance-none ${props.className || ''}`}>
      {children}
    </select>
  )
}

export function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div
        className={
          'w-full max-w-[430px] bg-grass-deep border-t border-grass-light/30 rounded-t-3xl sm:rounded-3xl p-5 pb-8 max-h-[92dvh] overflow-y-auto no-scrollbar animate-slide-up ' +
          (wide ? '' : '')
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl tracking-wide text-chalk uppercase">{title}</h2>
          <button onClick={onClose} className="text-chalk/50 hover:text-chalk text-xl leading-none px-2" aria-label="Fermer">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Confirm({ msg, onConfirm, onCancel, danger = true, confirmLabel = 'Confirmer' }) {
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6 animate-fade-in" onClick={onCancel}>
      <div className="w-full max-w-[340px] bg-grass border border-chalk/10 rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm text-chalk mb-5">{msg}</p>
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} className="flex-1" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Empty({ icon = '⚽', children }) {
  return (
    <div className="text-center py-12 px-4 text-chalk/45 text-sm">
      <div className="text-4xl mb-3 opacity-60">{icon}</div>
      {children}
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`rounded-xl bg-chalk/5 animate-pulse ${className}`} />
}
