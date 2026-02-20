export default function ProfileSkeleton() {
    return (
        <div className="h-full group bg-white/50 backdrop-blur-sm rounded-3xl border border-white/40 shadow-sm overflow-hidden flex flex-col animate-pulse">
            {/* Decorative top accent placeholder */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-200/50" />

            {/* Photo Section Skeleton */}
            <div className="flex justify-center pt-8 pb-4 relative">
                <div className="w-32 h-32 rounded-full bg-slate-200" />
            </div>

            {/* Info Section Skeleton */}
            <div className="px-6 pb-6 flex-1 text-center flex flex-col items-center">
                {/* Name */}
                <div className="w-3/4 h-6 bg-slate-200 rounded-md mb-3" />
                {/* MDA badge */}
                <div className="w-1/2 h-6 bg-slate-100 rounded-full mb-3" />
                {/* Grade Level */}
                <div className="w-1/3 h-4 bg-slate-100 rounded-md mb-5" />

                {/* Meta row */}
                <div className="flex items-center justify-center gap-4 w-full">
                    <div className="w-20 h-5 bg-slate-100 rounded-md" />
                    <div className="w-24 h-5 bg-slate-100 rounded-md" />
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="border-t border-slate-100/50 px-5 py-4 flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="w-9 h-9 rounded-full bg-slate-100" />
                    <div className="w-9 h-9 rounded-full bg-slate-100" />
                    <div className="w-9 h-9 rounded-full bg-slate-100" />
                </div>

                <div className="w-28 h-9 rounded-full bg-slate-200" />
            </div>
        </div>
    );
}
