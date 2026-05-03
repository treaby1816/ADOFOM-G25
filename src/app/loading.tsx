import ProfileSkeleton from "@/components/ui/ProfileSkeleton";
import { Users } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-green-950/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-[100] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse hidden sm:block" />
        </div>
        <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
      </header>

      {/* Hero Skeleton */}
      <div className="relative h-[350px] bg-green-900/40 animate-pulse flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white/10 mb-6" />
        <div className="h-12 w-2/3 max-w-xl bg-white/10 rounded-xl mb-4" />
        <div className="h-6 w-1/2 max-w-md bg-white/10 rounded-lg" />
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <div className="h-14 w-full bg-white dark:bg-zinc-900 rounded-2xl mb-8 border border-slate-200 dark:border-zinc-800 animate-pulse" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="h-5 w-48 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-10 w-32 bg-slate-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
          {[...Array(10)].map((_, i) => (
            <ProfileSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
