'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'
import { Clock, Mail, Phone, LogOut, ShieldCheck } from 'lucide-react'

export default function PendingApproval() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // SELF-HEALING: Auto-approve legacy officers stuck on this page
  useEffect(() => {
    const checkApproval = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // ULTIMATE BYPASS: Check the local master list
        const email = user.email?.toLowerCase() || ""
        if (WHITELIST_OFFICERS[email]) {
          console.log('Master Key match: Redirecting legacy officer instantly')
          router.push('/')
          return
        }

        // Fallback: Check DB if not in local master list
        const { data: officer } = await supabase
          .from('administrative_officers')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (officer && !officer.is_approved) {
          console.log('Officer found, checking legacy status:', officer.full_name);
          const isLegacyAndComplete = officer.full_name && officer.full_name !== 'New User' && officer.current_mda;
          if (isLegacyAndComplete) {
            console.log('Self-healing: Auto-approving legacy officer');
            const { error: updateErr } = await supabase
              .from('administrative_officers')
              .update({ is_approved: true })
              .eq('id', user.id);
            
            if (updateErr) {
              console.error('Self-heal update error:', updateErr);
            } else {
              router.push('/')
            }
          } else {
            console.log('Officer is new or incomplete, staying on pending page');
          }
        } else if (officer?.is_approved) {
          console.log('Officer already approved, redirecting');
          router.push('/')
        } else {
          console.log('No officer record found for user ID:', user.id);
        }
    checkApproval()
  }, [supabase, router])

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
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg"
          >
            Check Status
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
