'use client'

import { ReactNode } from 'react'
import SignOutButton from '@/components/SignOutButton'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col">
      {/* Top Professional Header (Glassmorphism) */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-green-950/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-1 border border-white/20 overflow-hidden" style={{ zIndex: 50 }}>
            <img src="/logo2.jpg" alt="Ondo State Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight hidden sm:block">
            ADOFOM Portal
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
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
