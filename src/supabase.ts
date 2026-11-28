const url = import.meta.env.VITE_ZANE_SUPABASE_URL
const key = import.meta.env.VITE_ZANE_SUPABASE_PUBLISHABLE_KEY

export const supabaseClient = url && key
  ? import('@supabase/supabase-js').then(({ createClient }) => createClient(url, key))
  : null
