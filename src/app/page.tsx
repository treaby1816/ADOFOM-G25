"use client";

import { useState, useEffect, useMemo } from "react";
import ProfileCard from "@/components/ui/ProfileCard";
import ProfileModal from "@/components/ui/ProfileModal";
import BirthdayBanner from "@/components/ui/BirthdayBanner";
import SearchAndFilter from "@/components/filters/SearchAndFilter";
import ImageSlider from "@/components/ui/ImageSlider";
import ExportButton from "@/components/ui/ExportButton";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";
import ScrollButtons from "@/components/ui/ScrollButtons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Officer } from "@/types/officer";
import { Users, Shield, ChevronLeft, ChevronRight } from "lucide-react";

import officersData from "@/lib/mockData.json";

// Month names for birthday matching
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Home() {
  // Sort officers alphabetically by Last Name
  const officers: Officer[] = (officersData as Officer[]).sort((a, b) => {
    const aLastName = a.full_name.split(" ").pop() || "";
    const bLastName = b.full_name.split(" ").pop() || "";
    return aLastName.localeCompare(bLastName);
  });

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [lgaFilter, setLgaFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [mdaFilter, setMdaFilter] = useState("");
  const [sortOption, setSortOption] = useState("name-asc"); // Default sort

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Can be adjusted

  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [birthdayOfficer, setBirthdayOfficer] = useState<Officer | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Added for skeleton demo

  // Simulate network fetch for the sleek skeleton loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Birthday Engine — matches "Month Day" format (e.g. "February 20")
  useEffect(() => {
    const now = new Date();
    const todayStr = `${MONTH_NAMES[now.getMonth()]} ${now.getDate()}`;

    const match = officers.find((o) => o.birth_month_day === todayStr);
    if (match) {
      setBirthdayOfficer(match);
    }
  }, [officers]);

  // Filtered and Sorted officers
  const processedOfficers = useMemo(() => {
    let result = officers.filter((o) => {
      const matchesSearch = o.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLga = !lgaFilter || o.lga === lgaFilter;
      const matchesMonth =
        !monthFilter || o.birth_month_day.startsWith(monthFilter);
      const matchesMda = !mdaFilter || o.current_mda === mdaFilter;
      return matchesSearch && matchesLga && matchesMonth && matchesMda;
    });

    // Sort Logic
    result.sort((a, b) => {
      if (sortOption === "name-asc") {
        const aName = a.full_name.split(" ").pop() || "";
        const bName = b.full_name.split(" ").pop() || "";
        return aName.localeCompare(bName);
      } else if (sortOption === "name-desc") {
        const aName = a.full_name.split(" ").pop() || "";
        const bName = b.full_name.split(" ").pop() || "";
        return bName.localeCompare(aName);
      } else if (sortOption === "level-senior") {
        // Very simple seniority sort based on Grade Level string (e.g. "GL 14" vs "GL 12")
        // Assuming higher number = more senior
        const aLevel = parseInt(a.grade_level.replace(/\D/g, "")) || 0;
        const bLevel = parseInt(b.grade_level.replace(/\D/g, "")) || 0;
        return bLevel - aLevel;
      }
      return 0;
    });

    return result;
  }, [officers, searchQuery, lgaFilter, monthFilter, mdaFilter, sortOption]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, lgaFilter, monthFilter, mdaFilter, sortOption]);

  // Pagination Logic
  const totalPages = Math.ceil(processedOfficers.length / itemsPerPage);
  const paginatedOfficers = processedOfficers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden text-white shadow-xl min-h-[350px] flex flex-col justify-center">
        {/* Background Slider */}
        <ImageSlider />

        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Content Overlay */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center w-full z-10 flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
            {/* Logo Left */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl animate-float p-1 overflow-hidden">
              <img src="/ondo-logo-transparent.png" alt="Ondo State Logo" className="w-full h-full object-contain drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('hidden'); }} />
            </div>

            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-white/10 rounded-3xl backdrop-blur-md ring-1 ring-white/20 shadow-2xl animate-float" style={{ animationDelay: "200ms" }}>
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-green-300 drop-shadow-lg" />
            </div>

            {/* Logo Right (Optional symmetry, hidden by default if not needed, I'll keep just one on left or center. Let's make it a single centered group) */}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 drop-shadow-2xl leading-tight">
            Ondo State <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-100 animate-pulse-slow block sm:inline">
              Admin Directory
            </span>
          </h1>
          <p className="text-green-50/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium mb-10 leading-relaxed px-4 drop-shadow-md">
            The official portal for the Administrative Officers Cadre. Discover, connect, and collaborate with excellence.
          </p>

          {/* Stats Glassmorphism Container */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-green-50 font-semibold bg-white/10 w-fit mx-auto px-8 py-4 rounded-3xl backdrop-blur-xl border border-white/30 shadow-2xl text-sm sm:text-base transition-all hover:bg-white/15">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/30 rounded-lg">
                <Users size={20} className="text-green-200" />
              </div>
              <span className="tracking-wide text-lg">{officers.length} <span className="text-green-200 text-sm opacity-90 font-normal">Officers</span></span>
            </div>
            <div className="w-1 h-8 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="tracking-wide text-lg">{new Set(officers.map((o) => o.current_mda)).size} <span className="text-green-200 text-sm opacity-90 font-normal">MDAs</span></span>
            </div>
            <div className="w-1 h-8 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="tracking-wide text-lg">{new Set(officers.map((o) => o.lga)).size} <span className="text-green-200 text-sm opacity-90 font-normal">LGAs</span></span>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-white/95" preserveAspectRatio="none">
            <path d="M0 60V20C240 0 480 0 720 20C960 40 1200 40 1440 20V60H0Z" fill="currentColor" opacity="0.5" />
            <path d="M0 60V30C240 10 480 10 720 30C960 50 1200 50 1440 30V60H0Z" fill="currentColor" />
          </svg>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Search & Filter Bar */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          lgaFilter={lgaFilter}
          onLgaChange={setLgaFilter}
          monthFilter={monthFilter}
          onMonthChange={setMonthFilter}
          mdaFilter={mdaFilter}
          onMdaChange={setMdaFilter}
          sortOption={sortOption}
          onSortChange={setSortOption}
          officers={officers}
        />

        {/* Results Count & Export */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
            Showing{" "}
            <span className="font-bold text-slate-700 dark:text-zinc-300">
              {paginatedOfficers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, processedOfficers.length)}
            </span>{" "}
            of {processedOfficers.length} officers
          </p>

          <ExportButton officers={processedOfficers} />
        </div>

        {/* Profile Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-full">
                <ProfileSkeleton />
              </div>
            ))}
          </div>
        ) : paginatedOfficers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
            {paginatedOfficers.map((officer, index) => (
              <div
                key={officer.id}
                className="card-enter h-full"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <ProfileCard
                  officer={officer}
                  onViewProfile={setSelectedOfficer}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Users size={28} className="text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-600 dark:text-zinc-300">
              No officers found
            </p>
            <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 mb-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-sm hover:bg-green-50 dark:hover:bg-emerald-900/40 hover:text-green-600 dark:hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-sm font-semibold text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
              Page <span className="text-green-600 dark:text-emerald-400">{currentPage}</span> of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-sm hover:bg-green-50 dark:hover:bg-emerald-900/40 hover:text-green-600 dark:hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedOfficer && (
        <ProfileModal
          officer={selectedOfficer}
          onClose={() => setSelectedOfficer(null)}
        />
      )}

      {/* Birthday Banner */}
      {!isLoading && birthdayOfficer && (
        <BirthdayBanner
          officer={birthdayOfficer}
          onClose={() => setBirthdayOfficer(null)}
        />
      )}

      {/* Floating Scroll Buttons */}
      <ScrollButtons />
    </main>
  );
}
