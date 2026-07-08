'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { createVanillaClient } from '@/utils/supabase/vanilla'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const [isSessionReady, setIsSessionReady] = useState(false)
  const router = useRouter()

  const isExchanging = useRef(false)

  useEffect(() => {
    const supabase = createVanillaClient()
    let resolved = false

    const checkAndExchangeCode = async () => {
      if (isExchanging.current) return
      
      const params = new URLSearchParams(window.location.search)
      const tokenHash = params.get('token_hash')
      const type = params.get('type')
      const code = params.get('code')
      
      // PRIMARY PATH: token_hash (no PKCE, no storage needed at all)
      if (tokenHash && type === 'recovery') {
        isExchanging.current = true
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        })
        
        if (error) {
          console.error("verifyOtp error:", error)
          setMessage({
            type: 'error',
            text: `Password reset failed: ${error.message}. Please request a new reset link.`
          })
          window.history.replaceState({}, document.title, window.location.pathname)
          return
        }
        
        window.history.replaceState({}, document.title, window.location.pathname)
      }
      // FALLBACK: PKCE code exchange (legacy links)
      else if (code) {
        isExchanging.current = true
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error("exchangeCode error:", error)
          setMessage({
            type: 'error',
            text: `Password reset failed: ${error.message}. Please request a new reset link.`
          })
          window.history.replaceState({}, document.title, window.location.pathname)
          return
        }
        
        window.history.replaceState({}, document.title, window.location.pathname)
      }

      // Check for an active session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        resolved = true
        setIsSessionReady(true)
      } else {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
            resolved = true
            setIsSessionReady(true)
          }
        })

        setTimeout(() => {
          if (!resolved) {
            setMessage({
              type: 'error',
              text: 'Invalid or expired reset link. Please request a new one.',
            })
          }
        }, 6000)

        return subscription
      }
    }

    const subPromise = checkAndExchangeCode()

    return () => {
      subPromise.then(sub => {
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe()
        }
      })
    }
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!password || password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      setIsLoading(false)
      return
    }

    try {
      const supabase = createVanillaClient()
      
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to update password.' })
        setIsLoading(false)
        return
      }

      // Also clear the needs_password_change flag if it exists
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('administrative_officers')
          .update({ needs_password_change: false })
          .eq('id', user.id)
      }

      setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' })
      
      // Sign out so they can log in with the new password
      await supabase.auth.signOut()
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (err: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2.5rem] p-10 relative z-10 overflow-hidden">
        
        {/* Back Button */}
        <Link 
          href="/login" 
          className="absolute top-6 left-6 p-2 text-slate-400 hover:text-yellow-500 hover:bg-white/5 rounded-full transition-all group"
          title="Back to Login"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
            <ShieldCheck className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent uppercase drop-shadow-sm">
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Create a strong, memorable password for your account
          </p>
        </div>

        {/* Messaging */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${
            message.type === 'error' 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {message.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Form */}
        {isSessionReady ? (
          <form onSubmit={handleReset} className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="new-password"
                  name="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors sm:text-sm"
                  placeholder="Minimum 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors sm:text-sm"
                  placeholder="Re-enter your new password"
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-yellow-500 transition-colors cursor-pointer"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Password strength hint */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Password Tips</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li className={password.length >= 6 ? 'text-emerald-400' : ''}>• At least 6 characters</li>
                <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-emerald-400' : ''}>• Mix of upper & lowercase</li>
                <li className={/[0-9]/.test(password) ? 'text-emerald-400' : ''}>• Include a number</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 btn-gold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Resetting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Reset Password
                  </span>
                )}
              </button>
            </div>
          </form>
        ) : !message ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">Verifying your reset link...</p>
          </div>
        ) : null}

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Remember your password?{' '}
            <Link 
              href="/login" 
              className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors underline underline-offset-4"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Mobile Hint */}
        <div className="mt-8 text-center border-t border-slate-800 pt-6">
          <div className="flex items-center justify-center gap-3 opacity-30">
            <img src="/logo2.jpg" alt="Logo" className="w-5 h-5 rounded-full" />
            <span className="text-white text-[9px] font-black tracking-[0.3em] uppercase">ADOFOM Portal</span>
          </div>
        </div>

      </div>
    </div>
  )
}
