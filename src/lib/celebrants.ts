import { createClient } from '@/utils/supabase/client'

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const getTodayCelebrants = async () => {
  const supabase = createClient()
  
  const today = new Date()
  const monthIndex = today.getMonth() // 0-indexed
  const dayOfMonth = today.getDate()
  const fullMonthName = MONTH_NAMES[monthIndex]
  const shortMonthName = fullMonthName.substring(0, 3)
  const paddedMonth = String(monthIndex + 1).padStart(2, '0')
  const paddedDay = String(dayOfMonth).padStart(2, '0')

  // Search for ALL possible birthday formats stored in DB:
  // New canonical: "May/14"  | Old numeric: "5/14", "05-14", "05/14"
  const bdayOrFilter = [
    `birth_month_day.eq.${fullMonthName}/${dayOfMonth}`,
    `birth_month_day.eq.${fullMonthName}/${paddedDay}`,
    `birth_month_day.eq.${shortMonthName}/${paddedDay}`,
    `birth_month_day.eq.${paddedMonth}-${paddedDay}`,
    `birth_month_day.eq.${monthIndex + 1}-${dayOfMonth}`,
    `birth_month_day.eq.${monthIndex + 1}/${dayOfMonth}`,
    `birth_month_day.eq.${paddedMonth}/${paddedDay}`,
  ].join(',')

  const { data, error } = await supabase
    .from('administrative_officers')
    .select('*')
    .or(bdayOrFilter)

  if (error) throw error
  return data
}
