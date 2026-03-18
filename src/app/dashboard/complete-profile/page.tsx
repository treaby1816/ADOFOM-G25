'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import PhotoUploader from '@/components/ui/PhotoUploader'
import { User, Building2, GraduationCap, MapPin, Calendar, Phone, Heart, FileText, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'

import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    full_name: '',
    current_mda: '',
    grade_level: '',
    lga: '',
    birth_month_day: '',
    phone_number: '',
    hobbies: '',
    about_me: '',
    photo_url: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Check whitelist for auto-fill
      const email = user.email?.toLowerCase()
      const whitelistEntry = email ? WHITELIST_OFFICERS[email] : null
      
      setFormData(prev => ({ 
        ...prev, 
        full_name: whitelistEntry?.full_name || user.user_metadata?.full_name || '',
        current_mda: whitelistEntry?.current_mda || '',
        grade_level: whitelistEntry?.grade_level || '',
        lga: whitelistEntry?.lga || '',
        phone_number: whitelistEntry?.phone_number || '',
        birth_month_day: whitelistEntry?.birth_month_day || '',
      }))
    }
    checkUser()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (url: string) => {
    setFormData(prev => ({ ...prev, photo_url: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to complete your profile.')

      const email = user.email?.toLowerCase()
      const whitelistEntry = email ? WHITELIST_OFFICERS[email] : null
      const isFelix = email === 'felixadewole16@gmail.com'

      const profileData = {
        id: user.id,
        ...formData,
        email_address: user.email,
        is_approved: whitelistEntry?.is_approved || isFelix || false,
        is_admin: isFelix || whitelistEntry?.is_admin || false
      }

      const { error: dbError } = await supabase
        .from('administrative_officers')
        .upsert(profileData)

      if (dbError) throw dbError

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err: any) {
      console.error('Profile submission error:', err)
      setError(err.message || 'An error occurred while saving your profile.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0"></div>

        {/* Header Decor */}
        <div className="h-24 bg-white/5 flex items-center px-8 border-b border-white/10">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Setup Official Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-sm font-medium animate-in zoom-in-95 duration-300">
              <CheckCircle2 size={20} />
              Profile saved successfully! Redirecting to dashboard...
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Photo Section */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <PhotoUploader onUploadComplete={handlePhotoUpload} currentPhotoUrl={formData.photo_url} />
            </div>

            {/* Fields Section */}
            <div className="w-full md:w-2/3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <User size={14} /> Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Phone size={14} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500"
                    placeholder="e.g. 08012345678"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Building2 size={14} /> Current MDA
                  </label>
                  <input
                    type="text"
                    name="current_mda"
                    required
                    value={formData.current_mda}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500"
                    placeholder="e.g. Ministry of Finance"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <GraduationCap size={14} /> Grade Level
                  </label>
                  <select
                    name="grade_level"
                    required
                    value={formData.grade_level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white appearance-none"
                  >
                    <option value="" className="bg-slate-900">Select Level</option>
                    {Array.from({ length: 10 }, (_, i) => String(i + 8).padStart(2, '0')).map(level => (
                      <option key={level} value={`GL ${level}`} className="bg-slate-900">GL {level}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <MapPin size={14} /> Local Government (LGA)
                  </label>
                  <input
                    type="text"
                    name="lga"
                    required
                    value={formData.lga}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500"
                    placeholder="e.g. Akure South"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Calendar size={14} /> Birthday (e.g. March/22)
                  </label>
                  <input
                    type="text"
                    name="birth_month_day"
                    required
                    value={formData.birth_month_day}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500"
                    placeholder="Month/Day (e.g. April/15)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Heart size={14} /> Hobbies
                </label>
                <input
                  type="text"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500"
                  placeholder="e.g. Reading, Traveling, Chess"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <FileText size={14} /> About Me
                </label>
                <textarea
                  name="about_me"
                  rows={4}
                  value={formData.about_me}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500 outline-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading || success}
                  className="w-full py-4 btn-gold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                  {isLoading ? 'Saving Profile...' : 'Complete Profile Setup'}
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
