'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('administrative_officers')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        if (profile?.is_admin) {
          setIsAdmin(true)
        }
      }
    }
    checkAdmin()
  }, [supabase])

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
          <ThemeToggle />
          <div className="h-6 w-[1px] bg-white/20 mx-1 hidden sm:block" />
          <SignOutButton />
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}
