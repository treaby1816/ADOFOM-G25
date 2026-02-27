"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, UserPlus, Gift, Cake } from "lucide-react";
import { Officer } from "@/types/officer";
import Image from "next/image";

interface NotificationBellProps {
    newOfficers: Officer[];
    birthdayOfficers: Officer[];
}

export default function NotificationBell({
    newOfficers,
    birthdayOfficers,
}: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const totalNotifications = newOfficers.length + birthdayOfficers.length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative z-[100]" ref={dropdownRef}>
            {/* Notification Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all duration-200 border border-white/20 shadow-lg text-white group focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Notifications"
            >
                <Bell className={`w-5 h-5 sm:w-6 sm:h-6 ${totalNotifications > 0 ? 'animate-wiggle' : ''}`} />

                {/* Red Alert Badge */}
                {totalNotifications > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 flex h-4 w-4 sm:h-5 sm:w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-[10px] sm:text-[11px] font-bold items-center justify-center text-white border border-red-700 shadow-sm leading-none pl-[1px]">
                            {totalNotifications > 9 ? "9+" : totalNotifications}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 origin-top-right">

                    {/* Header */}
                    <div className="bg-slate-50 dark:bg-zinc-800/50 px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-green-600 dark:text-emerald-500" />
                            Notifications
                        </h3>
                        {totalNotifications > 0 && (
                            <span className="text-xs font-semibold bg-green-100 dark:bg-emerald-900/50 text-green-700 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                                {totalNotifications} New
                            </span>
                        )}
                    </div>

                    {/* List Content */}
                    <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
                        {totalNotifications === 0 ? (
                            <div className="p-8 text-center text-slate-500 dark:text-zinc-400 flex flex-col items-center">
                                <Bell className="w-10 h-10 mb-3 text-slate-300 dark:text-zinc-600 opacity-50" />
                                <p>No new notifications right now.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-zinc-800/80">

                                {/* Birthdays Section */}
                                {birthdayOfficers.length > 0 && (
                                    <div className="py-2">
                                        <div className="px-4 py-2 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                            <Cake className="w-3.5 h-3.5 text-pink-500" /> Today's Birthdays
                                        </div>
                                        {birthdayOfficers.map((officer) => (
                                            <div key={`bday-${officer.id}`} className="px-4 py-3 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors flex gap-3 group">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-rose-100 dark:border-rose-900/50 bg-slate-100">
                                                    {officer.photo_url ? (
                                                        <img
                                                            src={officer.photo_url}
                                                            alt={officer.full_name}
                                                            className={`w-full h-full object-cover ${officer.photo_position || 'object-top'}`}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-rose-100 dark:bg-rose-900/30 text-rose-500 font-bold">
                                                            {officer.full_name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5">
                                                        <Gift className="w-3.5 h-3.5 text-pink-500" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                                                        {officer.full_name}
                                                    </p>
                                                    <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-0.5">
                                                        <Cake className="w-3 h-3" /> It's their birthday today!
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* New Additions Section */}
                                {newOfficers.length > 0 && (
                                    <div className="py-2">
                                        <div className="px-4 py-2 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2 mt-1">
                                            <UserPlus className="w-3.5 h-3.5 text-green-500" /> New Officers
                                        </div>
                                        {newOfficers.map((officer) => (
                                            <div key={`new-${officer.id}`} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors flex gap-3">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-zinc-700 bg-slate-100">
                                                    {officer.photo_url ? (
                                                        <img
                                                            src={officer.photo_url}
                                                            alt={officer.full_name}
                                                            className={`w-full h-full object-cover ${officer.photo_position || 'object-top'}`}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-green-100 dark:bg-emerald-900/30 text-green-600 font-bold">
                                                            {officer.full_name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                                                        {officer.full_name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                                                        Joined {officer.current_mda}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-[10px] font-medium text-green-600 dark:text-emerald-400 bg-green-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full h-fit self-center">
                                                    NEW
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 dark:bg-zinc-800/50 px-4 py-3 text-center border-t border-slate-200 dark:border-zinc-800">
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                            Ondo State Admin Directory
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
