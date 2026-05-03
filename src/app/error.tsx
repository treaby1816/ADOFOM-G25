"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full text-center py-12 px-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-2xl">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 mb-8">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-100 mb-4 tracking-tight">
          System Interruption
        </h1>
        
        <p className="text-slate-500 dark:text-zinc-400 mb-10 font-medium leading-relaxed">
          We encountered an unexpected error while processing the directory. This has been logged for our technical team.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCcw size={20} />
            Try Reconnecting
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold rounded-2xl transition-all active:scale-95"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>
        
        {error.digest && (
          <p className="mt-8 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
