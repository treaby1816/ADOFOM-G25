"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  message?: string;
  onComplete?: () => void;
}

export default function SplashScreen({ message = "Authenticating Environment...", onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate a smooth progression for the loading bar
    const duration = 1200; // 1.2s total simulated time minimum
    const interval = 20; // update every 20ms
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          if (onComplete) onComplete();
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        {/* Animated Logo Container */}
        <div className="relative mb-8 animate-float">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-yellow-500/30 blur-xl rounded-full opacity-50 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.2)] bg-white/5 p-1">
            <img
              src="/logo2.jpg"
              alt="ADOFOM Portal"
              className="w-full h-full object-cover rounded-full bg-white"
            />
          </div>
        </div>

        {/* Loading Message */}
        <h2 className="text-white font-black tracking-widest uppercase text-sm mb-2 opacity-90">
          ADOFOM Portal
        </h2>
        <p className="text-emerald-400/80 text-xs tracking-wider mb-8 animate-pulse">
          {message}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5 relative">
          {/* Active Progress */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-yellow-500 rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
          {/* Shine effect passing over the progress bar */}
          <div className="absolute top-0 bottom-0 -left-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
        
        {/* Percentage Counter */}
        <div className="w-full flex justify-end mt-2">
          <span className="text-white/40 text-[10px] font-mono tracking-widest">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
