import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Aide au débogage : rappelle de copier .env.example en .env
  console.error(
    '[SoccerLink] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants. ' +
      'Copie .env.example en .env et renseigne tes clés Supabase.'
  )
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
