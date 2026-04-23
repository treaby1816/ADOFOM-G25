'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
  CheckCircle2, XCircle, Search, UserCheck,
  UserX, ShieldAlert, Loader2, ChevronLeft,
  Filter, Clock, AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'

interface Officer {
  id: string
  full_name: string
  email_address: string
  current_mda: string
  is_approved: boolean
  is_admin: boolean // Added this for the safety check
  created_at: string
}

export default function ApprovalsPage() {
  const [officers, setOfficers] = useState<Officer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [processingId, setProcessingId] = useState<string | null>(null) // Track specific button clicks
  const [error, setError] = useState<string | null>(null)
  const [connectionError, setConnectionError] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)

  const router = useRouter()

  // Optimization: Stabilize the Supabase client relative to the render cycle
  const supabase = useMemo(() => createClient(), [])

  // Admin access guard — verify before rendering any data
  useEffect(() => {
    async function verifyAdminAccess() {
      // High Speed Cache: Check if we already verified this session
      const cachedAdmin = sessionStorage.getItem('is_admin_verified');
      if (cachedAdmin === 'true') {
        setIsAuthorized(true);
        setAuthChecking(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.replace('/')
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('administrative_officers')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle()

        const userEmail = user.email?.trim().toLowerCase() || ''
        const whitelistEntry = WHITELIST_OFFICERS[userEmail]
        
        const isDbAdmin = profile?.is_admin === true
        const isWhitelistAdmin = whitelistEntry?.is_admin === true

        if (!isDbAdmin && !isWhitelistAdmin) {
          console.warn('Admin access denied — redirecting to home.')
          router.replace('/')
          return
        }

        sessionStorage.setItem('is_admin_verified', 'true');
        setIsAuthorized(true)
      } catch (err) {
        console.error('Admin guard error:', err)
        router.replace('/')
      } finally {
        setAuthChecking(false)
      }
    }

    verifyAdminAccess()
  }, [supabase, router])

  const fetchOfficers = useCallback(async () => {
    setLoading(true)
    setError(null)
    setConnectionError(false)
    try {
      const { data, error: sbError } = await supabase
        .from('administrative_officers')
        .select('id, full_name, email_address, current_mda, is_approved, is_admin, created_at')
        .order('is_approved', { ascending: true }) // Show pending at the top
        .order('created_at', { ascending: false })

      if (sbError) {
        throw sbError
      } else if (data) {
        setOfficers(data)
      }
    } catch (err: any) {
      setError("Failed to load officers. Please check your permissions.")
      setConnectionError(true)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (isAuthorized) fetchOfficers()
  }, [isAuthorized, fetchOfficers])

  // Realtime: listen for new signups so the list updates instantly
  useEffect(() => {
    if (!isAuthorized) return

    const channel = supabase
      .channel('admin-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'administrative_officers' },
        (payload) => {
          if (!payload.new.is_approved) {
            setOfficers((current) => [payload.new as Officer, ...current])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, isAuthorized])

  const toggleApproval = async (id: string, currentStatus: boolean, email: string) => {
    // SAFETY CHECK: Prevent Felix from revoking his own access
    if (email === 'felixadewole16@gmail.com' && currentStatus === true) {
      toast.error("Critical Action Blocked: You cannot revoke access for the Superuser account.")
      return
    }

    setProcessingId(id)
    
    // OPTIMISTIC UI: Update state immediately
    setOfficers(prev => prev.map(o => o.id === id ? { ...o, is_approved: !currentStatus } : o))

    const { error: updateError } = await supabase
      .from('administrative_officers')
      .update({ is_approved: !currentStatus })
      .eq('id', id)

    if (!updateError) {
      toast.success(currentStatus ? 'Access Revoked!' : 'Officer Approved!')
    } else {
      // Revert on failure
      setOfficers(prev => prev.map(o => o.id === id ? { ...o, is_approved: currentStatus } : o))
      toast.error("Update failed: " + updateError.message)
    }
    setProcessingId(null)
  }

  const filteredOfficers = useMemo(() => {
    return officers.filter(o => {
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = o.full_name?.toLowerCase().includes(query) ||
        o.email_address?.toLowerCase().includes(query)
      const matchesFilter = filter === 'all' ||
        (filter === 'pending' && !o.is_approved) ||
        (filter === 'approved' && o.is_approved)
      return matchesSearch && matchesFilter
    })
  }, [officers, searchQuery, filter])

  return (
    <>
      {/* Admin Access Guard — loading / unauthorized states */}
      {authChecking ? (
        <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-slate-400">
            <Loader2 className="animate-spin text-yellow-500" size={48} />
            <p className="font-bold uppercase tracking-widest text-xs">Verifying admin access...</p>
          </div>
        </div>
      ) : !isAuthorized ? (
        <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-red-400">
            <ShieldAlert size={48} />
            <p className="font-bold uppercase tracking-widest text-xs">Access Denied — Redirecting...</p>
          </div>
        </div>
      ) : (
    <div className="min-h-screen bg-hero-gradient p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 transition-colors">
              <ChevronLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-yellow-500" /> Officer Verification
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage portal access for Administrative Officers</p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
            {(['all', 'pending', 'approved'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${filter === type
                  ? 'bg-yellow-500 text-slate-950 shadow-gold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 backdrop-blur-md transition-all"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="animate-spin text-yellow-500" size={40} />
              <p className="font-medium animate-pulse uppercase tracking-widest text-xs">Syncing with database...</p>
            </div>
          ) : connectionError ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              <div>
                <p className="text-white font-bold text-lg mb-1">Database Sync Interrupted</p>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">We couldn't retrieve the officer list. This might be due to a temporary security update.</p>
              </div>
              <button
                onClick={() => fetchOfficers()}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-500/30 transition-all active:scale-95"
              >
                Retry Connection
              </button>
            </div>
          ) : filteredOfficers.length === 0 ? (
            <div className="p-20 text-center text-slate-500">
              <p className="text-lg font-medium">No records found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/10">
                    <th className="px-6 py-4">Officer Details</th>
                    <th className="px-6 py-4">MDA / Agency</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOfficers.map((officer) => (
                    <tr key={officer.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-base group-hover:text-yellow-500 transition-colors">
                            {officer.full_name}
                          </span>
                          <span className="text-slate-500 text-xs font-mono">{officer.email_address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-slate-300 text-sm font-medium">{officer.current_mda}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          {officer.is_approved ? (
                            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-wider bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 w-fit">
                              <CheckCircle2 size={12} /> Approved
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-black uppercase tracking-wider bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 w-fit">
                              <Clock size={12} /> Pending
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => toggleApproval(officer.id, officer.is_approved, officer.email_address)}
                          disabled={processingId === officer.id}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${officer.is_approved
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            }`}
                        >
                          {processingId === officer.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : officer.is_approved ? (
                            <><UserX size={16} /> Revoke</>
                          ) : (
                            <><UserCheck size={16} /> Verify</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Officers" value={officers.length} icon={<Filter size={20} />} />
          <StatCard title="Verified" value={officers.filter(o => o.is_approved).length} icon={<CheckCircle2 size={20} />} color="emerald" />
          <StatCard title="Pending" value={officers.filter(o => !o.is_approved).length} icon={<ShieldAlert size={20} />} color="yellow" />
        </div>
      </div>
    </div>
      )}
    </>
  )
}

// Reusable StatCard Component
function StatCard({ title, value, icon, color = 'slate' }: { title: string, value: number, icon: React.ReactNode, color?: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/10',
    slate: 'text-slate-400 bg-white/5 border-white/5'
  }

  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex items-center justify-between shadow-xl">
      <div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
        <p className="text-3xl font-black text-white mt-1 leading-none">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl border ${colorClasses[color]}`}>
        {icon}
      </div>
    </div>
  )
}