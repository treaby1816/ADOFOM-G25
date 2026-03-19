'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  UserCheck, 
  UserX, 
  ShieldAlert,
  Loader2,
  ChevronLeft,
  Filter,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface Officer {
  id: string
  full_name: string
  email_address: string
  current_mda: string
  is_approved: boolean
  created_at: string
}

export default function ApprovalsPage() {
  const [officers, setOfficers] = useState<Officer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchOfficers()
  }, [])

  const fetchOfficers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('administrative_officers')
      .select('id, full_name, email_address, current_mda, is_approved, created_at')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setOfficers(data)
    }
    setLoading(false)
  }

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('administrative_officers')
      .update({ is_approved: !currentStatus })
      .eq('id', id)
    
    if (!error) {
      setOfficers(officers.map(o => o.id === id ? { ...o, is_approved: !currentStatus } : o))
    }
  }

  const filteredOfficers = officers.filter(o => {
    const matchesSearch = o.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.email_address?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && !o.is_approved) || 
                         (filter === 'approved' && o.is_approved)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-hero-gradient p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2">
              <ChevronLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-yellow-500" /> Officer Verification
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage portal access for Administrative Officers</p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${filter === 'all' ? 'bg-yellow-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${filter === 'pending' ? 'bg-yellow-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${filter === 'approved' ? 'bg-yellow-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              Approved
            </button>
          </div>
        </div>

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

        {/* Desktop Table / Mobile List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="animate-spin" size={40} />
              <p className="font-medium animate-pulse">Loading directory data...</p>
            </div>
          ) : filteredOfficers.length === 0 ? (
            <div className="p-20 text-center text-slate-500">
              <p className="text-lg font-medium">No officers found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/10">
                    <th className="px-6 py-4">Officer Details</th>
                    <th className="px-6 py-4">MDA / Agency</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
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
                        {officer.is_approved ? (
                          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 w-fit">
                            <CheckCircle2 size={14} /> Approved
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-wider bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 w-fit">
                            <Clock size={14} /> Pending
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => toggleApproval(officer.id, officer.is_approved)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
                            officer.is_approved 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}
                        >
                          {officer.is_approved ? (
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

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Officers</p>
              <p className="text-2xl font-black text-white mt-1">{officers.length}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <Filter className="text-slate-400" size={24} />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-emerald-400/60 text-xs font-bold uppercase tracking-widest">Verified</p>
              <p className="text-2xl font-black text-white mt-1">{officers.filter(o => o.is_approved).length}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
              <CheckCircle2 className="text-emerald-400" size={24} />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-yellow-500/60 text-xs font-bold uppercase tracking-widest">Pending</p>
              <p className="text-2xl font-black text-white mt-1">{officers.filter(o => !o.is_approved).length}</p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/10">
              <ShieldAlert className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
