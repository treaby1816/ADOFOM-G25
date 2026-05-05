"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ProfileCard from "@/components/ui/ProfileCard";
import ProfileModal from "@/components/ui/ProfileModal";
import SearchAndFilter from "@/components/filters/SearchAndFilter";
import ImageSlider from "@/components/ui/ImageSlider";
import WelcomeScreen from "@/components/ui/WelcomeScreen";
import ExportButton from "@/components/ui/ExportButton";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";
import ScrollButtons from "@/components/ui/ScrollButtons";
import NavigationDrawer from "@/components/ui/NavigationDrawer";
import NotificationDrawer from "@/components/ui/NotificationDrawer";
import { Officer } from "@/types/officer";
import { Users, Shield, ChevronLeft, ChevronRight, AlertCircle, Search as SearchIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { normalizeLGA, normalizeMDA, formatBirthday, isBirthdayToday } from "@/lib/dataConsolidation";
import { WHITELIST_OFFICERS } from "@/lib/whitelist-data";
import BirthdayBanner from "@/components/ui/BirthdayBanner";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 20;

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // State from URL
  const queryParam = searchParams.get("q") || "";
  const lgaParam = searchParams.get("lga") || "";
  const mdaParam = searchParams.get("mda") || "";
  const monthParam = searchParams.get("month") || "";
  const sortParam = searchParams.get("sort") || "name-asc";
  const pageParam = parseInt(searchParams.get("page") || "1");

  // Local state for immediate UI feedback (search input)
  const [searchInput, setSearchInput] = useState(queryParam);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Data state
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [birthdayOfficers, setBirthdayOfficers] = useState<Officer[]>([]);
  
  // For filters - we still need some "all" data or official lists
  const [allOfficers, setAllOfficers] = useState<Officer[]>([]); 

  // Sync search input with URL if URL changes externally
  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

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

    router.push(`${pathname}?${params.toString()}`, { scroll: false });

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

  // Fetch Officers with Pagination and Filtering
  const fetchOfficers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from("administrative_officers")
        .select("*", { count: "exact" });

      // Apply server-side filters
      // Note: This is a basic match. For dirty data, we might need more complex logic.
      if (queryParam) {
        query = query.ilike("full_name", `%${queryParam}%`);
      }
      if (lgaParam) {
        // Similar strategy for LGAs if needed, but LGAs are fairly consistent. We can do an ilike.
        query = query.ilike("lga", `%${lgaParam}%`);
      }
      
      if (mdaParam) {
        // mdaParam is now the NORMALIZED string. We must find all matching raw strings in the DB.
        if (allOfficers.length > 0) {
           const matchingRawMdas = [...new Set(
              allOfficers
                .filter(o => normalizeMDA(o.current_mda) === mdaParam && o.current_mda)
                .map(o => o.current_mda)
           )];
           
           if (matchingRawMdas.length > 0) {
              query = query.in("current_mda", matchingRawMdas);
           } else {
              query = query.ilike("current_mda", `%${mdaParam}%`);
           }
        } else {
           query = query.ilike("current_mda", `%${mdaParam}%`);
        }
      }

      // Sort
      if (sortParam === "name-asc") query = query.order("full_name", { ascending: true });
      if (sortParam === "name-desc") query = query.order("full_name", { ascending: false });
      if (sortParam === "level-senior") query = query.order("grade_level", { ascending: false });

      // Pagination
      const from = (pageParam - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (data) {
        const processedData = (data as Officer[]).map(officer => ({
          ...officer,
          lga: normalizeLGA(officer.lga),
          current_mda: normalizeMDA(officer.current_mda),
          birth_month_day: formatBirthday(officer.birth_month_day)
        }));

        // Client-side month filtering (Supabase doesn't support complex date string logic easily without RPC)
        let finalData = processedData;
        if (monthParam) {
          finalData = processedData.filter(o => o.birth_month_day.startsWith(monthParam.substring(0, 3)));
        }

        setOfficers(finalData);
        setTotalCount(count || 0);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
      toast.error("Failed to sync directory.");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, queryParam, lgaParam, mdaParam, monthParam, sortParam, pageParam, allOfficers]);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  // Initial Auth & Global Data Check
  useEffect(() => {
    const checkAuthAndGlobal = async () => {
      setIsAuthLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      
      if (authUser) {
        // Fetch only current user's profile and admin status
        const { data: profile } = await supabase
          .from("administrative_officers")
          .select("id, is_admin, is_approved")
          .eq("id", authUser.id)
          .maybeSingle();

        const userEmail = authUser.email?.trim().toLowerCase() || '';
        const whitelistEntry = WHITELIST_OFFICERS[userEmail];
        
        if (profile?.is_admin === true || whitelistEntry?.is_admin === true) {
          setIsAdmin(true);
        }
      }

      // Fetch summary data for stats (Total count)
      const { count } = await supabase
        .from("administrative_officers")
        .select("*", { count: 'exact', head: true });
      
      setTotalCount(count || 0);

      // Fetch birthdays only for today (Targeted query)
      const today = new Date();
      const month = today.toLocaleString('default', { month: 'short' });
      const day = today.getDate().toString().padStart(2, '0');
      const bdayQuery = `${month} ${day}`;

      const { data: bdayData } = await supabase
        .from("administrative_officers")
        .select("*")
        .ilike("birth_month_day", `%${bdayQuery}%`);

      if (bdayData) {
        setBirthdayOfficers(bdayData as Officer[]);
      }

      // For the search filter dropdowns, we still need unique MDAs. 
      // Instead of 1000 records, we can fetch unique values if possible, 
      // but for now, let's keep a smaller, optimized fetch for global context if needed.
      // Actually, let's just fetch all officers once but in a more controlled way.
      const { data: globalData } = await supabase
        .from("administrative_officers")
        .select("*")
        .limit(2000);

      if (globalData) {
        setAllOfficers(globalData as Officer[]);
      }

      setIsAuthLoading(false);
    };
    checkAuthAndGlobal();
  }, [supabase]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <WelcomeScreen />;
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-green-950/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-[100] shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-full p-0.5 overflow-hidden shadow-md ring-2 ring-emerald-500/20 block" style={{ backgroundColor: "white" }}>
            <img src="/logo2.jpg" alt="Ondo State Logo" className="w-full h-full object-cover rounded-full bg-white hover:scale-110 transition-transform" />
          </Link>
          <Link href="/">
            <h2 className="text-lg font-bold text-white tracking-tight hidden sm:block hover:text-emerald-300 transition-colors cursor-pointer">
              ADOFOM Portal
            </h2>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <NavigationDrawer
            isAdmin={isAdmin}
            officers={allOfficers}
            filteredOfficers={officers}
            onViewOwnProfile={setSelectedOfficer}
          />
        </div>
      </header>

      {/* Hero Section */}
      <header className="relative overflow-hidden text-white shadow-2xl min-h-[400px] flex flex-col justify-center">
        <ImageSlider />
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
          <NotificationDrawer />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center w-full z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center border border-white/20 shadow-2xl animate-float p-1 overflow-hidden" style={{ backgroundColor: "white" }}>
              <img src="/Ondo-Logo.png" alt="Ondo State" className="w-full h-full object-cover rounded-full bg-white" />
            </div>
            <div className="w-20 h-20 rounded-full flex items-center justify-center border border-white/20 shadow-2xl animate-float p-1 overflow-hidden" style={{ backgroundColor: "white", animationDelay: "500ms" }}>
              <img src="/logo2.jpg" alt="Secondary Logo" className="w-full h-full object-cover rounded-full bg-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
            Administrative <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-teal-100 drop-shadow-sm">
              Officers Directory
            </span>
          </h1>
          
          <p className="text-green-50/90 text-lg md:text-xl max-w-2xl mx-auto italic font-serif font-light tracking-wide mb-12 leading-relaxed drop-shadow-sm">
            "Excellence in service, integrity in administration. Connect with the cadre driving Ondo State forward."
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 bg-black/20 backdrop-blur-2xl px-10 py-6 rounded-[2.5rem] border border-white/10 w-fit mx-auto shadow-2xl">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-emerald-300">{allOfficers.length || "---"}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">Officers</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-emerald-300">
                {new Set(allOfficers.map(o => normalizeMDA(o.current_mda)).filter(mda => mda && mda !== "Unknown MDA")).size || "---"}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">Ministries</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-emerald-300">18</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">LGAs</span>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-slate-50 dark:text-zinc-950 fill-current">
            <path d="M0 120V60C240 30 480 30 720 60C960 90 1200 90 1440 60V120H0Z" opacity="0.5" />
            <path d="M0 120V80C240 50 480 50 720 80C960 110 1200 110 1440 80V120H0Z" />
          </svg>
        </div>
      </header>

      {/* Main Content Area */}
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
                Displaying <span className="text-emerald-600 font-bold">{totalCount}</span> registered officers
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ExportButton officers={allOfficers} />
          </div>
        </div>

        {/* Loading Overlay or Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProfileSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[3rem] border border-slate-200 dark:border-zinc-800 shadow-xl">
             <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-100 mb-3">Sync Error</h3>
            <p className="text-slate-500 dark:text-zinc-400 max-w-md mx-auto mb-10 font-medium">
              We couldn't load the directory data. Please check your connection and try again.
            </p>
            <button 
              onClick={() => fetchOfficers()}
              className="px-10 py-4 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl hover:scale-105 transition-all active:scale-95"
            >
              Retry Sync
            </button>
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
              onClick={() => updateFilters({ q: "", lga: "", mda: "", month: "" })}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
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
                // Show a limited range of pages if totalPages is large
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
      </div>

      {/* Overlays */}
      {birthdayOfficers.length > 0 && (
        <BirthdayBanner
          officers={birthdayOfficers}
          onClose={() => setBirthdayOfficers([])}
        />
      )}

      {selectedOfficer && (
        <ProfileModal
          officer={selectedOfficer}
          onClose={() => setSelectedOfficer(null)}
          onOfficerUpdated={(updated) => {
            setOfficers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
            setSelectedOfficer(updated);
            // Also update global list for drawers/stats
            setAllOfficers(prev => prev.map(o => o.id === updated.id ? updated : o));
          }}
        />
      )}

      <ScrollButtons />
    </main>
  );
}
