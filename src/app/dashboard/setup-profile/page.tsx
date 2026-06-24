'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import PhotoUploader from '@/components/ui/PhotoUploader'
import {
  User, Building2, GraduationCap, MapPin,
  Calendar, Phone, Heart, FileText,
  ChevronRight, AlertCircle, CheckCircle2,
  Award, Briefcase
} from 'lucide-react'

import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'
import { normalizeMDA, normalizeLGA, ONDO_LGAS, ONDO_MDAS } from '@/lib/dataConsolidation'
import BirthdaySelect, { parseBirthdayValue, formatBirthdayValue, isValidBirthday } from '@/components/ui/BirthdaySelect'

export default function SetupProfilePage() {
  const [formData, setFormData] = useState({
    full_name: '',
    current_mda: '',
    grade_level: '',
    lga: '',
    phone_number: '',
    secondary_phone_number: '',
    hobbies: '',
    about_me: '',
    photo_url: '',
    induction_year: '',
    professional_certificate: '',
    professional_bodies: ''
  })

  const [birthday, setBirthday] = useState('')
  const [birthdayError, setBirthdayError] = useState<string | null>(null)

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
            phone_number: existingProfile.phone_number || '',
            secondary_phone_number: existingProfile.secondary_phone_number || '',
            hobbies: existingProfile.hobbies || '',
            about_me: existingProfile.about_me || '',
            photo_url: existingProfile.photo_url || '',
            induction_year: existingProfile.induction_year || '',
            professional_certificate: existingProfile.professional_certificate || '',
            professional_bodies: existingProfile.professional_bodies || ''
          })
          
          if (existingProfile.birth_month_day) {
            const bdayObj = parseBirthdayValue(existingProfile.birth_month_day);
            if (bdayObj.month && bdayObj.day) {
              setBirthday(formatBirthdayValue(bdayObj.month, bdayObj.day))
            }
          }
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
          }))
          
          if (whitelistEntry?.birth_month_day) {
            const bdayObj = parseBirthdayValue(whitelistEntry.birth_month_day);
            if (bdayObj.month && bdayObj.day) {
              setBirthday(formatBirthdayValue(bdayObj.month, bdayObj.day))
            }
          }
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

      // Validate birthday
      if (birthday && !isValidBirthday(birthday)) {
        setBirthdayError('Please select a valid month and day.')
        setIsSubmitting(false)
        return
      }
      setBirthdayError(null)

      const profileData = {
        id: user.id,
        ...formData,
        full_name: formattedName,
        current_mda: normalizeMDA(formData.current_mda),
        lga: normalizeLGA(formData.lga),
        birth_month_day: birthday || '',
        email_address: user.email,
        is_approved: finalApprovedStatus,
        is_admin: finalAdminStatus,
        needs_password_change: false
      }

      const { error: dbError } = await supabase
        .from('administrative_officers')
        .upsert(profileData, { onConflict: 'id' })

      if (dbError) throw dbError

      // Update Auth Metadata to clear the "Needs Setup" guard
      await supabase.auth.updateUser({
        data: { needs_setup: false }
      })

      // Send notification to admin about new officer signup (non-blocking)
      if (!finalApprovedStatus) {
        try {
          await supabase.from('notifications').insert({
            title: '🆕 New Officer Registration',
            message: `${formattedName || 'A new officer'} (${user.email}) has registered and is awaiting your approval.`,
            type: 'admin',
            is_read: false,
          })
        } catch (notifErr) {
          console.warn('Failed to send admin notification:', notifErr)
        }
      }

      setSuccess(true)
      setTimeout(() => {
        if (finalApprovedStatus) {
          router.push('/')
        } else {
          router.push('/pending-approval')
        }
      }, 2000)
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
                    <select
                      name="current_mda"
                      required
                      value={formData.current_mda}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white appearance-none"
                    >
                      <option value="" className="bg-slate-900">-- Select MDA --</option>
                      {ONDO_MDAS.map(mda => (
                        <option key={mda} value={mda} className="bg-slate-900">{mda}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <GraduationCap size={14} /> Grade Level / Retired
                    </label>
                    <select
                      name="grade_level"
                      required
                      value={formData.grade_level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white appearance-none"
                    >
                      <option value="" className="bg-slate-900">Select Level</option>
                      {Array.from({ length: 10 }, (_, i) => String(i + 8).padStart(2, '0'))
                        .filter(level => level !== '08' && level !== '11')
                        .map(level => (
                        <option key={level} value={`GL ${level}`} className="bg-slate-900">GL {level}</option>
                      ))}
                      <option value="Retired" className="bg-slate-900 text-yellow-500 font-bold">Retired</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Briefcase size={14} /> ADOFOM Set (Induction Year)
                    </label>
                    <select
                      name="induction_year"
                      required
                      value={formData.induction_year}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white appearance-none"
                    >
                      <option value="" className="bg-slate-900">Select Year</option>
                      {Array.from({ length: 2026 - 1960 + 1 }, (_, i) => String(2026 - i)).map(year => (
                        <option key={year} value={year} className="bg-slate-900">{year} Set</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <MapPin size={14} /> Local Government (LGA)
                    </label>
                    <select
                      name="lga"
                      required
                      value={formData.lga}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white appearance-none"
                    >
                      <option value="" className="bg-slate-900">-- Select LGA --</option>
                      {ONDO_LGAS.map(lga => (
                        <option key={lga} value={lga} className="bg-slate-900">{lga}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Calendar size={14} /> Birthday
                    </label>
                    <BirthdaySelect
                      value={birthday}
                      onChange={setBirthday}
                      error={birthdayError || undefined}
                      variant="dark"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Award size={14} /> Professional Certificate (Optional)
                    </label>
                    <input
                      type="text"
                      name="professional_certificate"
                      value={formData.professional_certificate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500"
                      placeholder="e.g. CIPM, ICAN, ACCA, COREN"
                    />
                    <p className="text-[10px] text-slate-500">Acronyms accepted — separate multiple certificates with commas</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Briefcase size={14} /> Professional Bodies (Optional)
                    </label>
                    <textarea
                      name="professional_bodies"
                      rows={3}
                      value={formData.professional_bodies}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all text-sm text-white placeholder-slate-500 resize-none outline-none"
                      placeholder="e.g. Nigerian Institute of Management, Chartered Institute of Personnel Management of Nigeria"
                    />
                    <p className="text-[10px] text-slate-500">Use full body name — separate multiple bodies with commas</p>
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