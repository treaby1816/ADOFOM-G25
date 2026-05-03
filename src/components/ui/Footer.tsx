"use client";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md border-t border-slate-200/50 dark:border-zinc-800/50 py-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-5">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-sm p-1.5">
                    <img src="/Ondo-Logo.png" alt="Ondo State Logo" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('hidden'); }} />
                </div>

                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200 text-center">
                    &copy; {currentYear} Ondo State Government. Administrative Officers Cadre.
                </p>

                <div className="h-px w-16 bg-slate-200 dark:bg-zinc-800 rounded-full" />

                <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1.5 tracking-wide">
                    Powered by
                    <a 
                        href="https://treabyn.com" 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        className="text-emerald-600 dark:text-emerald-400 font-black tracking-wider text-xs hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                        Treabyn Inc
                    </a>
                </p>
            </div>
        </footer>
    );
}
