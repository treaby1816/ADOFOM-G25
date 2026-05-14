'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Officer } from '@/types/officer'
import ProfileModal from '@/components/ui/ProfileModal'
import TeamShowcase from '@/components/ui/TeamShowcase'
import { Award, Loader2, Search } from 'lucide-react'

export default function LeadershipPage() {
  const supabase = useMemo(() => createClient(), [])
  const [leaders, setLeaders] = useState<Officer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null)

  useEffect(() => {
    async function fetchLeaders() {
      try {
        // 1. Fetch officers
        const { data: officersData, error: officersError } = await supabase
          .from('administrative_officers')
          .select('*')
          .not('exco_portfolio', 'is', null)

        if (officersError) throw officersError

        // 2. Fetch portfolios for ordering
        const { data: portfoliosData, error: portfoliosError } = await supabase
          .from('leadership_portfolios')
          .select('title, sort_order')
        
        if (portfoliosError) {
          console.warn('Could not fetch portfolio ordering:', portfoliosError)
        }

        const officers = (officersData || []) as Officer[]
        const portfolios = portfoliosData || []

        // Create an ordering map based on the db sort_order
        const orderMap: Record<string, number> = {}
        portfolios.forEach(p => {
          orderMap[p.title] = p.sort_order
        })

        // Sort officers by portfolio sort_order, fallback to created_at
        officers.sort((a, b) => {
          const orderA = a.exco_portfolio && orderMap[a.exco_portfolio] !== undefined ? orderMap[a.exco_portfolio] : 9999
          const orderB = b.exco_portfolio && orderMap[b.exco_portfolio] !== undefined ? orderMap[b.exco_portfolio] : 9999
          
          if (orderA !== orderB) {
            return orderA - orderB
          }
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        })

        setLeaders(officers)
      } catch (err) {
        console.error('Error fetching leaders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaders()
  }, [supabase])

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-rose-500', 'bg-blue-500', 'bg-emerald-500',
      'bg-amber-500', 'bg-purple-500', 'bg-cyan-500', 'bg-indigo-500'
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  const getDriveViewUrl = (url: string) => {
    if (!url) return ''
    if (!url.includes('drive.google.com/open?id=')) return url
    const id = url.split('id=')[1]
    if (!id) return url
    return `/api/image-proxy?id=${id}`
  }

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="text-center space-y-3 relative z-10 py-6">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-2xl mb-2">
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-zinc-100 tracking-tight uppercase">
            ADOFOM <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">Leadership</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 font-medium max-w-xl mx-auto">
            Meet the Executive Committee of the Administrative Officers Forum.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Executives...</p>
          </div>
        ) : leaders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] border border-white/80 dark:border-zinc-800">
            <div className="p-4 bg-slate-100 dark:bg-zinc-800 rounded-full">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-bold text-slate-600 dark:text-zinc-400">No leadership records found.</p>
            <p className="text-sm text-slate-400 dark:text-zinc-500">Admins can assign Exco Portfolios via the Leadership Management Portal.</p>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet: Interactive Team Showcase (hidden on mobile) */}
            <div className="hidden md:block">
              <TeamShowcase
                members={leaders}
                onSelectMember={setSelectedOfficer}
              />
            </div>

            {/* Mobile: Traditional Card Grid (hidden on desktop/tablet) */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
              {leaders.map((officer) => {
                const showInitials = !officer.photo_url || officer.photo_url === '/default-avatar.png'

                return (
                  <button
                    key={officer.id}
                    onClick={() => setSelectedOfficer(officer)}
                    className="w-full h-full group relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-white/80 dark:border-zinc-800/80 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-yellow-500/20 dark:hover:shadow-yellow-900/20 hover:border-yellow-300/60 dark:hover:border-yellow-500/60 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col items-center cursor-pointer"
                  >
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Photo */}
                    <div className="w-full flex items-center justify-center pt-8 pb-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/50 dark:from-yellow-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative w-32 h-32 rounded-full overflow-hidden ring-[6px] ring-white dark:ring-zinc-800 shadow-xl group-hover:ring-yellow-100 dark:group-hover:ring-yellow-900/30 group-hover:scale-105 transition-all duration-300 z-10 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                        {showInitials ? (
                          <div className={`w-full h-full flex items-center justify-center text-4xl font-bold text-white shadow-inner ${getAvatarColor(officer.full_name)}`}>
                            {getInitials(officer.full_name)}
                          </div>
                        ) : (
                          <img
                            src={getDriveViewUrl(officer.photo_url)}
                            alt={officer.full_name}
                            className={`w-full h-full object-cover ${officer.photo_position?.startsWith('object-') ? officer.photo_position : 'object-center'}`}
                          />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="w-full px-6 pb-8 flex-1 text-center relative z-10">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 leading-tight mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
                        {officer.full_name.includes(',')
                          ? officer.full_name.split(',')[0].toUpperCase() + ',' + officer.full_name.split(',').slice(1).join(',')
                          : officer.full_name}
                      </h3>
                      <div className="inline-block mt-2">
                        <span className="text-sm font-black text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40 px-4 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-700/50 shadow-sm uppercase tracking-wider">
                          {officer.exco_portfolio}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 mt-4 uppercase tracking-widest">
                        {officer.current_mda}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Profile Modal */}
      {selectedOfficer && (
        <ProfileModal
          officer={selectedOfficer}
          onClose={() => setSelectedOfficer(null)}
          onOfficerUpdated={(updated) => {
            setLeaders(prev => prev.map(o => o.id === updated.id ? updated : o))
            setSelectedOfficer(updated)
          }}
        />
      )}
    </>
  )
}
