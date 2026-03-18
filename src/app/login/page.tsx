'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Mail, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  useEffect(() => {
    const clearSession = async () => {
      // Clear Supabase session on mount to prevent old "Pending" sessions
      const supabase = createClient()
      await supabase.auth.signOut()

      // Clear all local storage and session storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear non-HttpOnly cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
    clearSession()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({ type: 'error', text: 'Invalid email format. Please enter a valid email address.' })
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // ensure this resolves to the base URL
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      })

      if (error) {
        if (error.status === 429) {
          setMessage({ type: 'error', text: 'Rate limit reached. Please try again later.' })
        } else {
          setMessage({ type: 'error', text: error.message || 'An error occurred during sign in.' })
        }
      } else {
        setMessage({ type: 'success', text: 'Success! A secure login link has been sent to your email. Please check your inbox (and spam folder).' })
        setEmail('') // Clear input on success
      }
    } catch (err) {
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
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 relative z-10">
        
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
        <form onSubmit={handleLogin} className="space-y-6">
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

          <div>
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
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Secure Login Link
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
