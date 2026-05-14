"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const MONTH_SHORT: Record<string, string> = {
    Jan: "January", Feb: "February", Mar: "March", Apr: "April",
    May: "May", Jun: "June", Jul: "July", Aug: "August",
    Sep: "September", Oct: "October", Nov: "November", Dec: "December",
};

/** Max days per month (Feb uses 29 to allow leap-year birthdays) */
const MAX_DAYS: Record<string, number> = {
    January: 31, February: 29, March: 31, April: 30,
    May: 31, June: 30, July: 31, August: 31,
    September: 30, October: 31, November: 30, December: 31,
};

// ─── Pure Helpers (exported) ──────────────────────────────────────

/** Combine month + day into the canonical "Month/Day" string, e.g. "May/27" */
export function formatBirthdayValue(month: string, day: string): string {
    if (!month || !day) return "";
    return `${month}/${day}`;
}

/**
 * Parse a birthday string into { month, day }.
 * Handles:
 *  - "May/27", "January/3"         (new canonical format)
 *  - "May 27", "Jan 03"            (text with space)
 *  - "05-27", "5/3", "05/03"       (numeric formats)
 */
export function parseBirthdayValue(value: string): { month: string; day: string } {
    if (!value) return { month: "", day: "" };
    const clean = value.trim();
    if (!clean) return { month: "", day: "" };

    // Try text-based formats: "May/27", "January 3", "Mar/03"
    const textMatch = clean.match(/^([A-Za-z]+)\s*[/\s]\s*(\d{1,2})$/);
    if (textMatch) {
        const rawMonth = textMatch[1];
        const day = String(parseInt(textMatch[2], 10));

        // Try full name first, then short name
        const fullMatch = MONTHS.find(m => m.toLowerCase() === rawMonth.toLowerCase());
        if (fullMatch) return { month: fullMatch, day };

        const shortMatch = MONTH_SHORT[rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1, 3).toLowerCase()];
        if (shortMatch) return { month: shortMatch, day };
    }

    // Try numeric formats: "05-27", "5/3", "05/03"
    const numericMatch = clean.match(/^(\d{1,2})\s*[-/]\s*(\d{1,2})$/);
    if (numericMatch) {
        const m = parseInt(numericMatch[1], 10);
        const d = parseInt(numericMatch[2], 10);
        if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
            return { month: MONTHS[m - 1], day: String(d) };
        }
    }

    return { month: "", day: "" };
}

/** Validate that a birthday string is a well-formed "Month/Day" value */
export function isValidBirthday(value: string): boolean {
    const { month, day } = parseBirthdayValue(value);
    if (!month || !day) return false;

    const monthIndex = MONTHS.indexOf(month);
    if (monthIndex < 0) return false;

    const d = parseInt(day, 10);
    if (isNaN(d) || d < 1) return false;

    const maxDay = MAX_DAYS[month] || 31;
    return d <= maxDay;
}

// ─── Component ────────────────────────────────────────────────────

interface BirthdaySelectProps {
    value: string;                          // controlled value in "Month/Day" format
    onChange: (value: string) => void;      // called with formatted string on any change
    error?: string;                         // optional error message to display below
    variant?: "dark" | "light";             // "dark" for setup page, "light" for edit modal
}

export default function BirthdaySelect({ value, onChange, error, variant = "dark" }: BirthdaySelectProps) {
    const parsed = parseBirthdayValue(value);
    const [selectedMonth, setSelectedMonth] = useState(parsed.month);
    const [selectedDay, setSelectedDay] = useState(parsed.day);

    // Sync from parent value when it changes externally
    useEffect(() => {
        const p = parseBirthdayValue(value);
        setSelectedMonth(p.month);
        setSelectedDay(p.day);
    }, [value]);

    // Calculate max days for currently selected month
    const maxDays = selectedMonth ? (MAX_DAYS[selectedMonth] || 31) : 31;

    // Emit value to parent
    const emitChange = useCallback((month: string, day: string) => {
        if (month && day) {
            onChange(formatBirthdayValue(month, day));
        } else {
            onChange("");
        }
    }, [onChange]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = e.target.value;
        setSelectedMonth(newMonth);

        let newDay = selectedDay;
        // Reset day if it exceeds the new month's max days
        if (newDay) {
            const dayNum = parseInt(newDay, 10);
            const newMax = newMonth ? (MAX_DAYS[newMonth] || 31) : 31;
            if (dayNum > newMax) {
                newDay = "";
                setSelectedDay("");
            }
        }

        emitChange(newMonth, newDay);
    };

    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDay = e.target.value;
        setSelectedDay(newDay);
        emitChange(selectedMonth, newDay);
    };

    // ── Styling ─────────────────────────────────────────────────
    const isDark = variant === "dark";

    const selectBase = isDark
        ? "w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/30 transition-all text-sm appearance-none outline-none"
        : "w-full bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-zinc-100 outline-none transition-colors appearance-none";

    const optionBg = isDark ? "bg-slate-900" : "bg-white dark:bg-zinc-800";

    // Custom dropdown arrow SVG (emerald for light mode, yellow for dark mode)
    const arrowColor = isDark ? "%23fbbf24" : "%2310b981";
    const arrowBg = `bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22${arrowColor}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_12px_center] pr-8`;

    const selectClass = `${selectBase} ${arrowBg}`;

    const dividerClass = isDark
        ? "text-white/30 font-bold text-lg select-none self-center"
        : "text-slate-300 dark:text-zinc-600 font-bold text-lg select-none self-center";

    return (
        <div>
            <div className="flex items-center gap-1.5">
                {/* Month Select */}
                <select
                    id="birthday-month-select"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className={`${selectClass} flex-[1.3]`}
                >
                    <option value="" className={optionBg}>-- Month --</option>
                    {MONTHS.map(m => (
                        <option key={m} value={m} className={optionBg}>{m}</option>
                    ))}
                </select>

                {/* Divider */}
                <span className={dividerClass}>/</span>

                {/* Day Select */}
                <select
                    id="birthday-day-select"
                    value={selectedDay}
                    onChange={handleDayChange}
                    className={`${selectClass} flex-[0.7]`}
                >
                    <option value="" className={optionBg}>-- Day --</option>
                    {Array.from({ length: maxDays }, (_, i) => String(i + 1)).map(d => (
                        <option key={d} value={d} className={optionBg}>{d}</option>
                    ))}
                </select>
            </div>

            {/* Error Display */}
            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-400">{error}</p>
            )}
        </div>
    );
}
