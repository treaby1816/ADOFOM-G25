'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = () => {
    // Clear auth cookies immediately
    document.cookie.split(";").forEach((c) => {
      const name = c.trim().split("=")[0]
      if (name.includes("auth-token") || name.includes("sb-")) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      }
    })
    window.location.href = "/"
    supabase.auth.signOut().catch(() => {})
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
