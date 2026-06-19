"use client";

import { useState, useEffect, useMemo, useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProfileCard from "@/components/ui/ProfileCard";
import ProfileModal from "@/components/ui/ProfileModal";
import SearchAndFilter from "@/components/filters/SearchAndFilter";
import ExportButton from "@/components/ui/ExportButton";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";
import ScrollButtons from "@/components/ui/ScrollButtons";
import { Officer } from "@/types/officer";
import { Users, ChevronLeft, ChevronRight, AlertCircle, Search as SearchIcon } from "lucide-react";
import BirthdayBanner from "@/components/ui/BirthdayBanner";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 20;

interface DashboardClientProps {
  initialOfficers: Officer[];
  initialTotalCount: number;
  allOfficers: Officer[];
  initialBirthdayOfficers: Officer[];
  isAdmin: boolean;
  queryParam: string;
  lgaParam: string;
  mdaParam: string;
  monthParam: string;
  setParam: string;
  sortParam: string;
  pageParam: number;
}

const getDismissedBirthdays = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem("adofom_dismissed_birthdays");
    if (stored) {
      const parsed = JSON.parse(stored);
      const todayStr = new Date().toDateString();
      if (parsed.date === todayStr) {
        return parsed.ids || [];
      }
    }
  } catch (e) {
    console.error(e);
  }
  return [];
};

const dismissBirthdays = (ids: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    const todayStr = new Date().toDateString();
    const current = getDismissedBirthdays();
    const updatedIds = Array.from(new Set([...current, ...ids]));
    localStorage.setItem("adofom_dismissed_birthdays", JSON.stringify({
      date: todayStr,
      ids: updatedIds
    }));
  } catch (e) {
    console.error(e);
  }
};

export default function DashboardClient({
  initialOfficers,
  initialTotalCount,
  allOfficers: initialAllOfficers,
  initialBirthdayOfficers,
  isAdmin,
  queryParam,
  lgaParam,
  mdaParam,
  monthParam,
  setParam,
  sortParam,
  pageParam
}: DashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for immediate UI feedback (search input)
  const [searchInput, setSearchInput] = useState(queryParam);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [officers, setOfficers] = useState<Officer[]>(initialOfficers);
  const [allOfficers, setAllOfficers] = useState<Officer[]>(initialAllOfficers);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  
  const [birthdayOfficers, setBirthdayOfficers] = useState<Officer[]>(() => {
    const dismissedIds = getDismissedBirthdays();
    return initialBirthdayOfficers.filter(o => !dismissedIds.includes(o.id));
  });

  // Sync search input with URL if URL changes externally
  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  // When props change (Server Component re-rendered), update local state
  useEffect(() => {
    setOfficers(initialOfficers);
  }, [initialOfficers]);

  // Update URL when filters change
  const updateFilters = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    // Reset to page 1 if any filter other than page changes
    if (!updates.page) {
      params.set("page", "1");
    }

    startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });

    // Scroll to results area when page changes
    if (updates.page) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  }, [searchParams, pathname, router]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearch !== queryParam) {
      updateFilters({ q: debouncedSearch });
    }
  }, [debouncedSearch, queryParam, updateFilters]);

  const totalPages = Math.ceil(initialTotalCount / ITEMS_PER_PAGE);

  // Automatically open profile if profileId query param is present
  const profileIdParam = searchParams.get("profileId") || "";
  useEffect(() => {
    if (profileIdParam && allOfficers.length > 0) {
      const officer = allOfficers.find(o => o.id === profileIdParam);
      if (officer) {
        setSelectedOfficer(officer);
        // Clear parameter from URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("profileId");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [profileIdParam, allOfficers, router, pathname, searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
      
      {/* Search & Filters */}
      <SearchAndFilter
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        lgaFilter={lgaParam}
        onLgaChange={(val) => updateFilters({ lga: val })}
        monthFilter={monthParam}
        onMonthChange={(val) => updateFilters({ month: val })}
        mdaFilter={mdaParam}
        onMdaChange={(val) => updateFilters({ mda: val })}
        setFilter={setParam}
        onSetChange={(val) => updateFilters({ set: val })}
        sortOption={sortParam}
        onSortChange={(val) => updateFilters({ sort: val })}
        officers={allOfficers}
      />

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <Users size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Personnel Registry</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
              Displaying <span className="text-emerald-600 font-bold">{initialTotalCount}</span> registered officers
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ExportButton officers={allOfficers} />
        </div>
      </div>

      {/* Loading Overlay or Grid */}
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProfileSkeleton key={i} />
          ))}
        </div>
      ) : officers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {officers.map((officer, index) => (
            <div
              key={officer.id}
              className="card-enter"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProfileCard
                officer={officer}
                onViewProfile={setSelectedOfficer}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] border border-slate-200 dark:border-zinc-800 shadow-xl">
          <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchIcon size={40} className="text-slate-300 dark:text-zinc-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-100 mb-2">No Matches Found</h3>
          <p className="text-slate-500 dark:text-zinc-400 font-medium mb-8">
            Adjust your filters or try a different search term.
          </p>
          <button 
            onClick={() => updateFilters({ q: "", lga: "", mda: "", month: "", set: "" })}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!isPending && totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-16 px-2">
          <button
            onClick={() => updateFilters({ page: pageParam - 1 })}
            disabled={pageParam === 1}
            className="p-3 rounded-2xl bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 disabled:opacity-30 transition-all cursor-pointer flex-shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              if (totalPages > 5 && Math.abs(p - pageParam) > 1 && p !== 1 && p !== totalPages) {
                if (Math.abs(p - pageParam) === 2) return <span key={p} className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-zinc-500">...</span>;
                return null;
              }
              return (
                <button
                  key={p}
                  onClick={() => updateFilters({ page: p })}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${
                    pageParam === p 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-110" 
                      : "bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => updateFilters({ page: pageParam + 1 })}
            disabled={pageParam === totalPages}
            className="p-3 rounded-2xl bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 disabled:opacity-30 transition-all cursor-pointer flex-shrink-0"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Overlays */}
      {birthdayOfficers.length > 0 && (
        <BirthdayBanner
          officers={birthdayOfficers}
          onClose={() => {
            const ids = birthdayOfficers.map(o => o.id);
            dismissBirthdays(ids);
            setBirthdayOfficers([]);
          }}
          onViewProfile={(officer) => {
            const ids = birthdayOfficers.map(o => o.id);
            dismissBirthdays(ids);
            setSelectedOfficer(officer);
            setBirthdayOfficers([]);
          }}
        />
      )}

      {selectedOfficer && (
        <ProfileModal
          officer={selectedOfficer}
          onClose={() => setSelectedOfficer(null)}
          onOfficerUpdated={(updated) => {
            setOfficers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
            setSelectedOfficer(updated);
            setAllOfficers(prev => prev.map(o => o.id === updated.id ? updated : o));
          }}
        />
      )}

      <ScrollButtons />
    </div>
  );
}
