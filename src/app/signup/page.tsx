'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Mail, Lock, ChevronRight, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setMessage(null)

      // Step 1: WHITELIST CHECK
      // Check if the email exists in the administrative_officers table (The Whitelist)
      const { data: whitelistData, error: whitelistError } = await supabase
        .from('administrative_officers')
        .select('email_address')
        .eq('email_address', email.trim().toLowerCase())
        .maybeSingle();

      if (whitelistError) {
        console.error('Whitelist check error:', whitelistError);
        setMessage({ type: 'error', text: 'Security check failed. Please try again.' });
        setIsLoading(false);
        return;
      }

      if (!whitelistData) {
        setMessage({ 
          type: 'error', 
          text: 'This email is not authorized to join the portal. Please contact the Administrator to be added to the official register.' 
        });
        setIsLoading(false);
        return;
      }

      // Step 2: Create Auth User
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            needs_setup: true // Force redirect to profile setup
          }
        }
      })

      if (error) {
        console.error('Signup Auth Error:', error.message);
        if (error.message.toLowerCase().includes('already registered')) {
          setMessage({ type: 'error', text: 'This email is already registered. Please go to the Login page instead.' })
        } else {
          setMessage({ type: 'error', text: error.message })
        }
        setIsLoading(false);
        return;
      }
      
      if (data.user) {
        // Step 2: ACCOUNT CLAIMING LOGIC
        // Check if this email already exists in our legacy directory (the 97 officers)
        const { data: existingOfficer } = await supabase
          .from('administrative_officers')
          .select('email_address')
          .eq('email_address', email.trim().toLowerCase())
          .maybeSingle();

        if (existingOfficer) {
          // CLAIM FLOW: Link the existing profile to this new Auth ID
          const { error: updateError } = await supabase
            .from('administrative_officers')
            .update({
              id: data.user.id,
              needs_password_change: false // They just set their password
            })
            .eq('email_address', email.trim().toLowerCase());

          if (updateError) console.error('Link error:', updateError);
        } else {
          // NEW USER FLOW: Create a fresh profile
          const { error: insertError } = await supabase
            .from('administrative_officers')
            .insert({
              id: data.user.id,
              email_address: email.trim().toLowerCase(),
              full_name: 'New User',
              is_approved: false,
              is_admin: false,
              needs_password_change: false,
            })

          if (insertError) console.error('Profile insert error:', insertError)
        }

        // Redirect to pending approval
        // Redirect to Profile Setup
        setMessage({ type: 'success', text: 'Authorized! Redirecting to profile setup...' });
        setTimeout(() => router.push('/dashboard/setup-profile'), 1500);
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      const errorMsg = typeof err === 'string' ? err : (err?.message || 'An unexpected error occurred. Please try again.');
      setMessage({ type: 'error', text: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Top Back Navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-gold-500 mb-6 transition-colors w-fit"
        >
          ← Back
        </button>

        <div className="space-y-8 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0"></div>
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl"></div>
        
        {/* Header */}
        <div className="text-center relative">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl overflow-hidden">
              <img src="/logo2.jpg" alt="Ondo State Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-2">
            Create Account
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Join the ADOFOM Official Portal
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
          }`}>
            {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-medium leading-relaxed">{message.text}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors sm:text-sm"
                placeholder="Official Email Address"
                disabled={isLoading}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors sm:text-sm"
                placeholder="Password (min. 6 characters)"
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-yellow-500 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Info notice */}
          <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-3">
            <p className="text-xs text-yellow-400/80 leading-relaxed">
              After registration, your account will need to be <strong className="text-yellow-400">verified by the Admin Secretariat</strong> before you can access the directory.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-1/3 py-3 px-4 border border-slate-700 text-slate-300 rounded-xl hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 group relative flex justify-center py-3 px-4 btn-gold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors underline underline-offset-4"
            >
              Sign in here.
            </Link>
          </p>
        </div>
        </div>

        {/* Version Check to force mobile refresh */}
        <div className="mt-8 text-center opacity-10 text-[10px] text-white">
          ADOFOM Portal v2.0 - Optimized
        </div>
      </div>
    </div>
  )
}
