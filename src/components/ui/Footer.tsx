"use client";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md border-t border-slate-200/50 dark:border-zinc-800/50 py-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 bg-white/20 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mask-logo overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-sm p-1">
                    <img src="/ondo-logo.png" alt="Ondo State Logo" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('hidden'); }} />
                </div>

                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200 text-center">
                    &copy; {currentYear} Ondo State Government. Administrative Officers Cadre.
                </p>

                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5 justify-center">
                    Engineered by
                    <span className="text-green-600 dark:text-emerald-400 font-black tracking-wider text-sm transition-colors hover:text-green-700 dark:hover:text-emerald-300">
                        Treabyn
                    </span>
                </p>
            </div>
        </footer>
    );
}
