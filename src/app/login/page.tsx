'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Mail, Lock, ChevronRight, AlertCircle, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({ type: 'error', text: 'Invalid email format. Please enter a valid email address.' })
      setIsLoading(false)
      return
    }

    if (!password || password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Sign in with email and password — NO OTP, NO Magic Links
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.status === 400) {
          setMessage({ type: 'error', text: 'Invalid email or password. Please try again.' })
        } else if (error.status === 429) {
          setMessage({ type: 'error', text: 'Too many login attempts. Please try again later.' })
        } else {
          setMessage({ type: 'error', text: error.message || 'An error occurred during sign in.' })
        }
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setMessage({ type: 'error', text: 'Authentication failed. Please try again.' })
        setIsLoading(false)
        return
      }

      // Post-login: Check profile state for redirect
      const cleanEmail = data.user.email?.trim().toLowerCase() || ''
      const isFelix = cleanEmail === 'felixadewole16@gmail.com'
      let profile = null
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('administrative_officers')
          .select('is_approved, needs_password_change')
          .eq('id', data.user.id)
          .maybeSingle()
        
        if (profileError) throw profileError
        profile = profileData
      } catch (profileErr) {
        console.error('Post-login Profile Error:', profileErr instanceof Error ? profileErr.message : profileErr)
        // If we can't fetch profile, fall back to default redirect
      }

      // Redirect Logic:
      // 1. Must change password? → Force password change page
      if (profile?.needs_password_change === true) {
        router.push('/setup/update-password')
        return
      }

      // 2. Not approved? Check whitelist before sending to pending
      const isOnWhitelist = !!WHITELIST_OFFICERS[cleanEmail]
      if (!isFelix && !isOnWhitelist && profile?.is_approved !== true) {
        router.push('/pending-approval')
        return
      }

      // 3. All clear → Main directory
      setMessage({ type: 'success', text: 'Login successful. Redirecting...' })
      router.push('/')
      router.refresh()

    } catch (err: any) {
      console.error('Login Handler Error:', err)
      const errorMsg = typeof err === 'object' ? (err.message || JSON.stringify(err)) : String(err)
      setMessage({ type: 'error', text: `An unexpected error occurred: ${errorMsg}` })
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
          href="/" 
          className="absolute top-6 left-6 p-2 text-slate-400 hover:text-yellow-500 hover:bg-white/5 rounded-full transition-all group"
          title="Back to Welcome"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>        
        {/* Logo Section */}
        <div className="flex justify-center mb-8 text-center">
          <div className="relative" style={{ zIndex: 50 }}>
            <img 
              src="/logo2.jpg" 
              alt="Ondo State Logo" 
              className="w-32 h-32 object-contain rounded-full bg-white/10 p-2 shadow-xl"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent uppercase drop-shadow-sm">
            ADOFOM OFFICIAL PORTAL
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Secure Closed-Door Access
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
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors sm:text-sm"
                placeholder="Enter your official email address"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" senior-only="true" className="sr-only">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors sm:text-sm"
                placeholder="Enter your password"
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 btn-gold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            New Officer?{' '}
            <Link 
              href="/signup" 
              className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors underline underline-offset-4"
            >
              Create your portal account here.
            </Link>
          </p>
        </div>

        {/* Mobile Hint */}
        <div className="mt-8 text-center border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500 max-w-[250px] mx-auto leading-relaxed">
            Using an iPhone? Tap <strong className="text-slate-400 font-medium">Share</strong> then <strong className="text-slate-400 font-medium">Add to Home Screen</strong> for the best experience.
          </p>
        </div>

      </div>
    </div>
  )
}
