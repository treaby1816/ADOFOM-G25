import { ReactNode } from 'react'

export default function LeadershipLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {children}
      </div>
    </div>
  )
}
