'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
  ShieldAlert, Loader2, ChevronLeft, Search,
  FileText, RefreshCw, Download, AlertTriangle,
  Pencil, Trash2, Plus, Filter
} from 'lucide-react'
import Link from 'next/link'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'

interface AuditLog {
  id: number
  created_at: string
  actor_id: string | null
  action_type: 'INSERT' | 'UPDATE' | 'DELETE'
  table_name: string
  record_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
}

const ACTION_STYLES: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  INSERT: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    icon: <Plus size={11} />,
  },
  UPDATE: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
    icon: <Pencil size={11} />,
  },
  DELETE: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    icon: <Trash2 size={11} />,
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getDisplayName(data: Record<string, unknown> | null): string {
  if (!data) return '—'
  return (data.full_name as string) || (data.title as string) || (data.email_address as string) || '—'
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState<'ALL' | 'INSERT' | 'UPDATE' | 'DELETE'>('ALL')
  const [tableFilter, setTableFilter] = useState<string>('ALL')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  // Admin guard
  useEffect(() => {
    async function verifyAdmin() {
      const cached = sessionStorage.getItem('is_admin_verified')
      if (cached === 'true') {
        setIsAuthorized(true)
        setAuthChecking(false)
        return
      }
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.replace('/'); return }

        const { data: profile } = await supabase
          .from('administrative_officers')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle()

        const email = user.email?.trim().toLowerCase() || ''
        const isAdmin = profile?.is_admin === true || WHITELIST_OFFICERS[email]?.is_admin === true
        if (!isAdmin) { router.replace('/'); return }

        sessionStorage.setItem('is_admin_verified', 'true')
        setIsAuthorized(true)
      } catch {
        router.replace('/')
      } finally {
        setAuthChecking(false)
      }
    }
    verifyAdmin()
  }, [supabase, router])

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: sbError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)

      if (sbError) throw sbError
      setLogs(data || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to load audit logs: ${msg}`)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (isAuthorized) fetchLogs()
  }, [isAuthorized, fetchLogs])

  // Realtime subscription for live updates
  useEffect(() => {
    if (!isAuthorized) return
    const channel = supabase
      .channel('audit-log-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, (payload) => {
        setLogs((prev) => [payload.new as AuditLog, ...prev])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase, isAuthorized])

  const uniqueTables = useMemo(() => ['ALL', ...Array.from(new Set(logs.map(l => l.table_name)))], [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q ||
        log.table_name.toLowerCase().includes(q) ||
        log.action_type.toLowerCase().includes(q) ||
        getDisplayName(log.new_data).toLowerCase().includes(q) ||
        getDisplayName(log.old_data).toLowerCase().includes(q) ||
        (log.record_id || '').toLowerCase().includes(q)
      const matchesAction = actionFilter === 'ALL' || log.action_type === actionFilter
      const matchesTable = tableFilter === 'ALL' || log.table_name === tableFilter
      return matchesSearch && matchesAction && matchesTable
    })
  }, [logs, searchQuery, actionFilter, tableFilter])

  const exportCSV = () => {
    const rows = [
      ['ID', 'Timestamp', 'Action', 'Table', 'Record', 'Actor'],
      ...filteredLogs.map(l => [
        l.id,
        l.created_at,
        l.action_type,
        l.table_name,
        l.record_id || '',
        l.actor_id || 'system',
      ])
    ]
    const csv = rows.map(r => r.map(String).map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `audit-log-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  // ---- Render guards ----
  if (authChecking) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="animate-spin text-yellow-500" size={48} />
          <p className="font-bold uppercase tracking-widest text-xs">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-red-400">
          <ShieldAlert size={48} />
          <p className="font-bold uppercase tracking-widest text-xs">Access Denied — Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hero-gradient p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <Link href="/" className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 transition-colors">
              <ChevronLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <FileText className="text-yellow-500" /> Audit Log
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Immutable record of all data changes — {logs.length} events total
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 rounded-xl text-slate-950 text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: logs.length, color: 'text-white' },
            { label: 'Inserts', value: logs.filter(l => l.action_type === 'INSERT').length, color: 'text-emerald-400' },
            { label: 'Updates', value: logs.filter(l => l.action_type === 'UPDATE').length, color: 'text-yellow-400' },
            { label: 'Deletes', value: logs.filter(l => l.action_type === 'DELETE').length, color: 'text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search by table, action, or record..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 backdrop-blur-md transition-all"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-xl backdrop-blur-md">
            <Filter size={14} className="text-slate-500 ml-2" />
            {(['ALL', 'INSERT', 'UPDATE', 'DELETE'] as const).map((a) => (
              <button
                key={a}
                onClick={() => setActionFilter(a)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  actionFilter === a
                    ? 'bg-yellow-500 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >{a}</button>
            ))}
          </div>

          {uniqueTables.length > 2 && (
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 backdrop-blur-md"
            >
              {uniqueTables.map(t => <option key={t} value={t} className="bg-zinc-900">{t === 'ALL' ? 'All Tables' : t}</option>)}
            </select>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium">
            <AlertTriangle size={20} /> {error}
          </div>
        )}

        {/* Log Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="animate-spin text-yellow-500" size={40} />
              <p className="font-medium animate-pulse uppercase tracking-widest text-xs">Loading audit records...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-20 text-center text-slate-500">
              <FileText size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">No audit records found.</p>
              <p className="text-xs mt-1">Records appear here after changes are made in the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/10">
                    <th className="px-5 py-4">Timestamp</th>
                    <th className="px-5 py-4">Action</th>
                    <th className="px-5 py-4">Table</th>
                    <th className="px-5 py-4">Record</th>
                    <th className="px-5 py-4 text-center">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLogs.map((log) => {
                    const style = ACTION_STYLES[log.action_type] || ACTION_STYLES.UPDATE
                    const isExpanded = expandedId === log.id
                    const displayName = getDisplayName(log.new_data || log.old_data)

                    return (
                      <>
                        <tr
                          key={log.id}
                          className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                          onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        >
                          <td className="px-5 py-4">
                            <span className="text-slate-300 text-xs font-mono">{formatDate(log.created_at)}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}>
                              {style.icon}{log.action_type}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-slate-300 text-xs font-mono bg-white/5 px-2 py-0.5 rounded">
                              {log.table_name}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-white text-sm font-semibold">{displayName}</span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="text-slate-500 text-xs hover:text-yellow-400 transition-colors font-mono">
                              {isExpanded ? '▲ hide' : '▼ expand'}
                            </span>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr key={`${log.id}-detail`} className="bg-white/[0.02]">
                            <td colSpan={5} className="px-5 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                {log.old_data && (
                                  <div>
                                    <p className="text-slate-500 font-black uppercase tracking-widest mb-2">Before</p>
                                    <pre className="bg-black/30 border border-white/10 rounded-xl p-3 text-slate-400 overflow-auto max-h-48 font-mono text-[10px] leading-relaxed">
                                      {JSON.stringify(log.old_data, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.new_data && (
                                  <div>
                                    <p className="text-slate-500 font-black uppercase tracking-widest mb-2">After</p>
                                    <pre className="bg-black/30 border border-white/10 rounded-xl p-3 text-slate-400 overflow-auto max-h-48 font-mono text-[10px] leading-relaxed">
                                      {JSON.stringify(log.new_data, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                <div className="md:col-span-2 flex flex-wrap gap-4 text-slate-500">
                                  <span>Actor ID: <span className="font-mono text-slate-400">{log.actor_id || 'system/trigger'}</span></span>
                                  <span>Record ID: <span className="font-mono text-slate-400">{log.record_id || '—'}</span></span>
                                  <span>Log ID: <span className="font-mono text-slate-400">#{log.id}</span></span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 pb-4">
          Showing {filteredLogs.length} of {logs.length} events · Audit logs are immutable and cannot be deleted
        </p>
      </div>
    </div>
  )
}
