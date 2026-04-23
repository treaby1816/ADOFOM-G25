'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Bell, X, Cake, BellRing, ShieldAlert, Info, Check, Trash2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface AppNotification {
  id: string
  title: string
  message: string
  type: 'birthday' | 'admin' | 'system'
  is_read: boolean
  created_at: string
}

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. Fetch real notifications from the new table
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) setNotifications(data)
  }

  useEffect(() => {
    fetchNotifications()
    
    // Optional: Set up a real-time subscription so the badge updates instantly
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, fetchNotifications)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // 2. Logic to mark as read
  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  // 3. Clear All Function
  const clearAll = async () => {
    if (!confirm("Are you sure you want to clear all notifications?")) return;

    const { error } = await supabase.rpc('clear_all_notifications')
    
    if (!error) {
      setNotifications([]) // Optimistic UI update
    } else {
      console.error("Error clearing notifications:", error.message)
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <>
      {/* Trigger Bell */}
      <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
        <Bell className="text-white/80" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-[#0f172a]">
            {unreadCount}
          </span>
        )}
      </button>

      {mounted && createPortal(
        <>
          {/* Overlay */}
          {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={() => setIsOpen(false)} />}

          {/* Drawer */}
          <div className={`fixed inset-0 sm:inset-auto sm:top-0 sm:right-0 sm:h-full sm:w-85 bg-[#0f172a] border-l border-white/10 shadow-2xl z-[9999] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header with close button — always visible */}
            <div className="flex items-center justify-between p-4 pt-5 border-b border-white/10 bg-emerald-950/20 shrink-0">
              <div className="flex items-center gap-2">
                <BellRing className="text-emerald-400" size={20} />
                <h2 className="text-lg font-bold text-white">Activity Feed</h2>
              </div>
              <div className="flex items-center gap-3">
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAll}
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-400/70 hover:text-red-400 transition-colors"
                    title="Clear All"
                  >
                    <Trash2 size={14} />
                    <span>Clear</span>
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2.5 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-all active:scale-90 border border-white/10"
                  aria-label="Close notifications"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Notification list — scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className={`p-4 rounded-2xl border transition-all ${n.is_read ? 'bg-white/5 border-white/5 opacity-60' : 'bg-white/10 border-white/20 shadow-lg'}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {n.type === 'birthday' && <Cake className="text-pink-400" size={18} />}
                        {n.type === 'admin' && <ShieldAlert className="text-amber-400" size={18} />}
                        {n.type === 'system' && <Info className="text-blue-400" size={18} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-white">{n.title}</p>
                          {!n.is_read && (
                            <button onClick={() => markAsRead(n.id)} className="p-1 hover:bg-emerald-500/20 rounded text-emerald-400">
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-white/70 mt-1 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-white/30 mt-2">{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-white/30">
                  <p className="text-sm italic text-balance px-10">All quiet for now. New alerts will appear here.</p>
                </div>
              )}
            </div>

            {/* Mobile bottom close button — easy to reach with thumb */}
            <div className="sm:hidden shrink-0 p-4 border-t border-white/10 bg-[#0f172a]">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 bg-white/10 hover:bg-red-500/20 text-white font-bold rounded-xl border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <X size={18} />
                Close Notifications
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
