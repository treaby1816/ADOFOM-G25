"use client";

import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
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

    const inputClasses = "px-4 py-3 bg-slate-50/80 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-700 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:focus:ring-emerald-500/30 focus:border-green-400 dark:focus:border-emerald-500 transition-all duration-200";

    return (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-zinc-800/60 rounded-2xl shadow-lg shadow-green-50/50 dark:shadow-black/50 p-4 mb-6">
            <div className="flex flex-col xl:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400"
                    />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={`w-full pl-10 ${inputClasses}`}
                    />
                </div>

                {/* Filters Row 1 */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-400 font-medium uppercase tracking-wider sm:hidden xl:flex">
                        <SlidersHorizontal size={14} />
                        <span>Filters</span>
                    </div>

                    <select
                        value={lgaFilter}
                        onChange={(e) => onLgaChange(e.target.value)}
                        className={`${inputClasses} cursor-pointer min-w-[140px] appearance-none`}
                    >
                        <option value="">All LGAs</option>
                        {uniqueLgas.map((lga) => (
                            <option key={lga} value={lga}>{lga}</option>
                        ))}
                    </select>

                    <select
                        value={monthFilter}
                        onChange={(e) => onMonthChange(e.target.value)}
                        className={`${inputClasses} cursor-pointer min-w-[160px] appearance-none`}
                    >
                        <option value="">All Birth Months</option>
                        {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                {/* Filters Row 2 - MDA and Sort */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={mdaFilter}
                        onChange={(e) => onMdaChange(e.target.value)}
                        className={`${inputClasses} cursor-pointer min-w-[180px] flex-1 appearance-none`}
                    >
                        <option value="">All MDAs</option>
                        {uniqueMdas.map((mda) => (
                            <option key={mda} value={mda}>{mda}</option>
                        ))}
                    </select>

                    <div className="relative flex-1 sm:max-w-[180px]">
                        <ArrowUpDown size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400 z-10" />
                        <select
                            value={sortOption}
                            onChange={(e) => onSortChange(e.target.value)}
                            className={`${inputClasses} pl-9 cursor-pointer w-full appearance-none`}
                        >
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="level-senior">Seniority (GL)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
