'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CustomSplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if we are in standalone mode (PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    // Only show splash screen once per session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
      setShow(false);
      return;
    }

    sessionStorage.setItem('hasSeenSplash', 'true');

    // Hide after 2.5 seconds
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020617] bg-gradient-to-b from-[#020617] via-[#04112a] to-[#020617] overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
        {/* Logo Container */}
        <div className="relative mb-12 animate-logo-entrance">
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-yellow-600 to-emerald-500 rounded-full blur-xl opacity-40 animate-pulse" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl shadow-black/50 border-2 border-white/10 bg-white animate-logo-breathe z-10" style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}>
            <Image 
              src="/icons/Playstore Icon.png" 
              alt="ADOFOM Logo" 
              fill
              className="object-cover scale-[1.08]"
              priority
              quality={100}
            />
          </div>
        </div>

        {/* Text Container */}
        <div className="text-center space-y-4">
          <h1 
            className="text-2xl md:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-white drop-shadow-lg"
            style={{ fontFamily: "'Playfair Display', 'Times New Roman', serif" }}
          >
            ADOFOM E-PLATFORM
          </h1>
          <p 
            className="text-sm md:text-lg text-yellow-500/90 italic font-medium tracking-wide drop-shadow-md"
            style={{ fontFamily: "'Playfair Display', 'Times New Roman', serif" }}
          >
            Driving Excellence in Administration
          </p>
        </div>
      </div>
      
      {/* Loading indicator */}
      <div className="absolute bottom-16 flex flex-col items-center gap-3 opacity-60">
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-500 to-emerald-500 rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
