// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Alert {
  title: string;
  message: string;
  type: string;
}

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const now = new Date()
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const todayMMDD = `${MONTH_NAMES[now.getMonth()]}/${now.getDate()}`
  
  const alerts: Alert[] = []

  // --- TRIGGER 1: Birthdays ---
  const { data: bdays } = await supabase
    .from('administrative_officers')
    .select('full_name, current_mda')
    .eq('birth_month_day', todayMMDD)

  bdays?.forEach(person => {
    alerts.push({
      title: '🎉 Birthday Celebration',
      message: `${person.full_name} from ${person.current_mda} is celebrating today!`,
      type: 'birthday'
    })
  })

  // --- TRIGGER 2: Pending Approvals (For Felix) ---
  const { count: pendingCount } = await supabase
    .from('administrative_officers')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', false)

  if (pendingCount && pendingCount > 0) {
    alerts.push({
      title: '🛡️ Pending Verifications',
      message: `There are ${pendingCount} new officers waiting for your approval.`,
      type: 'admin'
    })
  }

  // --- TRIGGER 3: Work Anniversaries (Example) ---
  // If you add a 'date_joined' column later, you'd add that logic here.

  // 3. Batch Insert all found alerts into the Notifications table
  if (alerts.length > 0) {
    const { error } = await supabase.from('notifications').insert(alerts)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ sent: alerts.length }), { status: 200 })
})
