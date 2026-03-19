'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-2 group"
    >
      <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
      Sign Out
    </button>
  )
}
