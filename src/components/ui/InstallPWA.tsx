"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

// Safari share icon as inline SVG — matches what iOS users see on screen
const SafareShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block w-4 h-4 mx-1 text-blue-500 align-middle"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed as standalone app
    const isAppStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isAppStandalone);
    if (isAppStandalone) return;

    // Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    // Also check it's Safari (not Chrome/Firefox on iOS which can't install)
    const isSafari = /safari/.test(ua) && !/chrome|crios|fxios/.test(ua);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Show iOS instruction banner only in Safari (other browsers can't install)
      if (isSafari) {
        const hasDismissed = localStorage.getItem("adofom_pwa_dismissed");
        if (!hasDismissed) {
          // Short delay so it doesn't pop up immediately
          setTimeout(() => setIsVisible(true), 3500);
        }
      }
      return; // Don't listen for Android prompt on iOS
    }

    // Android / Chrome — listen for native install prompt
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
      promptInstall.prompt();
      const { outcome } = await promptInstall.userChoice;
      setIsVisible(false);
      setPromptInstall(null);
    } catch (err) {
      console.error("PWA Install error:", err);
      setIsVisible(false);
      setPromptInstall(null);
    }
  };

  const onDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("adofom_pwa_dismissed", "true");
  };

  if (!isVisible || isStandalone) return null;

  // ── iOS Instruction Banner ──────────────────────────────────────────────
  if (isIOS) {
    return (
      <>
        {/* Backdrop blur overlay */}
        <div className="fixed inset-0 bg-black/20 z-[9998]" onClick={onDismiss} />

        {/* Banner anchored to bottom with upward arrow pointing at Safari share button */}
        <div className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-6 pt-3 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-700 shadow-2xl rounded-t-3xl">
          {/* Arrow pointing toward the Safari toolbar at the bottom */}
          <div className="flex justify-center mb-3">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-blue-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 bg-slate-100 dark:bg-zinc-800 rounded-full transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-4 max-w-sm mx-auto">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <img src="/icons/icon-192.png" alt="ADOFOM" className="w-9 h-9 rounded-xl object-cover" />
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                Install ADOFOM on your iPhone
              </h4>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed flex items-center gap-1 flex-wrap">
                  <span className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded-md text-[10px]">1</span>
                  Tap the Share button
                  <SafareShareIcon />
                  at the bottom of Safari
                </p>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed flex items-center gap-1 flex-wrap">
                  <span className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded-md text-[10px]">2</span>
                  Scroll down and tap{" "}
                  <strong className="text-slate-800 dark:text-white">"Add to Home Screen"</strong>
                </p>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed flex items-center gap-1">
                  <span className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded-md text-[10px]">3</span>
                  Tap <strong className="text-slate-800 dark:text-white">"Add"</strong> — done! 🎉
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-400 dark:text-zinc-600 mt-4 font-medium">
            Only works in Safari · Tap outside to dismiss
          </p>
        </div>
      </>
    );
  }

  // ── Android / Chrome Install Banner ────────────────────────────────────
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[9999] bg-white dark:bg-zinc-900 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl">
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
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3 leading-relaxed">
            Install this platform to your device for a faster, full-screen mobile app experience.
          </p>

          {supportsPWA && (
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
