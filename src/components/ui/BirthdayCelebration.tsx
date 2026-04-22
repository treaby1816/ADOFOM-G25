'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { Cake } from 'lucide-react'
import { getTodayCelebrants } from '@/lib/celebrants'

export default function BirthdayCelebration() {
  const [celebrants, setCelebrants] = useState<{full_name: string}[]>([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fetchCelebrants = async () => {
      const data = await getTodayCelebrants()
      if (data && data.length > 0) {
        setCelebrants(data)
        setShow(true)
        triggerConfetti()
      }
    }
    fetchCelebrants()
  }, [])

  const triggerConfetti = () => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)

      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } })
    }, 250)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-green-700 via-emerald-600 to-green-900 p-8 rounded-3xl border border-white/20 shadow-2xl text-center max-w-lg w-full relative">
        <button onClick={() => setShow(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">✕</button>
        
        <div className="mb-4 inline-block p-4 bg-emerald-500/20 rounded-full">
          <Cake className="text-emerald-400" size={48} />
        </div>
        
        <h2 className="text-3xl font-black text-white mb-2">Today's Celebrants!</h2>
        <div className="space-y-2 mt-4">
          {celebrants.map((c, i) => (
            <p key={i} className="text-xl font-bold text-emerald-200">
              🎉 {c.full_name}
            </p>
          ))}
        </div>
        <p className="mt-6 text-white/60 italic text-sm">Wishing you a wonderful year ahead from the ADOFOM Team.</p>
      </div>
    </div>
  )
}
