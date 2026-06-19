"use client";

import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md border-t border-slate-200/50 dark:border-zinc-800/50 py-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-5">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-sm p-1.5">
                    <img src="/logo2.jpg" alt="ADOFOM Logo" className="w-full h-full object-contain rounded-full" />
                </div>

                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200 text-center">
                    &copy; {currentYear} Treabyn Inc. &mdash; ADOFOM E-Platform
                </p>

                <p className="text-[11px] text-center text-slate-400 dark:text-zinc-600 max-w-xs leading-relaxed">
                    An independent initiative. Not affiliated with or endorsed by the Ondo State Government.
                </p>

                <div className="h-px w-16 bg-slate-200 dark:bg-zinc-800 rounded-full" />

                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                    <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        About
                    </Link>
                    <span>&middot;</span>
                    <Link href="/privacy-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        Privacy Policy
                    </Link>
                    <span>&middot;</span>
                    <span
                        className="text-emerald-600 dark:text-emerald-400 font-black tracking-wider transition-colors"
                    >
                        Treabyn Inc
                    </span>
                </div>
            </div>
        </footer>
    );
}
