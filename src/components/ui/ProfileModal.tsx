"use client";

import Image from "next/image";
import { Phone, Mail, MessageCircle, X, Briefcase, MapPin, Cake, Heart, Award } from "lucide-react";
import { Officer } from "@/types/officer";
import { useEffect } from "react";

interface ProfileModalProps {
    officer: Officer;
    onClose: () => void;
}

export default function ProfileModal({ officer, onClose }: ProfileModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

            {/* Modal Content */}
            <div
                className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/40 rounded-3xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] dark:shadow-[0_0_50px_-12px_rgba(4,120,87,0.2)] max-w-lg w-full max-h-[85vh] overflow-y-auto animate-modal-in border border-white/60 dark:border-zinc-800"
                style={{ backgroundSize: '200% 200%', animation: 'gradient-bg 10s ease infinite' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-zinc-800/80 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 z-10 cursor-pointer"
                >
                    <X size={18} />
                </button>

                {/* Header with gradient */}
                <div className="relative bg-gradient-to-br from-green-700 via-emerald-600 to-green-900 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-950 pt-10 pb-20 rounded-t-3xl overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-60 mix-blend-overlay" />
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -top-8 -left-8 w-40 h-40 bg-green-400/20 rounded-full blur-3xl animate-float" />
                </div>

                {/* Avatar (overlapping header) */}
                <div className="flex justify-center -mt-20 relative z-10">
                    <div className="relative w-40 h-40 rounded-full overflow-hidden ring-[8px] ring-white dark:ring-zinc-900 shadow-2xl bg-white dark:bg-zinc-900 group hover:scale-[1.02] transition-transform duration-500">
                        <Image
                            src={officer.photo_url}
                            alt={officer.full_name}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 pt-6 pb-8">
                    <h2 className="text-3xl font-black text-slate-800 dark:text-zinc-100 text-center mb-1 drop-shadow-sm">
                        {officer.full_name}
                    </h2>
                    <div className="flex flex-col items-center gap-1.5 mb-6">
                        <p className="text-sm font-bold text-green-800 dark:text-emerald-300 bg-green-100/80 dark:bg-emerald-900/30 border border-green-200/50 dark:border-emerald-800/50 px-5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                            {officer.current_mda}
                        </p>
                        <p className="text-sm font-bold text-slate-400 dark:text-zinc-400 tracking-wide uppercase">
                            {officer.grade_level}
                        </p>
                    </div>

                    {/* Meta Row */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-4 text-sm font-semibold text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50 px-6 py-3 rounded-2xl shadow-inner flex-wrap w-fit">
                            <span className="flex items-center gap-2">
                                <MapPin size={16} className="text-emerald-500" />
                                {officer.lga}
                            </span>
                            <div className="w-1 h-4 bg-slate-200 dark:bg-zinc-600 rounded-full hidden sm:block" />
                            <span className="flex items-center gap-2">
                                <Cake size={16} className="text-emerald-500" />
                                {officer.birth_month_day}
                            </span>
                            <div className="w-1 h-4 bg-slate-200 dark:bg-zinc-600 rounded-full hidden sm:block" />
                            <span className="flex items-center gap-2">
                                <Award size={16} className="text-emerald-500" />
                                {officer.grade_level}
                            </span>
                        </div>
                    </div>

                    {/* About */}
                    <div className="mb-7">
                        <h4 className="flex items-center gap-2 text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-widest mb-3">
                            <Briefcase size={16} className="text-green-600 dark:text-emerald-500" />
                            Professional Profile
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-zinc-300 font-medium leading-relaxed bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50 rounded-2xl p-5 shadow-sm">
                            {officer.about_me}
                        </p>
                    </div>

                    {/* Hobbies */}
                    <div className="mb-8">
                        <h4 className="flex items-center gap-2 text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-widest mb-3">
                            <Heart size={16} className="text-green-600 dark:text-emerald-500" />
                            Interests & Hobbies
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                            {officer.hobbies.split(", ").map((hobby) => (
                                <span
                                    key={hobby}
                                    className="text-xs font-bold bg-green-50 dark:bg-emerald-900/30 text-green-700 dark:text-emerald-300 px-4 py-2 rounded-xl border border-green-100 dark:border-emerald-800/50 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all cursor-default"
                                >
                                    {hobby}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-4">
                        <a
                            href={`tel:+${officer.phone_number}`}
                            className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-200 dark:hover:bg-emerald-950/40 dark:hover:border-emerald-800/50 shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 transition-all duration-300 text-sm"
                        >
                            <Phone size={18} className="text-slate-400 dark:text-zinc-400 group-hover:text-green-500 dark:group-hover:text-emerald-500" />
                            Call
                        </a>
                        <a
                            href={`mailto:${officer.email_address}`}
                            className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-200 dark:hover:bg-emerald-950/40 dark:hover:border-emerald-800/50 shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 transition-all duration-300 text-sm"
                        >
                            <Mail size={18} className="text-slate-400 dark:text-zinc-400 group-hover:text-green-500 dark:group-hover:text-emerald-500" />
                            Email
                        </a>
                        <a
                            href={`https://wa.me/${officer.phone_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-500 hover:to-emerald-400 shadow-md hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 active:scale-95 transition-all duration-300 text-sm"
                        >
                            <MessageCircle size={18} />
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
