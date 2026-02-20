"use client";

import { Search, SlidersHorizontal } from "lucide-react";
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
    officers,
}: SearchAndFilterProps) {
    const uniqueLgas = [...new Set(officers.map((o) => o.lga))].sort();
    const uniqueMdas = [...new Set(officers.map((o) => o.current_mda))].sort();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-green-50/50 p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all duration-200"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider sm:hidden lg:flex">
                        <SlidersHorizontal size={14} />
                        <span>Filters</span>
                    </div>

                    {/* LGA Dropdown */}
                    <select
                        value={lgaFilter}
                        onChange={(e) => onLgaChange(e.target.value)}
                        className="px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all duration-200 cursor-pointer min-w-[140px]"
                    >
                        <option value="">All LGAs</option>
                        {uniqueLgas.map((lga) => (
                            <option key={lga} value={lga}>
                                {lga}
                            </option>
                        ))}
                    </select>

                    {/* Birth Month Dropdown */}
                    <select
                        value={monthFilter}
                        onChange={(e) => onMonthChange(e.target.value)}
                        className="px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all duration-200 cursor-pointer min-w-[160px]"
                    >
                        <option value="">All Birth Months</option>
                        {months.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>

                    {/* MDA Dropdown */}
                    <select
                        value={mdaFilter}
                        onChange={(e) => onMdaChange(e.target.value)}
                        className="px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all duration-200 cursor-pointer min-w-[180px]"
                    >
                        <option value="">All MDAs</option>
                        {uniqueMdas.map((mda) => (
                            <option key={mda} value={mda}>
                                {mda}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
