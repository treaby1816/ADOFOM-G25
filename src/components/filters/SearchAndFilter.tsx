"use client";

import { Search, SlidersHorizontal, ArrowUpDown, X, Filter } from "lucide-react";
import { Officer } from "@/types/officer";
import { ONDO_LGAS, normalizeMDA } from "@/lib/dataConsolidation";

interface SearchAndFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    lgaFilter: string;
    onLgaChange: (value: string) => void;
    monthFilter: string;
    onMonthChange: (value: string) => void;
    mdaFilter: string;
    onMdaChange: (value: string) => void;
    setFilter: string;
    onSetChange: (value: string) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    officers: Officer[];
}

export default function SearchAndFilter({
    searchQuery,
    onSearchChange,
    lgaFilter,
    onLgaChange,
    monthFilter,
    onMonthChange,
    mdaFilter,
    onMdaChange,
    setFilter,
    onSetChange,
    sortOption,
    onSortChange,
    officers,
}: SearchAndFilterProps) {
    // Use ONDO_LGAS for consistency, fallback to data if somehow missing
    const displayLgas = ONDO_LGAS.length > 0 ? ONDO_LGAS : [...new Set(officers.map((o) => (o.lga || "").trim()))].filter(Boolean).sort();
    
    // Normalize MDAs to ensure duplicates are merged in the dropdown
    const uniqueMdas = [...new Set(officers.map((o) => normalizeMDA(o.current_mda)))].filter(mda => mda && mda !== "Unknown MDA").sort();
    
    // Extract unique Induction Years
    const uniqueSets = [...new Set(officers.map((o) => o.induction_year))].filter(Boolean).sort((a, b) => Number(b) - Number(a)); // Sort descending (newest first)
    
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const selectClasses = "bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 hover:border-emerald-400/50 transition-all duration-300 shadow-sm appearance-none flex-1";

    return (
        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/80 dark:border-zinc-800/60 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-black/20 p-4 mb-8">
            <div className="flex flex-col gap-4">
                {/* Search */}
                <div className="relative group w-full">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-green-500 dark:group-focus-within:text-emerald-400 transition-colors z-30 pointer-events-none"
                    />
                    <input
                        id="officer-search"
                        type="text"
                        placeholder="Search officers by name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        autoComplete="off"
                        style={{ WebkitTextFillColor: 'initial' }}
                        className="search-input w-full py-4 pr-12 pl-12 border border-slate-200 dark:border-zinc-800 rounded-2xl text-base font-medium placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:ring-4 focus:ring-green-500/10 dark:focus:ring-emerald-500/10 focus:border-green-400 dark:focus:border-emerald-500 hover:border-green-300 dark:hover:border-emerald-500/60 transition-all duration-300 shadow-sm relative z-20 text-slate-900 dark:text-white bg-white dark:bg-zinc-900/50"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all z-30 cursor-pointer"
                            title="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="relative">
                        <select
                            value={lgaFilter}
                            onChange={(e) => onLgaChange(e.target.value)}
                            className={`px-4 py-3 cursor-pointer z-20 relative ${selectClasses} w-full pr-10 text-ellipsis overflow-hidden whitespace-nowrap ${lgaFilter ? "border-emerald-500" : ""}`}
                        >
                            <option value="">All LGAs</option>
                            {displayLgas.map((lga: string) => (
                                <option key={lga} value={lga} className="capitalize">
                                    {lga}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l border-slate-200 dark:border-zinc-700 pl-2 z-30">
                            <ArrowUpDown size={14} />
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={monthFilter}
                            onChange={(e) => onMonthChange(e.target.value)}
                            className={`px-4 py-3 cursor-pointer z-20 relative ${selectClasses} w-full pr-10 text-ellipsis overflow-hidden whitespace-nowrap ${monthFilter ? "border-emerald-500" : ""}`}
                        >
                            <option value="">Birth Month</option>
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l border-slate-200 dark:border-zinc-700 pl-2 z-30">
                            <ArrowUpDown size={14} />
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={mdaFilter}
                            onChange={(e) => onMdaChange(e.target.value)}
                            className={`px-4 py-3 cursor-pointer z-20 relative ${selectClasses} w-full pr-10 text-ellipsis overflow-hidden whitespace-nowrap ${mdaFilter ? "border-emerald-500" : ""}`}
                        >
                            <option value="">All MDAs</option>
                            {uniqueMdas.map((mda) => (
                                <option key={mda} value={mda} className="capitalize">
                                    {mda.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l border-slate-200 dark:border-zinc-700 pl-2 z-30">
                            <ArrowUpDown size={14} />
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={setFilter}
                            onChange={(e) => onSetChange(e.target.value)}
                            className={`px-4 py-3 cursor-pointer z-20 relative ${selectClasses} w-full pr-10 text-ellipsis overflow-hidden whitespace-nowrap ${setFilter ? "border-emerald-500" : ""}`}
                        >
                            <option value="">All Sets</option>
                            {uniqueSets.map((year) => (
                                <option key={year} value={year}>{year} Set</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l border-slate-200 dark:border-zinc-700 pl-2 z-30">
                            <ArrowUpDown size={14} />
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={sortOption}
                            onChange={(e) => onSortChange(e.target.value)}
                            className={`px-4 py-3 cursor-pointer z-20 relative ${selectClasses} w-full pr-10 text-ellipsis overflow-hidden whitespace-nowrap`}
                        >
                            <option value="name-asc">Sort: A-Z</option>
                            <option value="name-desc">Sort: Z-A</option>
                            <option value="level-senior">Sort: GL</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l border-slate-200 dark:border-zinc-700 pl-2 z-30">
                            <ArrowUpDown size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
