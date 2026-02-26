"use client";

import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { Officer } from "@/types/officer";

interface SearchAndFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    lgaFilter: string;
    onLgaChange: (value: string) => void;
    monthFilter: string;
    onMonthChange: (value: string) => void;
    mdaFilter: string;
    onMdaChange: (value: string) => void;
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
    sortOption,
    onSortChange,
    officers,
}: SearchAndFilterProps) {
    const uniqueLgas = [...new Set(officers.map((o) => o.lga))].sort();
    const uniqueMdas = [...new Set(officers.map((o) => o.current_mda))].sort();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const baseInputClasses = "bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 dark:focus:ring-emerald-500/10 focus:border-green-400 dark:focus:border-emerald-500 hover:border-green-300 dark:hover:border-emerald-500/60 transition-all duration-300 shadow-sm appearance-none flex-1";

    return (
        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/80 dark:border-zinc-800/60 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-black/20 p-3 mb-8">
            <div className="flex flex-col xl:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 group">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-green-500 dark:group-focus-within:text-emerald-400 transition-colors z-10"
                    />
                    <input
                        type="text"
                        placeholder="Search officers by name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        autoComplete="off"
                        style={{ caretColor: 'auto', color: 'inherit' }}
                        className={`w-full py-3 pr-12 pl-12 caret-green-500 dark:caret-emerald-400 ${baseInputClasses}`}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all z-10 cursor-pointer"
                            title="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filters Row 1 */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 px-3 text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest sm:hidden xl:flex">
                        <SlidersHorizontal size={14} />
                        <span>Filters</span>
                    </div>

                    <div className="relative">
                        <select
                            value={lgaFilter}
                            onChange={(e) => onLgaChange(e.target.value)}
                            className={`px-4 py-3 cursor-pointer z-10 ${baseInputClasses} min-w-[150px] w-full pr-10`}
                        >
                            <option value="">All LGAs</option>
                            {uniqueLgas.map((lga) => (
                                <option key={lga} value={lga}>{lga}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l border-slate-200 dark:border-zinc-700 pl-2">
                            <ArrowUpDown size={14} />
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={monthFilter}
                            onChange={(e) => onMonthChange(e.target.value)}
                            className={`px-4 py-3 cursor-pointer z-10 ${baseInputClasses} min-w-[170px] w-full pr-10`}
                        >
                            <option value="">All Birth Months</option>
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l border-slate-200 dark:border-zinc-700 pl-2">
                            <ArrowUpDown size={14} />
                        </div>
                    </div>
                </div>

                {/* Filters Row 2 - MDA and Sort */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <select
                            value={mdaFilter}
                            onChange={(e) => onMdaChange(e.target.value)}
                            className={`px-4 py-3 cursor-pointer z-10 ${baseInputClasses} min-w-[200px] w-full pr-10`}
                        >
                            <option value="">All MDAs</option>
                            {uniqueMdas.map((mda) => (
                                <option key={mda} value={mda}>{mda}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 border-l border-slate-200 dark:border-zinc-700 pl-2">
                            <ArrowUpDown size={14} />
                        </div>
                    </div>

                    <div className="relative sm:max-w-[180px]">
                        <select
                            value={sortOption}
                            onChange={(e) => onSortChange(e.target.value)}
                            className={`px-4 py-3 cursor-pointer z-10 ${baseInputClasses} w-full pl-10`}
                        >
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="level-senior">Seniority (GL)</option>
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ArrowUpDown size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
