'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Bell, X, Cake, BellRing, ShieldAlert, Info, Check, Trash2, Newspaper, UserPlus } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ConfirmModal from './ConfirmModal'

interface AppNotification {
  id: string
  title: string
  message: string
  type: 'birthday' | 'admin' | 'system' | 'news'
  is_read: boolean
  created_at: string
  link?: string
}

interface NewsArticle {
  id: string
  title: string
  content: string
  category: string
  author_name: string
  created_at: string
}

const getDismissedBirthdays = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem("adofom_dismissed_birthdays");
    if (stored) {
      const parsed = JSON.parse(stored);
      const todayStr = new Date().toDateString();
      if (parsed.date === todayStr) {
        return parsed.ids || [];
      }
    }
  } catch (e) {
    console.error(e);
  }
  return [];
};

const dismissBirthdays = (ids: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    const todayStr = new Date().toDateString();
    const current = getDismissedBirthdays();
    const updatedIds = Array.from(new Set([...current, ...ids]));
    localStorage.setItem("adofom_dismissed_birthdays", JSON.stringify({
      date: todayStr,
      ids: updatedIds
    }));
  } catch (e) {
    console.error(e);
  }
};

const getDismissedNotifications = (userId: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = `adofom_dismissed_notifications_${userId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const dismissNotifications = (ids: string[], userId: string) => {
  if (typeof window === 'undefined') return;
  try {
    const key = `adofom_dismissed_notifications_${userId}`;
    const current = getDismissedNotifications(userId);
    const updatedIds = Array.from(new Set([...current, ...ids]));
    localStorage.setItem(key, JSON.stringify(updatedIds));
  } catch (e) {
    console.error(e);
  }
};

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [newsAlerts, setNewsAlerts] = useState<AppNotification[]>([])
  const [birthdayAlerts, setBirthdayAlerts] = useState<AppNotification[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Get the current user ID so dismiss keys are user-scoped
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) setCurrentUserId(data.user.id)
    })
  }, [])

  // 1. Fetch real notifications from the notifications table
  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || '';

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      const dismissedIds = getDismissedNotifications(userId);
      const activeData = data.filter((n: any) => !dismissedIds.includes(n.id));
      const mappedData = activeData.map((n: any) => ({
        ...n,
        link: n.type === 'admin' ? '/admin/approvals' : n.link
      }))
      setNotifications(mappedData)
    }
  }

  // 2. Fetch recent news as alerts (last 24 hours)
  const fetchNewsAlerts = async () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('adofom_news')
      .select('id, title, content, category, author_name, created_at')
      .gte('created_at', oneDayAgo)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!error && data) {
      const alerts: AppNotification[] = data.map((article: NewsArticle) => ({
        id: `news-${article.id}`,
        title: `📰 ${article.title}`,
        message: `${article.content.substring(0, 80)}${article.content.length > 80 ? '...' : ''} — by ${article.author_name}`,
        type: 'news' as const,
        is_read: false,
        created_at: article.created_at,
        link: '/dashboard/news',
      }))
      setNewsAlerts(alerts)
    }
  }

  // 3. Fetch today's birthday officers
  const fetchBirthdayAlerts = async () => {
    const today = new Date();
    const monthIndex = today.getMonth(); // 0-indexed
    const dayOfMonth = today.getDate();
    const MONTH_NAMES = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const fullMonthName = MONTH_NAMES[monthIndex];
    const shortMonthName = fullMonthName.substring(0, 3);
    const paddedMonth = String(monthIndex + 1).padStart(2, '0');
    const paddedDay = String(dayOfMonth).padStart(2, '0');

    const bdayOrFilter = [
      `birth_month_day.eq.${fullMonthName}/${dayOfMonth}`,
      `birth_month_day.eq.${fullMonthName}/${paddedDay}`,
      `birth_month_day.eq.${shortMonthName}/${paddedDay}`,
      `birth_month_day.eq.${paddedMonth}-${paddedDay}`,
      `birth_month_day.eq.${monthIndex + 1}-${dayOfMonth}`,
      `birth_month_day.eq.${monthIndex + 1}/${dayOfMonth}`,
      `birth_month_day.eq.${paddedMonth}/${paddedDay}`,
    ].join(',');

    const { data, error } = await supabase
      .from('administrative_officers')
      .select('id, full_name')
      .or(bdayOrFilter)

    if (!error && data) {
      const dismissedIds = getDismissedBirthdays();
      const activeBdays = data.filter((officer: any) => !dismissedIds.includes(officer.id));

      const alerts: AppNotification[] = activeBdays.map((officer: any) => ({
        id: `bday-${officer.id}`,
        title: `🎂 Birthday Alert!`,
        message: `It's ${officer.full_name}'s birthday today! Send them some wishes.`,
        type: 'birthday' as const,
        is_read: false,
        created_at: new Date().toISOString(),
        link: `/?profileId=${officer.id}`,
      }))
      setBirthdayAlerts(alerts)
    }
  }

  useEffect(() => {
    fetchNotifications()
    fetchNewsAlerts()
    fetchBirthdayAlerts()
    
    // Real-time subscription for new notifications
    const notifChannel = supabase
      .channel('notif-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, fetchNotifications)
      .subscribe()

    // Real-time subscription for new news articles
    const newsChannel = supabase
      .channel('news-alert-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'adofom_news' }, fetchNewsAlerts)
      .subscribe()

    return () => {
      supabase.removeChannel(notifChannel)
      supabase.removeChannel(newsChannel)
    }
  }, [])

  // 4. Logic to mark as read
  const markAsRead = async (id: string) => {
    if (id.startsWith('news-')) {
      // News alerts — just hide from UI
      setNewsAlerts(prev => prev.filter(n => n.id !== id))
      return
    }
    if (id.startsWith('bday-')) {
      // Birthday alerts — just hide from UI and save in dismissed
      const officerId = id.replace('bday-', '');
      dismissBirthdays([officerId]);
      setBirthdayAlerts(prev => prev.filter(n => n.id !== id))
      return
    }
    
    // For regular notifications, we dismiss locally instead of updating the DB globally
    // so that other officers don't lose their notifications!
    dismissNotifications([id], currentUserId);
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  // 4. Clear All Function
  const executeClearAll = async () => {
    setIsClearing(true)
    
    // Dismiss all currently visible regular notifications locally
    const notifIds = notifications.map(n => n.id);
    if (notifIds.length > 0) {
      dismissNotifications(notifIds, currentUserId);
    }
    
    // Dismiss birthdays locally
    const bdayIds = birthdayAlerts.map(n => n.id.replace('bday-', ''));
    if (bdayIds.length > 0) {
      dismissBirthdays(bdayIds);
    }
    
    // Optimistic UI update
    setNotifications([])
    setNewsAlerts([])
    setBirthdayAlerts([])
    
    toast.success("Notifications cleared!")
    setIsClearing(false)
    setIsConfirmOpen(false)
  }

  const clearAll = () => {
    setIsConfirmOpen(true)
  }

  // Handle clicking a notification with a link
  const handleNotificationClick = (notification: AppNotification) => {
    if (notification.link) {
      if (notification.id.startsWith('bday-')) {
        const officerId = notification.id.replace('bday-', '');
        dismissBirthdays([officerId]);
        setBirthdayAlerts(prev => prev.filter(n => n.id !== notification.id))
      }
      setIsOpen(false)
      router.push(notification.link)
    }
  }

  // Merge all notifications, birthdays first, then news, then system
  const allNotifications = [...birthdayAlerts, ...newsAlerts, ...notifications]
  const unreadCount = birthdayAlerts.length + newsAlerts.length + notifications.filter(n => !n.is_read).length

  return (
    <>
      {/* Trigger Bell */}
      <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
        <Bell className="text-white/80" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-[#0f172a]">
            {unreadCount > 9 ? '9+' : unreadCount}
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
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {allNotifications.length > 0 && (
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
              {allNotifications.length > 0 ? (
                allNotifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 rounded-2xl border transition-all ${
                      n.link ? 'cursor-pointer' : ''
                    } ${
                      n.type === 'news' 
                        ? 'bg-blue-500/10 border-blue-500/20 shadow-lg hover:bg-blue-500/15'
                        : n.type === 'system' && n.link?.includes('profileId')
                          ? 'bg-emerald-500/10 border-emerald-500/20 shadow-lg hover:bg-emerald-500/15'
                          : n.is_read 
                            ? 'bg-white/5 border-white/5 opacity-60' 
                            : 'bg-white/10 border-white/20 shadow-lg hover:bg-white/15'
                    }`}
                    onClick={() => n.link && handleNotificationClick(n)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {n.type === 'birthday' && <Cake className="text-pink-400" size={18} />}
                        {n.type === 'admin' && <ShieldAlert className="text-amber-400" size={18} />}
                        {n.type === 'system' && n.link?.includes('profileId') && <UserPlus className="text-emerald-400" size={18} />}
                        {n.type === 'system' && !n.link?.includes('profileId') && <Info className="text-blue-400" size={18} />}
                        {n.type === 'news' && <Newspaper className="text-blue-400" size={18} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-white">{n.title}</p>
                          {!n.is_read && n.type !== 'news' && (
                            <button onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }} className="p-1 hover:bg-emerald-500/20 rounded text-emerald-400">
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-white/70 mt-1 leading-relaxed">{n.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[10px] text-white/30">{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          {n.link && (
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Tap to view →</span>
                          )}
                        </div>
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
          
          <ConfirmModal
            isOpen={isConfirmOpen}
            title="Clear All Notifications"
            message="Are you sure you want to clear all notifications? This action cannot be undone."
            confirmText="Clear Notifications"
            cancelText="Cancel"
            isDestructive={true}
            isLoading={isClearing}
            onConfirm={executeClearAll}
            onCancel={() => setIsConfirmOpen(false)}
          />
        </>,
        document.body
      )}
    </>
  )
}
