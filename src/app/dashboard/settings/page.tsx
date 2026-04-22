'use client'

import ChangePasswordForm from '@/components/ui/ChangePasswordForm'
import { Settings, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-8 w-fit"
      >
        <ChevronLeft size={16} />
        Back to Directory
      </Link>

      {/* Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
          <Settings className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-zinc-100 tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
            Manage your security preferences
          </p>
        </div>
      </div>

      {/* Change Password Section */}
      <ChangePasswordForm />
    </div>
  )
}
