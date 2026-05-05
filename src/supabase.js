import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://deuibzwyylduftikqihp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldWliend5eWxkdWZ0aWtxaWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NzY2MDQsImV4cCI6MjA5MzU1MjYwNH0.pqOm-n2Zy0y4B8Dl7CvRmvKfHHMDdj71t1jpY0JdxI8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': SUPABASE_ANON_KEY
    }
  }
})