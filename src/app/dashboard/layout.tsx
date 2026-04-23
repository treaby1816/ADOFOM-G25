'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NavigationDrawer from '@/components/ui/NavigationDrawer'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isChecking, setIsChecking] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
      } catch (err) {
        console.error('Dashboard Check Error:', err instanceof Error ? err.message : err)
      } finally {
        setIsChecking(false)
      }
    }
    checkUser()
  }, [supabase])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-sm font-bold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">Securing Session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col">
      {/* Top Professional Header — consolidated into NavigationDrawer */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-green-950/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 mr-1 rounded-full text-white/70 hover:text-yellow-500 hover:bg-white/10 transition-all group"
            title="Go Back"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full p-1 border border-white/20 overflow-hidden" style={{ zIndex: 50 }}>
              <img src="/logo2.jpg" alt="Ondo State Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight hidden sm:block">
              ADOFOM Portal
            </h2>
          </Link>
        </div>
        
        {/* Single NavigationDrawer replaces all scattered nav items */}
        <div className="flex items-center gap-3">
          <NavigationDrawer />
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}
