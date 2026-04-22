'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Cake, BellRing } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface Celebrant {
  full_name: string
  current_mda: string
}

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [celebrants, setCelebrants] = useState<Celebrant[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchBirthdays = async () => {
      // Get current date in MM-DD format
      const today = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '-')

      const { data, error } = await supabase
        .from('administrative_officers')
        .select('full_name, current_mda')
        .eq('birth_month_day', today)

      if (!error && data) {
        setCelebrants(data)
      }
    }

    fetchBirthdays()
  }, [supabase])

  return (
    <>
      {/* Notification Bell Icon (Place this in your Navbar) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
      >
        <Bell className="text-white/80" size={20} />
        {/* Dynamic Badge - Only shows if there are celebrants */}
        {celebrants.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border border-gray-900">
            {celebrants.length}
          </span>
        )}
      </button>

      {/* Background Overlay (Click to close) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-Out Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-[#0f172a] border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-emerald-900/40 to-transparent">
          <div className="flex items-center gap-2">
            <BellRing className="text-emerald-400" size={20} />
            <h2 className="text-lg font-bold text-white">Notifications</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          {/* Section: Birthdays Today */}
          <div className="mb-2">
            <p className="text-xs font-black uppercase tracking-wider text-white/40 mb-3">Today's Events</p>
            
            {celebrants.length > 0 ? (
              celebrants.map((person, index) => (
                <div 
                  key={index} 
                  className="p-3 mb-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3"
                >
                  <div className="p-2 bg-emerald-500/20 rounded-lg shrink-0">
                    <Cake className="text-emerald-400" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-100">Happy Birthday!</p>
                    <p className="text-xs text-white/70 mt-0.5">
                      <span className="font-semibold text-white">{person.full_name}</span> from {person.current_mda} is celebrating today.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
                <p className="text-sm text-white/40">No birthdays or events today.</p>
              </div>
            )}
          </div>

          {/* Future expansion: System Notifications can go here */}

        </div>
      </div>
    </>
  )
}
