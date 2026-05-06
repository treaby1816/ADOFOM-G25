'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Clock, Mail, Phone, LogOut, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react'

export default function PendingApproval() {
  const supabase = createClient()
  const router = useRouter()
  const [checking, setChecking] = useState(false)
  const [approved, setApproved] = useState(false)

  const handleLogout = () => {
    document.cookie.split(";").forEach((c) => {
      const name = c.trim().split("=")[0]
      if (name.includes("auth-token") || name.includes("sb-")) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      }
    })
    window.location.href = "/"
    supabase.auth.signOut().catch(() => {})
  }

  const checkApprovalStatus = async () => {
    setChecking(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: officer } = await supabase
          .from('administrative_officers')
          .select('is_approved')
          .eq('id', user.id)
          .maybeSingle()

        if (officer?.is_approved) {
          setApproved(true)
          setTimeout(() => router.push('/'), 1500)
          return
        }
      }
    } catch (err) {
      console.error('Check status error:', err)
    } finally {
      setChecking(false)
    }
  }

  // Check on mount
  useEffect(() => {
    checkApprovalStatus()
  }, [])

  if (approved) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center animate-modal-in">
          <div className="mb-6 inline-flex p-4 bg-emerald-500/20 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="text-emerald-400" size={48} />
          </div>
          <h1 className="text-3xl font-black mb-3 tracking-tight">Account Approved!</h1>
          <p className="text-white/60 mb-4 leading-relaxed">
            Your account has been verified. Redirecting to the dashboard...
          </p>
          <Loader2 className="mx-auto animate-spin text-emerald-400" size={24} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
        
        {/* Status Icon */}
        <div className="mb-6 inline-flex p-4 bg-yellow-500/20 rounded-full border border-yellow-500/30">
          <Clock className="text-yellow-500 animate-pulse" size={48} />
        </div>

        <h1 className="text-3xl font-black mb-3 tracking-tight">Account Pending</h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          Your profile has been successfully created. For security, an administrator must verify your credentials before you can access the Ondo State Admin Directory.
        </p>

        {/* Support Section */}
        <div className="space-y-4 text-left bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <ShieldCheck className="text-emerald-500" size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Administrator</p>
              <p className="text-sm font-semibold">Felix Bamidele</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Mail className="text-white/40" size={20} />
            <a href="mailto:felixadewole16@gmail.com" className="text-sm hover:text-emerald-400 transition-colors">
              felixadewole16@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Phone className="text-white/40" size={20} />
            <a href="tel:08065136221" className="text-sm hover:text-emerald-400 transition-colors">
              +234 806 513 6221
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            onClick={checkApprovalStatus}
            disabled={checking}
            className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {checking ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Checking...
              </>
            ) : (
              'Check Status'
            )}
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full py-4 flex items-center justify-center gap-2 text-white/60 font-medium hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        <p className="mt-8 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
          Ondo State Govt • ADOFOM Portal
        </p>
      </div>
    </div>
  )
}
