import { createClient } from '@/utils/supabase/client'

export const getTodayCelebrants = async () => {
  const supabase = createClient()
  
  // Get current date in MM-DD format (e.g., "05-27")
  const today = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-')

  const { data, error } = await supabase
    .from('administrative_officers')
    .select('full_name, current_mda')
    .eq('birth_month_day', today) // Matches your stored MM-DD format

  if (error) throw error
  return data
}
