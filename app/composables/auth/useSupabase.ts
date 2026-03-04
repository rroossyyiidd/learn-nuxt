import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export const useSupabase = () => {
  if (supabaseInstance) return supabaseInstance

  const config = useRuntimeConfig()
  const { supabaseUrl, supabaseKey } = config.public

  supabaseInstance = createClient(supabaseUrl, supabaseKey)

  return supabaseInstance
}
