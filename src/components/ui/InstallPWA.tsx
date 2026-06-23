"use client";

import { useState, useEffect } from "react";
import { Download, X, Share } from "lucide-react";

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isAppStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                            (window.navigator as any).standalone === true;
    setIsStandalone(isAppStandalone);

    if (isAppStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // iOS does not support programmatic install prompts. 
    // Showing a popup with a fake button causes user confusion, so we disable it for iOS completely.
    if (isIosDevice) return;

    // Android / Chrome - Listen for native prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
      
      const hasDismissed = localStorage.getItem("adofom_pwa_dismissed");
      if (!hasDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClickInstall = async () => {
    if (!promptInstall) {
      setIsVisible(false);
      return;
    }

    try {
      // Show the native prompt synchronously during the user gesture
      promptInstall.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await promptInstall.userChoice;
      
      // Regardless of outcome (accepted or dismissed), hide the custom banner
      setIsVisible(false);
      
      // The beforeinstallprompt event can only be used once
      setPromptInstall(null);
    } catch (err) {
      console.error("PWA Install error:", err);
      // If the prompt fails (e.g. was already consumed), hide our custom banner so it isn't stuck
      setIsVisible(false);
      setPromptInstall(null);
    }
  };

  const onDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("adofom_pwa_dismissed", "true");
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[9999] bg-white dark:bg-zinc-900 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl animate-slide-up">
      <button 
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 bg-slate-100 dark:bg-zinc-800 rounded-full transition-colors"
      >
        <X size={16} />
      </button>
      
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center shrink-0">
          <Download className="text-emerald-600 dark:text-emerald-400" size={24} />
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Install ADOFOM App
          </h4>
          
          {isIOS ? (
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3 leading-relaxed">
              Install this app on your device for quick access. Tap <Share size={12} className="inline mx-1" /> and then <strong>"Add to Home Screen"</strong>.
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3 leading-relaxed">
              Install this platform to your device for a faster, full-screen mobile app experience.
            </p>
          )}

          {!isIOS && supportsPWA && (
            <button
              onClick={onClickInstall}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              Install App Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
