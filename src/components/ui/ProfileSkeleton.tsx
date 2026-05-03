export default function ProfileSkeleton() {
    return (
        <div className="h-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 dark:border-zinc-800/60 shadow-sm overflow-hidden flex flex-col relative">
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            
            {/* Photo Section Skeleton */}
            <div className="flex justify-center pt-10 pb-6 relative">
                <div className="w-32 h-32 rounded-full bg-slate-200/50 dark:bg-zinc-800/50 ring-4 ring-white/50 dark:ring-zinc-800/50" />
            </div>

            {/* Info Section Skeleton */}
            <div className="px-6 pb-8 flex-1 text-center flex flex-col items-center">
                {/* Name */}
                <div className="w-3/4 h-7 bg-slate-200/60 dark:bg-zinc-800/60 rounded-xl mb-4" />
                {/* MDA badge */}
                <div className="w-1/2 h-6 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full mb-6" />
                
                {/* Stats placeholders */}
                <div className="flex gap-3 w-full justify-center">
                    <div className="w-16 h-4 bg-slate-100/50 dark:bg-zinc-800/40 rounded-lg" />
                    <div className="w-20 h-4 bg-slate-100/50 dark:bg-zinc-800/40 rounded-lg" />
                </div>
            </div>

            {/* Footer Actions Skeleton */}
            <div className="border-t border-slate-100/40 dark:border-zinc-800/40 px-6 py-5 flex items-center justify-between bg-slate-50/30 dark:bg-zinc-900/20">
                <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100/60 dark:bg-zinc-800/60" />
                    <div className="w-10 h-10 rounded-full bg-slate-100/60 dark:bg-zinc-800/60" />
                </div>
                <div className="w-28 h-10 rounded-2xl bg-slate-200/60 dark:bg-zinc-800/60" />
            </div>
        </div>
    );
}
