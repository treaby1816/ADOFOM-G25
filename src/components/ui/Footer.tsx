"use client";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border-t border-slate-200/50 dark:border-zinc-800/50 py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-2">
                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200 text-center">
                    &copy; {currentYear} Ondo State Government. Administrative Officers Cadre.
                </p>

                <p className="text-xs font-bold text-slate-600 dark:text-zinc-300 mt-1 flex items-center gap-1.5 justify-center">
                    Engineered by
                    <span className="text-green-600 dark:text-emerald-400 font-black tracking-wider text-sm">
                        Treabyn
                    </span>
                </p>
            </div>
        </footer>
    );
}
