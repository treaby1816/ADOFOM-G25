'use client'

import Link from 'next/link'
import { ShieldAlert, Clock, Mail, ChevronLeft } from 'lucide-react'
import SignOutButton from '@/components/SignOutButton'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden text-center">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0"></div>
        
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20 animate-pulse">
            <Clock className="w-12 h-12 text-yellow-500" />
            <ShieldAlert className="absolute -top-1 -right-1 w-8 h-8 text-yellow-500 bg-[#001f3f] rounded-full p-1" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mb-6">
          Access Pending <br className="sm:hidden" /> Verification
        </h1>
        
        <div className="space-y-6 text-slate-300 font-medium leading-relaxed">
          <p className="text-lg">
            Your ADOFOM account is pending verification by the <span className="text-yellow-500 font-bold">Administrative Cadre Secretariat</span>.
          </p>
          
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex items-start gap-4 text-left italic">
            <Mail className="w-6 h-6 shrink-0 text-slate-400" />
            <p className="text-sm">
              "We perform rigorous verification of every profile to ensure only genuine Administrative Officers gain access to the directory data. You will receive access automatically once verified."
            </p>
          </div>

          <p className="text-sm text-slate-400">
            If you believe this is a mistake or have questions, please contact the Secretariat through your MDA's official channels.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/login" 
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
            Back to Login
          </Link>
          
          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
          
          <SignOutButton />
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="mt-8 flex items-center gap-3 opacity-50">
        <img src="/logo2.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-white/20" />
        <span className="text-white text-xs font-black tracking-widest uppercase">ADOFOM Portal</span>
      </div>
    </div>
  )
}
