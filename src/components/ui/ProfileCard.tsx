"use client";

import Image from "next/image";
import { Phone, Mail, MessageCircle, Eye } from "lucide-react";
import { Officer } from "@/types/officer";

interface ProfileCardProps {
    officer: Officer;
    onViewProfile: (officer: Officer) => void;
}

export default function ProfileCard({ officer, onViewProfile }: ProfileCardProps) {
    return (
        <div className="h-full group relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-white/60 dark:border-zinc-800/80 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-green-500/20 dark:hover:shadow-emerald-900/20 hover:border-green-300/50 dark:hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col">
            {/* Decorative top accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Photo Section */}
            <div className="flex justify-center pt-8 pb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 dark:from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-32 h-32 rounded-full overflow-hidden ring-[6px] ring-white dark:ring-zinc-800 shadow-xl group-hover:ring-green-100 dark:group-hover:ring-emerald-800 group-hover:scale-105 transition-all duration-500 z-10">
                    <Image
                        src={officer.photo_url}
                        alt={officer.full_name}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Info Section */}
            <div className="px-6 pb-6 flex-1 text-center relative z-10">
                <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 leading-tight mb-2 group-hover:text-green-700 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {officer.full_name}
                </h3>
                <p className="text-sm font-bold text-green-700 dark:text-emerald-300 bg-green-50/80 dark:bg-emerald-950/50 inline-block px-4 py-1 rounded-full mb-2 border border-green-100/50 dark:border-emerald-800/50 shadow-sm">
                    {officer.current_mda}
                </p>
                <p className="text-xs font-bold text-slate-400 dark:text-zinc-400 mb-4 tracking-wide">
                    {officer.grade_level}
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800/80 px-2 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-zinc-600 rounded-full group-hover:bg-green-400 dark:group-hover:bg-emerald-500 transition-colors" />
                        {officer.lga}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800/80 px-2 py-1 rounded-md">
                        🎂 {officer.birth_month_day}
                    </span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-slate-100/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 px-5 py-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                    <a
                        href={`tel:+${officer.phone_number}`}
                        className="p-2.5 rounded-full text-slate-400 dark:text-zinc-400 hover:text-green-600 dark:hover:text-emerald-400 hover:bg-green-100 dark:hover:bg-emerald-950 hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                        title="Call"
                    >
                        <Phone size={18} />
                    </a>
                    <a
                        href={`mailto:${officer.email_address}`}
                        className="p-2.5 rounded-full text-slate-400 dark:text-zinc-400 hover:text-green-600 dark:hover:text-emerald-400 hover:bg-green-100 dark:hover:bg-emerald-950 hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                        title="Email"
                    >
                        <Mail size={18} />
                    </a>
                    <a
                        href={`https://wa.me/${officer.phone_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full text-slate-400 dark:text-zinc-400 hover:text-green-600 dark:hover:text-emerald-400 hover:bg-green-100 dark:hover:bg-emerald-950 hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                        title="WhatsApp"
                    >
                        <MessageCircle size={18} />
                    </a>
                </div>

                <button
                    onClick={() => onViewProfile(officer)}
                    className="flex items-center gap-2 text-xs font-bold text-white bg-green-600 hover:bg-green-500 shadow-md hover:shadow-green-500/30 hover:-translate-y-0.5 active:scale-95 px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer"
                >
                    <Eye size={16} />
                    View Profile
                </button>
            </div>
        </div>
    );
}
