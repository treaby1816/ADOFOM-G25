'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import PhotoUploader from '@/components/ui/PhotoUploader'
import {
  User, Building2, GraduationCap, MapPin,
  Calendar, Phone, Heart, FileText,
  ChevronRight, AlertCircle, CheckCircle2
} from 'lucide-react'

import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'
import { formatBirthday } from '@/lib/dataConsolidation'

export default function SetupProfilePage() {
  const [formData, setFormData] = useState({
    full_name: '',
    current_mda: '',
    grade_level: '',
    lga: '',
    birth_month_day: '',
    phone_number: '',
    secondary_phone_number: '',
    hobbies: '',
    about_me: '',
    photo_url: ''
  })

  const [isLoading, setIsLoading] = useState(true) // Start true for initial check
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [existingAuthStatus, setExistingAuthStatus] = useState<{ is_approved?: boolean, is_admin?: boolean } | null>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const email = user.email?.toLowerCase().trim() || ''
        const whitelistEntry = WHITELIST_OFFICERS[email]

        // 1. Try to fetch existing profile from DB first (use maybeSingle to avoid throw on 0 rows)
        const { data: existingProfile, error: fetchError } = await supabase
          .from('administrative_officers')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (fetchError) {
          console.error("Profile fetch error:", fetchError)
        }

        if (existingProfile) {
          // If profile exists, save existing auth status so we don't overwrite it
          setExistingAuthStatus({
            is_approved: existingProfile.is_approved,
            is_admin: existingProfile.is_admin
          })
          
          // Populate with DB data
          setFormData({
            full_name: existingProfile.full_name || '',
            current_mda: existingProfile.current_mda || '',
            grade_level: existingProfile.grade_level || '',
            lga: existingProfile.lga || '',
            birth_month_day: existingProfile.birth_month_day || '',
            phone_number: existingProfile.phone_number || '',
            secondary_phone_number: existingProfile.secondary_phone_number || '',
            hobbies: existingProfile.hobbies || '',
            about_me: existingProfile.about_me || '',
            photo_url: existingProfile.photo_url || ''
          })
        } else {
          // 2. If no DB record, fallback to Whitelist or Metadata
          setFormData(prev => ({
            ...prev,
            full_name: whitelistEntry?.full_name || user.user_metadata?.full_name || '',
            current_mda: whitelistEntry?.current_mda || '',
            grade_level: whitelistEntry?.grade_level || '',
            lga: whitelistEntry?.lga || '',
            phone_number: whitelistEntry?.phone_number || '',
            secondary_phone_number: '', // Whitelist doesn't have this field
            birth_month_day: whitelistEntry?.birth_month_day || '',
          }))
        }
      } catch (err) {
        console.error("Initialization error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeProfile()
  }, [router, supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (url: string) => {
    setFormData(prev => ({ ...prev, photo_url: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Session expired. Please log in again.')

      const email = user.email?.toLowerCase().trim() || ''
      const whitelistEntry = WHITELIST_OFFICERS[email]
      const isFelix = email === 'felixadewole16@gmail.com'

      // Profile data structure logic
      // We prioritize existing DB status so a profile update doesn't strip admin rights
      const finalApprovedStatus = isFelix || whitelistEntry?.is_approved || existingAuthStatus?.is_approved || false
      const finalAdminStatus = isFelix || whitelistEntry?.is_admin || existingAuthStatus?.is_admin || false

      // Format full name to ensure SURNAME is capitalized
      let formattedName = formData.full_name.trim();
      if (formattedName) {
          const cleanName = formattedName.replace(/,/g, ' ').trim();
          const parts = cleanName.split(/\s+/);
          if (parts.length > 0) {
              const surname = parts[0].toUpperCase();
              const otherNames = parts.slice(1).map(part =>
                  part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
              ).join(' ');
              formattedName = otherNames ? `${surname}, ${otherNames}` : surname;
          }
      }

      const profileData = {
        id: user.id,
        ...formData,
        full_name: formattedName,
        birth_month_day: formatBirthday(formData.birth_month_day),
        email_address: user.email,
        is_approved: finalApprovedStatus,
        is_admin: finalAdminStatus
      }

      const { error: dbError } = await supabase
        .from('administrative_officers')
        .upsert(profileData, { onConflict: 'id' })

      if (dbError) throw dbError

      // Update Auth Metadata to clear the "Needs Setup" guard
      await supabase.auth.updateUser({
        data: { needs_setup: false }
      })

      setSuccess(true)
      setTimeout(() => router.push('/'), 2000)
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving your profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="text-white font-medium animate-pulse uppercase tracking-widest">Loading Profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hero-gradient py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-gold-500 mb-6 transition-colors w-fit"
        >
          ← Back
        </button>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0"></div>

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
                Profile saved successfully! Redirecting...
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <PhotoUploader
                  onUploadComplete={handlePhotoUpload}
                  currentPhotoUrl={formData.photo_url}
                />
              </div>

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
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Phone size={14} /> Sec. Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="secondary_phone_number"
                      value={formData.secondary_phone_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white outline-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-1/3 py-4 border border-white/10 text-slate-400 rounded-2xl hover:bg-white/5 hover:text-white transition-all font-medium uppercase tracking-widest text-xs"
                  >
                    Previous Step
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || success}
                    className="flex-1 py-4 btn-gold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest font-bold"
                  >
                    {isSubmitting ? 'Saving Profile...' : 'Complete Profile Setup'}
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}