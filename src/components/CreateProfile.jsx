import { useState } from 'react'
import { supabase } from '../supabase'
import { CITIES, POSITIONS, FEET } from '../lib/constants'
import { sanitize } from '../lib/helpers'
import { Button, Field, Input, Select, useToast } from './ui'

export default function CreateProfile({ session, onCreated }) {
  const toast = useToast()
  const [fullName, setFullName] = useState(session.user.user_metadata?.full_name || '')
  const [city, setCity] = useState('')
  const [position, setPosition] = useState('')
  const [foot, setFoot] = useState('right')
  const [saving, setSaving] = useState(false)

  const ready = fullName.trim().length >= 2 && city && position

  async function submit() {
    if (!ready) return
    setSaving(true)
    const { error } = await supabase.from('profiles').insert({
      id: session.user.id,
      full_name: sanitize(fullName).slice(0, 60),
      city,
      position,
      preferred_foot: foot,
      avatar_url: session.user.user_metadata?.avatar_url || null,
    })
    setSaving(false)
    if (error) {
      toast(error.message, 'err')
      return
    }
    toast('Profil créé ⚽', 'ok')
    onCreated()
  }

  return (
    <div className="min-h-[100dvh] bg-grass-deep mow-stripes flex flex-col items-center px-5 py-10">
      <div className="w-full max-w-[400px]">
        <p className="text-xs text-floodlight font-semibold tracking-widest uppercase mb-1">✨ Première connexion</p>
        <h1 className="font-display text-3xl text-chalk tracking-wide mb-1">TON PROFIL JOUEUR</h1>
        <p className="text-sm text-chalk/50 mb-6">Configure ta fiche pour rejoindre les matchs.</p>

        <div className="bg-grass rounded-3xl border border-grass-light/25 p-5 shadow-lift">
          <Field label="Prénom et nom">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ton nom" maxLength={60} />
          </Field>
          <Field label="Ville">
            <Select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">— Sélectionne ta ville —</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Poste">
            <div className="grid grid-cols-2 gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPosition(p.key)}
                  className={
                    'py-2.5 rounded-xl text-sm font-semibold border transition ' +
                    (position === p.key
                      ? 'bg-floodlight text-grass-deep border-floodlight'
                      : 'bg-grass-deep/50 text-chalk/70 border-chalk/12')
                  }
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Pied fort">
            <div className="flex gap-2">
              {FEET.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFoot(f.key)}
                  className={
                    'flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ' +
                    (foot === f.key
                      ? 'bg-grass-light text-chalk border-grass-light'
                      : 'bg-grass-deep/50 text-chalk/70 border-chalk/12')
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Field>

          <Button size="lg" className="mt-2" disabled={!ready || saving} onClick={submit}>
            {saving ? 'Création…' : 'Créer mon profil'}
          </Button>
        </div>
      </div>
    </div>
  )
}
