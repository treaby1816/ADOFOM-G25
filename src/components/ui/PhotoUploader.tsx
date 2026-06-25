'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X, Check } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface PhotoUploaderProps {
  onUploadComplete: (url: string) => void
  currentPhotoUrl?: string
}

export default function PhotoUploader({ onUploadComplete, currentPhotoUrl }: PhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB.')
      return
    }

    setIsUploading(true)
    setError(null)

    // Create a local preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `officer-photos/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('officer-photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('officer-photos')
        .getPublicUrl(filePath)

      onUploadComplete(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload photo')
      setPreviewUrl(currentPhotoUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div 
          onClick={triggerFileInput}
          className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 bg-slate-100 dark:bg-zinc-900 overflow-hidden relative ${
            previewUrl ? 'border-emerald-500/50' : 'border-slate-300 dark:border-zinc-700 hover:border-yellow-500/50'
          }`}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-slate-400 dark:text-zinc-500">
              <Camera size={32} className="mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Photo</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <Upload size={20} />
          </div>
        </div>

        {previewUrl && !isUploading && (
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white dark:border-zinc-950 shadow-lg">
            <Check size={12} strokeWidth={4} />
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      {error ? (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      ) : (
        <p className="text-xs text-slate-500 font-medium">Click to upload official photo (Max 2MB)</p>
      )}
    </div>
  )
}
