import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vrai seulement si les deux clés sont présentes
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

if (!supabaseConfigured) {
  console.error(
    '[SoccerLink] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants. ' +
      'Ajoute-les dans les variables d\'environnement de ton hébergement (puis redéploie), ' +
      'ou copie .env.example en .env en local.'
  )
}

// On passe des valeurs factices valides si non configuré, pour éviter que
// createClient ne jette une erreur au chargement (ce qui donnerait un écran blanc).
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)
