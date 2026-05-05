'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'
import {
  Newspaper, Loader2, Pin, Calendar, Plus, X, Send,
  Megaphone, CalendarDays, Info, Sparkles, Trash2, ChevronDown
} from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  content: string
  category: string
  author_name: string
  pinned: boolean
  image_url: string | null
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  { value: 'general', label: 'General', icon: Info, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { value: 'announcement', label: 'Announcement', icon: Megaphone, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { value: 'event', label: 'Event', icon: CalendarDays, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { value: 'update', label: 'Update', icon: Sparkles, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
] as const

function getCategoryMeta(cat: string) {
  return CATEGORIES.find(c => c.value === cat) || CATEGORIES[0]
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getDriveViewUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (!url.includes('drive.google.com/open?id=')) return url
  const id = url.split('id=')[1]
  return id ? `/api/image-proxy?id=${id}` : url
}

export default function NewsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showComposer, setShowComposer] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Compose form state
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [newCategory, setNewCategory] = useState('general')
  const [newPinned, setNewPinned] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('adofom_news')
      .select('*')
      .eq('is_published', true)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && data) setArticles(data as NewsArticle[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const userEmail = user.email?.trim().toLowerCase() || ''
        const whitelistEntry = WHITELIST_OFFICERS[userEmail]
        if (whitelistEntry?.is_admin) {
          setIsAdmin(true)
          return
        }
        const { data } = await supabase
          .from('administrative_officers')
          .select('is_admin, exco_portfolio')
          .eq('id', user.id)
          .maybeSingle()
        
        const isPRO = data?.exco_portfolio && (
          data.exco_portfolio.toUpperCase().includes('PRO') || 
          data.exco_portfolio.toUpperCase().includes('P.R.O') ||
          data.exco_portfolio.toUpperCase().includes('PUBLIC RELATIONS')
        );

        if (data?.is_admin || isPRO) setIsAdmin(true)
      }
    }
    checkAdmin()
    fetchNews()
  }, [supabase, fetchNews])

  // Realtime subscription — sync news across all devices (browser + Android)
  useEffect(() => {
    const channel = supabase
      .channel('adofom_news_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'adofom_news' },
        () => {
          // Re-fetch the full list on any INSERT, UPDATE, or DELETE
          fetchNews()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchNews])

  const handlePublish = async () => {
    if (!newTitle.trim() || !newContent.trim()) return
    setPublishing(true)
    setPublishError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setPublishError('Not authenticated'); setPublishing(false); return }

      const { data: profile } = await supabase
        .from('administrative_officers')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle()

      let finalImageUrl: string | null = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `news/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('avatars') // Using existing public bucket
          .upload(fileName, selectedFile)

        if (uploadError) {
          throw new Error('Failed to upload image: ' + uploadError.message)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)
          
        finalImageUrl = publicUrl
      }

      const { error } = await supabase.from('adofom_news').insert({
        title: newTitle.trim(),
        content: newContent.trim(),
        image_url: finalImageUrl,
        category: newCategory,
        pinned: newPinned,
        is_published: true,
        author_id: user.id,
        author_name: profile?.full_name || 'ADOFOM Admin',
      })

      if (error) {
        setPublishError(error.message)
      } else {
        setNewTitle('')
        setNewContent('')
        setSelectedFile(null)
        setNewCategory('general')
        setNewPinned(false)
        setShowComposer(false)
        setPublishError(null)
        await fetchNews()
      }
    } catch (err: any) {
      setPublishError(err.message || 'Network error. Please try again.')
    }
    setPublishing(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    const { error } = await supabase.from('adofom_news').delete().eq('id', id)
    if (!error) {
      setArticles(prev => prev.filter(a => a.id !== id))
    }
  }

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear ALL news history? This cannot be undone.')) return
    
    // Delete all records where id is not null (which deletes all rows)
    const { error } = await supabase.from('adofom_news').delete().not('id', 'is', null)
    
    if (!error) {
      setArticles([])
    } else {
      alert('Failed to clear history: ' + error.message)
    }
  }

  const filtered = filterCategory === 'all'
    ? articles
    : articles.filter(a => a.category === filterCategory)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 px-3 py-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-in fade-in duration-500">

        {/* Page Header — mobile-optimized */}
        <div className="text-center space-y-2 sm:space-y-3 py-4 sm:py-6">
          <div className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl mb-1 sm:mb-2">
            <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 dark:text-zinc-100 tracking-tight">
            ADOFOM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">News</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 font-medium max-w-xl mx-auto px-2">
            Stay informed with announcements, events, and updates from the Forum.
          </p>
        </div>

        {/* Admin Composer Toggle — full-width on mobile */}
        {isAdmin && (
          <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3">
            <button
              onClick={() => { setShowComposer(!showComposer); setPublishError(null) }}
              className={`flex items-center gap-2 w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md active:scale-95 ${
                showComposer
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
              }`}
            >
              {showComposer ? <X size={16} /> : <Plus size={16} />}
              {showComposer ? 'Cancel' : 'Publish News'}
            </button>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 rounded-xl font-bold text-sm bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all duration-200 shadow-md active:scale-95"
            >
              <Trash2 size={16} />
              Clear History
            </button>
          </div>
        )}

        {/* Admin Composer Form — mobile responsive */}
        {isAdmin && showComposer && (
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] border border-white/80 dark:border-zinc-800 shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <Send size={16} className="text-blue-500 shrink-0" />
              Compose Article
            </h3>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter a headline..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm sm:text-base text-slate-800 dark:text-zinc-100 font-semibold placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Content</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write the full article content..."
                rows={5}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm sm:text-base text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Attach Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm sm:text-base text-slate-800 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {selectedFile && <p className="text-xs text-slate-500 mt-2 font-medium">Selected: {selectedFile.name}</p>}
            </div>

            {/* Category + Pin — stacks vertically on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
              <div className="w-full sm:flex-1">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm sm:text-base text-slate-800 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors w-full sm:w-auto justify-center sm:justify-start">
                <input
                  type="checkbox"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="accent-yellow-500 w-4 h-4"
                />
                <Pin size={14} className="text-yellow-500" />
                <span className="text-sm font-bold text-slate-600 dark:text-zinc-300">Pin to Top</span>
              </label>
            </div>

            {/* Error display */}
            {publishError && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-xl px-4 py-3 font-medium">
                {publishError}
              </div>
            )}

            <button
              onClick={handlePublish}
              disabled={publishing || !newTitle.trim() || !newContent.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-sm sm:text-base"
            >
              {publishing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {publishing ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        )}

        {/* Category Filter Tabs — horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="flex gap-2 justify-start sm:justify-center min-w-max sm:min-w-0 sm:flex-wrap pb-1">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                filterCategory === 'all'
                  ? 'bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg'
                  : 'bg-white/60 dark:bg-zinc-900/60 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.value}
                  onClick={() => setFilterCategory(cat.value)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                    filterCategory === cat.value
                      ? 'bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg'
                      : `bg-white/60 dark:bg-zinc-900/60 border ${cat.color} hover:opacity-80`
                  }`}
                >
                  <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* News Feed */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-blue-500" />
            <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">Loading News...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-3 sm:gap-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] border border-white/80 dark:border-zinc-800 px-6">
            <div className="p-3 sm:p-4 bg-slate-100 dark:bg-zinc-800 rounded-full">
              <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-600 dark:text-zinc-400 text-center">No news articles yet.</p>
            {isAdmin && (
              <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-500 text-center">Tap &quot;Publish News&quot; to create the first article.</p>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filtered.map((article) => {
              const catMeta = getCategoryMeta(article.category)
              const CatIcon = catMeta.icon
              const isExpanded = expandedId === article.id
              const isLong = article.content.length > 300

              return (
                <article
                  key={article.id}
                  className={`group relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl sm:rounded-[1.5rem] border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    article.pinned
                      ? 'border-yellow-300/60 dark:border-yellow-600/40 ring-1 ring-yellow-200/30 dark:ring-yellow-700/20'
                      : 'border-white/80 dark:border-zinc-800'
                  }`}
                >
                  {/* Pinned indicator */}
                  {article.pinned && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400" />
                  )}

                  <div className="p-4 sm:p-6 md:p-8">
                    {/* Top meta row */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      {article.pinned && (
                        <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-yellow-200 dark:border-yellow-700/50">
                          <Pin size={8} className="sm:w-2.5 sm:h-2.5" /> Pinned
                        </span>
                      )}
                      <span className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${catMeta.color}`}>
                        <CatIcon size={8} className="sm:w-2.5 sm:h-2.5" /> {catMeta.label}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-slate-400 dark:text-zinc-500 ml-auto">
                        <Calendar size={8} className="sm:w-2.5 sm:h-2.5" /> {timeAgo(article.created_at)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 dark:text-zinc-100 leading-tight mb-2 sm:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h2>

                    {/* Content */}
                    <div className="relative">
                      <p className={`text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap ${
                        !isExpanded && isLong ? 'line-clamp-4' : ''
                      }`}>
                        {article.content}
                      </p>
                      
                      {article.image_url && (!isLong || isExpanded) && (
                        <div className="mt-4 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800/80 shadow-sm bg-slate-50 dark:bg-zinc-900/50 flex justify-center">
                          <img 
                            src={getDriveViewUrl(article.image_url)} 
                            alt={article.title}
                            className="max-h-[400px] w-auto object-contain bg-black/5" 
                            loading="lazy"
                          />
                        </div>
                      )}

                      {isLong && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : article.id)}
                          className="flex items-center gap-1 mt-2 text-xs font-bold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-95"
                        >
                          <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          {isExpanded ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-zinc-500">
                        By <span className="text-slate-600 dark:text-zinc-300">{article.author_name}</span>
                      </p>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-500 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
