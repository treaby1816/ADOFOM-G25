'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
  ShieldAlert, Loader2, ChevronLeft, Save, Plus, AlertTriangle, Users, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'
import OfficerCombobox from '@/components/ui/OfficerCombobox'

interface Portfolio {
  id: string
  title: string
  sort_order: number
}

interface Officer {
  id: string
  full_name: string
  exco_portfolio: string | null
}

export default function LeadershipSetupPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [officers, setOfficers] = useState<Officer[]>([])
  const [assignments, setAssignments] = useState<Record<string, string>>({}) // portfolio title -> officer id
  const [originalAssignments, setOriginalAssignments] = useState<Record<string, string>>({})
  
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('')
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)

  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  // 1. Verify Admin Access
  useEffect(() => {
    async function verifyAdminAccess() {
      const cachedAdmin = sessionStorage.getItem('is_admin_verified')
      if (cachedAdmin === 'true') {
        setIsAuthorized(true)
        setAuthChecking(false)
        return
      }

      // Anti-hang timeout
      const timeoutId = setTimeout(() => {
          if (authChecking) {
              setAuthChecking(false);
              router.replace('/');
          }
      }, 5000);

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.replace('/')
          return
        }

        const { data: profile } = await supabase
          .from('administrative_officers')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle()

        const userEmail = user.email?.trim().toLowerCase() || ''
        const whitelistEntry = WHITELIST_OFFICERS[userEmail]
        
        const isDbAdmin = profile?.is_admin === true
        const isWhitelistAdmin = whitelistEntry?.is_admin === true

        if (!isDbAdmin && !isWhitelistAdmin) {
          router.replace('/')
          return
        }

        sessionStorage.setItem('is_admin_verified', 'true')
        setIsAuthorized(true)
      } catch (err) {
        console.error('Admin guard error:', err)
        router.replace('/')
      } finally {
        clearTimeout(timeoutId);
        setAuthChecking(false)
      }
    }

    verifyAdminAccess()
  }, [supabase, router])

  // 2. Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch portfolios
      const { data: pData, error: pError } = await supabase
        .from('leadership_portfolios')
        .select('*')
        .order('sort_order', { ascending: true })

      if (pError) {
          // If table doesn't exist, this will error. 
          console.error("Fetch portfolios error:", pError);
          toast.error("Database table missing. Please run the SQL setup script.");
      }

      const validPortfolios = pData || [];
      setPortfolios(validPortfolios)

      // Fetch officers
      const { data: oData, error: oError } = await supabase
        .from('administrative_officers')
        .select('id, full_name, exco_portfolio')
        .eq('is_approved', true)
        .order('full_name', { ascending: true })
      
      if (oError) throw oError

      const validOfficers = oData || [];
      setOfficers(validOfficers)

      // Build mapping of who is currently holding what
      const initialMap: Record<string, string> = {}
      validOfficers.forEach(off => {
        if (off.exco_portfolio) {
          initialMap[off.exco_portfolio] = off.id
        }
      })
      
      setAssignments(initialMap)
      setOriginalAssignments(initialMap)

    } catch (err) {
      console.error(err)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (isAuthorized) fetchData()
  }, [isAuthorized, fetchData])


  // 3. Handle Assignment Changes
  const handleAssignmentChange = (portfolioTitle: string, officerId: string) => {
    setAssignments(prev => {
      const newMap = { ...prev }
      
      // If we select an officer, we must ensure they aren't assigned to multiple roles
      // Strip them from any other role they might hold in our local state
      if (officerId) {
        Object.keys(newMap).forEach(key => {
            if (newMap[key] === officerId) {
                delete newMap[key]
            }
        })
        newMap[portfolioTitle] = officerId
      } else {
        delete newMap[portfolioTitle]
      }
      return newMap
    })
  }

  // 4. Save Assignments
  const handleSaveAssignments = async () => {
    setIsSaving(true)
    try {
        // 1. We need to clear exco_portfolio for anyone who USED to have a portfolio
        // but now doesn't, or has a different one.
        const officersToUpdate = [];

        for (const officer of officers) {
            const currentRoleInDb = officer.exco_portfolio;
            
            // Find what their NEW role is in our map
            const newRole = Object.keys(assignments).find(key => assignments[key] === officer.id) || null;

            if (currentRoleInDb !== newRole) {
                officersToUpdate.push({
                    id: officer.id,
                    exco_portfolio: newRole
                })
            }
        }

        if (officersToUpdate.length === 0) {
            toast.success("No changes to save.")
            setIsSaving(false)
            return;
        }

        // Supabase doesn't have an easy bulk update for varying values without using an RPC or upsert.
        // We will execute them sequentially (or via Promise.all) since the number of EXCOs is small.
        const updatePromises = officersToUpdate.map(update => 
            supabase
                .from('administrative_officers')
                .update({ exco_portfolio: update.exco_portfolio })
                .eq('id', update.id)
        );

        await Promise.all(updatePromises);
        
        toast.success("Leadership portfolios updated successfully!")
        await fetchData(); // Refresh data

    } catch (err) {
        console.error(err)
        toast.error("Failed to update assignments")
    } finally {
        setIsSaving(false)
    }
  }

  // 5. Add New Portfolio
  const handleAddPortfolio = async () => {
    const title = newPortfolioTitle.trim()
    if (!title) return

    setIsAddingPortfolio(true)
    try {
        const { error } = await supabase
            .from('leadership_portfolios')
            .insert({
                title: title,
                sort_order: portfolios.length + 1
            })
        
        if (error) {
            if (error.code === '23505') {
                toast.error("This portfolio already exists.")
            } else {
                throw error
            }
        } else {
            toast.success(`Added ${title} portfolio.`)
            setNewPortfolioTitle('')
            await fetchData()
        }
    } catch (err) {
        console.error(err)
        toast.error("Failed to add portfolio")
    } finally {
        setIsAddingPortfolio(false)
    }
  }


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
          <p className="font-bold uppercase tracking-widest text-xs">Access Denied</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hero-gradient p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 transition-colors">
              <ChevronLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Users className="text-yellow-500" /> Leadership Setup
            </h1>
            <p className="text-slate-400 text-sm mt-1">Assign officers to executive portfolios</p>
          </div>
          
          <button
            onClick={handleSaveAssignments}
            disabled={isSaving}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-6 py-3 rounded-2xl transition-all shadow-gold disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSaving ? 'Saving...' : 'Save Assignments'}
          </button>
        </div>

        {/* Main Content */}
        {loading ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-20 flex flex-col items-center justify-center text-slate-400 gap-4 shadow-2xl">
              <Loader2 className="animate-spin text-yellow-500" size={40} />
              <p className="font-medium animate-pulse uppercase tracking-widest text-xs">Loading portfolios...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
                
                {/* Notice */}
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-3 text-blue-400 text-sm font-medium">
                    <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                    <p>
                        Assign an officer to a portfolio below. When you click Save, the system will automatically remove the badge from the incumbent (if any) and assign it to the newly selected officer. Changes reflect instantly on the Leadership page.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                        <h2 className="text-lg font-black text-white uppercase tracking-wider">Executive Portfolios</h2>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {portfolios.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-8">No portfolios found. Make sure the database script has been executed.</p>
                        ) : (
                            portfolios.map(portfolio => {
                                const currentValue = assignments[portfolio.title] || "";
                                
                                return (
                                <div key={portfolio.id} className="flex flex-col md:flex-row md:items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                                    <div className="w-full md:w-1/3">
                                        <p className="text-yellow-500 font-bold uppercase tracking-wider text-sm">{portfolio.title}</p>
                                    </div>
                                    <div className="w-full md:w-2/3">
                                        <OfficerCombobox 
                                            officers={officers}
                                            value={currentValue}
                                            onChange={(val) => handleAssignmentChange(portfolio.title, val)}
                                        />
                                    </div>
                                </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Add New Portfolio Box */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">Add Custom Portfolio</h2>
                    </div>
                    <div className="p-6 flex gap-4">
                        <input
                            type="text"
                            placeholder="e.g. Welfare Director"
                            value={newPortfolioTitle}
                            onChange={(e) => setNewPortfolioTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddPortfolio()}
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500"
                        />
                        <button
                            onClick={handleAddPortfolio}
                            disabled={!newPortfolioTitle.trim() || isAddingPortfolio}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors disabled:opacity-50 font-bold text-sm"
                        >
                            {isAddingPortfolio ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            Add Role
                        </button>
                    </div>
                </div>

            </div>
        )}
      </div>
    </div>
  )
}
