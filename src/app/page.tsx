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
import { Officer } from "@/types/officer";
import { Users, Shield } from "lucide-react";

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

  // Filtered officers
  const filteredOfficers = useMemo(() => {
    return officers.filter((o) => {
      const matchesSearch = o.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLga = !lgaFilter || o.lga === lgaFilter;
      const matchesMonth =
        !monthFilter || o.birth_month_day.startsWith(monthFilter);
      const matchesMda = !mdaFilter || o.current_mda === mdaFilter;
      return matchesSearch && matchesLga && matchesMonth && matchesMda;
    });
  }, [officers, searchQuery, lgaFilter, monthFilter, mdaFilter]);

  return (
    <main className="min-h-screen pb-12">
      {/* Header */}
      <header className="relative overflow-hidden text-white shadow-xl min-h-[350px] flex flex-col justify-center">
        {/* Background Slider */}
        <ImageSlider />

        {/* Content Overlay */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center w-full z-10">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-white/10 rounded-3xl backdrop-blur-md mb-6 ring-1 ring-white/20 shadow-2xl animate-float">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-green-300 drop-shadow-lg" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-xl leading-tight">
            Ondo State <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-200 to-teal-200">
              Admin Directory
            </span>
          </h1>
          <p className="text-green-100/95 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium mb-8 leading-relaxed px-4 drop-shadow-md">
            The official portal for the Administrative Officers Cadre. Discover, connect, and collaborate with excellence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-green-100 font-semibold bg-black/30 w-fit mx-auto px-6 py-3 rounded-full backdrop-blur-md border border-white/20 shadow-xl text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-green-300" />
              <span className="tracking-wide">{officers.length} Officers</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="tracking-wide">{new Set(officers.map((o) => o.current_mda)).size} MDAs</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="tracking-wide">{new Set(officers.map((o) => o.lga)).size} LGAs</span>
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
          officers={officers}
        />

        {/* Results Count & Export */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <p className="text-sm text-slate-500 font-medium">
            Showing{" "}
            <span className="font-bold text-slate-700">
              {filteredOfficers.length}
            </span>{" "}
            of {officers.length} officers
          </p>

          <ExportButton officers={filteredOfficers} />
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
        ) : filteredOfficers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
            {filteredOfficers.map((officer, index) => (
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
            <p className="text-lg font-semibold text-slate-600">
              No officers found
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your search or filters.
            </p>
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
