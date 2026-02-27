"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, Eye } from "lucide-react";
import { Officer } from "@/types/officer";

interface ProfileCardProps {
    officer: Officer;
    onViewProfile: (officer: Officer) => void;
}

export default function ProfileCard({ officer, onViewProfile }: ProfileCardProps) {
    const [imgError, setImgError] = useState(false);

    const getInitials = (name: string) => {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const getAvatarColor = (name: string) => {
        const colors = [
            "bg-rose-500", "bg-blue-500", "bg-emerald-500",
            "bg-amber-500", "bg-purple-500", "bg-cyan-500", "bg-indigo-500"
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    const showInitials = imgError || !officer.photo_url || officer.photo_url === '/default-avatar.png';

    // Most professional headshots look better centered or slightly higher.
    // If a position is saved in the database, use it. Otherwise, use defaults.
    const getPhotoPosition = (name: string, savedPos?: string) => {
        if (savedPos && savedPos.startsWith('object-')) return savedPos;
        if (savedPos) return "";

        const n = name.toUpperCase();
        if (n.includes("ADEWOLE") && n.includes("FELIX")) return "object-top";
        if (n.includes("OLADURE") && n.includes("OLANIRETI")) return "object-top";
        if (n.includes("OYEWO") && n.includes("GBADEBO")) return "object-top";

        // CUSTOM SENIOR TUNING
        if (n.includes("OMOOLORUN")) return ""; // Handled by inline style

        if (n.includes("SANYADE")) return "object-top";
        if (n.includes("OLUTOLA")) return "object-top";
        if (n.includes("AJAYI")) return "object-top";
        if (n.includes("SUNMOLA")) return "object-top";

        return "object-center";
    };

    const getCustomPositionStyle = (name: string, savedPos?: string): React.CSSProperties => {
        if (savedPos && !savedPos.startsWith('object-')) {
            return { objectPosition: savedPos };
        }
        const n = name.toUpperCase();
        if (n.includes("OMOOLORUN")) {
            return { objectPosition: 'center 10%' }; // Precision framing
        }
        return {};
    };

    const getDriveViewUrl = (url: string) => {
        if (!url) return '';
        if (!url.includes('drive.google.com/open?id=')) return url;
        const id = url.split('id=')[1];
        if (!id) return url;
        return `/api/image-proxy?id=${id}`;
    };

    return (
        <div className="h-full group relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-white/80 dark:border-zinc-800/80 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-green-500/20 dark:hover:shadow-emerald-900/20 hover:border-green-300/60 dark:hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col">
            {/* Decorative top accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Photo Section */}
            <div className="flex justify-center pt-8 pb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 dark:from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-32 h-32 rounded-full overflow-hidden ring-[6px] ring-white dark:ring-zinc-800 shadow-xl group-hover:ring-green-100 dark:group-hover:ring-emerald-800 group-hover:scale-105 transition-all duration-300 z-10 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                    {showInitials ? (
                        <div className={`w-full h-full flex items-center justify-center text-4xl font-bold text-white shadow-inner ${getAvatarColor(officer.full_name)}`}>
                            {getInitials(officer.full_name)}
                        </div>
                    ) : (
                        <img
                            src={getDriveViewUrl(officer.photo_url)}
                            alt={officer.full_name}
                            className={`w-full h-full object-cover ${getPhotoPosition(officer.full_name, officer.photo_position)}`}
                            style={getCustomPositionStyle(officer.full_name, officer.photo_position)}
                            onError={() => setImgError(true)}
                        />
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="px-6 pb-6 flex-1 text-center relative z-10">
                <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 leading-tight mb-2 group-hover:text-green-700 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {officer.full_name.includes(',')
                        ? officer.full_name.split(',')[0].toUpperCase() + ',' + officer.full_name.split(',').slice(1).join(',')
                        : officer.full_name}
                </h3>
                <p className="text-sm font-bold text-green-700 dark:text-emerald-300 bg-green-50/80 dark:bg-emerald-950/50 inline-block px-4 py-1 rounded-full mb-1 border border-green-100/50 dark:border-emerald-800/50 shadow-sm">
                    {officer.current_mda}
                </p>
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
