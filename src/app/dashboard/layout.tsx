'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { ShieldCheck, ArrowLeft, Settings, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile, error } = await supabase
            .from('administrative_officers')
            .select('is_admin')
            .eq('id', user.id)
            .single()
          
          if (error) throw error
          
          if (profile?.is_admin === true) {
            setIsAdmin(true)
          }
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
      {/* Top Professional Header (Glassmorphism) */}
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
        
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link 
              href="/admin/approvals" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-all text-xs font-bold uppercase tracking-wider"
              title="Admin Approval Dashboard"
            >
              <ShieldCheck size={16} />
              <span className="hidden md:inline">Admin Panel</span>
            </Link>
          )}
          <Link
            href="/dashboard/settings"
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Account Settings"
          >
            <Settings size={18} />
          </Link>
          <ThemeToggle />
          <div className="h-6 w-[1px] bg-white/20 mx-1 hidden sm:block" />
          <SignOutButton />
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Mobile Admin FAB */}
      {isAdmin && (
        <Link
          href="/admin/approvals"
          className="md:hidden fixed bottom-6 right-6 z-[100] flex items-center justify-center w-14 h-14 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] border border-yellow-400 text-yellow-950 hover:scale-105 active:scale-95 transition-all text-xl"
          title="Admin Panel"
        >
          <ShieldCheck size={28} />
        </Link>
      )}
    </div>
  )
}
