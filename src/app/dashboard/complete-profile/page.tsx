'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import PhotoUploader from '@/components/ui/PhotoUploader'
import { User, Building2, GraduationCap, MapPin, Calendar, Phone, Heart, FileText, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'

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
      setFormData(prev => ({ ...prev, full_name: user.user_metadata?.full_name || '' }))
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

      // Check if administrative_officers record already exists
      const { data: existingRecord, error: fetchError } = await supabase
        .from('administrative_officers')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (fetchError) throw fetchError

      let dbError;
      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('administrative_officers')
          .update({
            ...formData,
            email_address: user.email
          })
          .eq('id', user.id)
        dbError = updateError
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('administrative_officers')
          .insert({
            id: user.id,
            ...formData,
            email_address: user.email
          })
        dbError = insertError
      }

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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {/* Header Decor */}
        <div className="h-24 bg-gradient-to-r from-green-900 to-[#001f3f] flex items-center px-8">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Setup Official Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-in zoom-in-95 duration-300">
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
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <User size={14} /> Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-sm"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Phone size={14} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-sm"
                    placeholder="e.g. 08012345678"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Building2 size={14} /> Current MDA
                  </label>
                  <input
                    type="text"
                    name="current_mda"
                    required
                    value={formData.current_mda}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-sm"
                    placeholder="e.g. Ministry of Finance"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <GraduationCap size={14} /> Grade Level
                  </label>
                  <select
                    name="grade_level"
                    required
                    value={formData.grade_level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-sm appearance-none"
                  >
                    <option value="">Select Level</option>
                    {Array.from({ length: 10 }, (_, i) => String(i + 8).padStart(2, '0')).map(level => (
                      <option key={level} value={`GL ${level}`}>GL {level}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <MapPin size={14} /> Local Government (LGA)
                  </label>
                  <input
                    type="text"
                    name="lga"
                    required
                    value={formData.lga}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-sm"
                    placeholder="e.g. Akure South"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Calendar size={14} /> Birthday (e.g. March/22)
                  </label>
                  <input
                    type="text"
                    name="birth_month_day"
                    required
                    value={formData.birth_month_day}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-sm"
                    placeholder="Month/Day (e.g. April/15)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Heart size={14} /> Hobbies
                </label>
                <input
                  type="text"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-sm"
                  placeholder="e.g. Reading, Traveling, Chess"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FileText size={14} /> About Me
                </label>
                <textarea
                  name="about_me"
                  rows={4}
                  value={formData.about_me}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-sm outline-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading || success}
                  className="w-full py-4 bg-[#001f3f] hover:bg-green-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl hover:shadow-green-900/40 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
