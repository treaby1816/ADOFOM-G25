"use client";

import { useState } from "react";
import { Twitter, Linkedin, Instagram, Globe } from "lucide-react";
import { Officer } from "@/types/officer";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────
   Desktop/Tablet-only Team Showcase
   Renders an interactive photo mosaic + name list.
   Hidden on mobile via parent CSS — zero JS cost on small screens.
───────────────────────────────────────── */

interface TeamShowcaseProps {
    members: Officer[];
    onSelectMember?: (officer: Officer) => void;
}

export default function TeamShowcase({ members, onSelectMember }: TeamShowcaseProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Distribute members across 3 staggered columns
    const col1 = members.filter((_, i) => i % 3 === 0);
    const col2 = members.filter((_, i) => i % 3 === 1);
    const col3 = members.filter((_, i) => i % 3 === 2);

    return (
        <div className="flex items-start gap-10 lg:gap-14 select-none w-full max-w-6xl mx-auto py-8 px-6">
            {/* ── Left: Photo Mosaic Grid ── */}
            <div className="flex gap-3 flex-shrink-0">
                <PhotoColumn
                    members={col1}
                    hoveredId={hoveredId}
                    onHover={setHoveredId}
                    onClick={onSelectMember}
                    cardClass="w-[155px] h-[165px] lg:w-[175px] lg:h-[185px]"
                    offsetClass=""
                />
                <PhotoColumn
                    members={col2}
                    hoveredId={hoveredId}
                    onHover={setHoveredId}
                    onClick={onSelectMember}
                    cardClass="w-[172px] h-[182px] lg:w-[192px] lg:h-[202px]"
                    offsetClass="mt-[68px] lg:mt-[78px]"
                />
                <PhotoColumn
                    members={col3}
                    hoveredId={hoveredId}
                    onHover={setHoveredId}
                    onClick={onSelectMember}
                    cardClass="w-[162px] h-[172px] lg:w-[182px] lg:h-[192px]"
                    offsetClass="mt-[32px] lg:mt-[38px]"
                />
            </div>

            {/* ── Right: Member Name List ── */}
            <div className="flex flex-col gap-5 pt-2 flex-1 min-w-0">
                {members.map((member) => (
                    <MemberRow
                        key={member.id}
                        member={member}
                        hoveredId={hoveredId}
                        onHover={setHoveredId}
                        onClick={onSelectMember}
                    />
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   Photo Column — renders a vertical stack of photo cards
───────────────────────────────────────── */

function PhotoColumn({
    members,
    hoveredId,
    onHover,
    onClick,
    cardClass,
    offsetClass,
}: {
    members: Officer[];
    hoveredId: string | null;
    onHover: (id: string | null) => void;
    onClick?: (officer: Officer) => void;
    cardClass: string;
    offsetClass: string;
}) {
    return (
        <div className={cn("flex flex-col gap-3", offsetClass)}>
            {members.map((member) => (
                <PhotoCard
                    key={member.id}
                    member={member}
                    className={cardClass}
                    hoveredId={hoveredId}
                    onHover={onHover}
                    onClick={onClick}
                />
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────
   Photo Card — single interactive photo tile
───────────────────────────────────────── */

function PhotoCard({
    member,
    className,
    hoveredId,
    onHover,
    onClick,
}: {
    member: Officer;
    className: string;
    hoveredId: string | null;
    onHover: (id: string | null) => void;
    onClick?: (officer: Officer) => void;
}) {
    const isActive = hoveredId === member.id;
    const isDimmed = hoveredId !== null && !isActive;

    const getInitials = (name: string) => {
        const parts = name.replace(/,/g, " ").trim().split(/\s+/);
        if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const hasPhoto = member.photo_url && member.photo_url !== "/default-avatar.png";

    const getDriveViewUrl = (url: string) => {
        if (!url) return "";
        if (!url.includes("drive.google.com/open?id=")) return url;
        const id = url.split("id=")[1];
        return id ? `/api/image-proxy?id=${id}` : url;
    };

    return (
        <div
            className={cn(
                "overflow-hidden rounded-xl cursor-pointer flex-shrink-0 transition-all duration-300",
                className,
                isDimmed ? "opacity-50 scale-[0.98]" : "opacity-100",
                isActive && "ring-2 ring-yellow-400/60 shadow-lg shadow-yellow-500/20 scale-[1.03]"
            )}
            onMouseEnter={() => onHover(member.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick?.(member)}
        >
            {hasPhoto ? (
                <img
                    src={getDriveViewUrl(member.photo_url)}
                    alt={member.full_name}
                    className={cn(
                        "w-full h-full object-cover transition-[filter] duration-500",
                        member.photo_position?.startsWith("object-") ? member.photo_position : "object-center"
                    )}
                    style={{
                        filter: isActive ? "grayscale(0) brightness(1)" : "grayscale(0.7) brightness(0.8)",
                    }}
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center">
                    <span className="text-4xl font-black text-white/90">{getInitials(member.full_name)}</span>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────
   Member Row — name + portfolio + social links
───────────────────────────────────────── */

function MemberRow({
    member,
    hoveredId,
    onHover,
    onClick,
}: {
    member: Officer;
    hoveredId: string | null;
    onHover: (id: string | null) => void;
    onClick?: (officer: Officer) => void;
}) {
    const isActive = hoveredId === member.id;
    const isDimmed = hoveredId !== null && !isActive;

    const hasSocial = member.twitter_url || member.linkedin_url || member.instagram_url || member.facebook_url;

    // Format display name: "SURNAME, First" → cleaner display
    const displayName = member.full_name.includes(",")
        ? member.full_name.split(",")[0].toUpperCase() + "," + member.full_name.split(",").slice(1).join(",")
        : member.full_name;

    return (
        <div
            className={cn(
                "cursor-pointer transition-all duration-300",
                isDimmed ? "opacity-40" : "opacity-100",
                isActive && "translate-x-1"
            )}
            onMouseEnter={() => onHover(member.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick?.(member)}
        >
            {/* Name + social icons */}
            <div className="flex items-center gap-2.5">
                <span
                    className={cn(
                        "w-4 h-3 rounded-[5px] flex-shrink-0 transition-all duration-300",
                        isActive ? "bg-yellow-500 w-5" : "bg-slate-300 dark:bg-zinc-600"
                    )}
                />
                <span
                    className={cn(
                        "text-[18px] font-semibold leading-none tracking-tight transition-colors duration-300",
                        isActive
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-slate-700 dark:text-zinc-300"
                    )}
                >
                    {displayName}
                </span>

                {/* Social icons — reveal on hover */}
                {hasSocial && (
                    <div
                        className={cn(
                            "flex items-center gap-1.5 ml-0.5 transition-all duration-200",
                            isActive
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-2 pointer-events-none"
                        )}
                    >
                        {member.twitter_url && (
                            <SocialIcon href={member.twitter_url} title="X / Twitter">
                                <Twitter size={10} />
                            </SocialIcon>
                        )}
                        {member.linkedin_url && (
                            <SocialIcon href={member.linkedin_url} title="LinkedIn">
                                <Linkedin size={10} />
                            </SocialIcon>
                        )}
                        {member.instagram_url && (
                            <SocialIcon href={member.instagram_url} title="Instagram">
                                <Instagram size={10} />
                            </SocialIcon>
                        )}
                        {member.facebook_url && (
                            <SocialIcon href={member.facebook_url} title="Facebook">
                                <Globe size={10} />
                            </SocialIcon>
                        )}
                    </div>
                )}
            </div>

            {/* Portfolio role */}
            <p className="mt-1.5 pl-[27px] text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                {member.exco_portfolio || member.current_mda}
            </p>
        </div>
    );
}

/* ─────────────────────────────────────────
   Social Icon Link — reusable tiny icon button
───────────────────────────────────────── */

function SocialIcon({
    href,
    title,
    children,
}: {
    href: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded text-slate-400 dark:text-zinc-500 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-150 hover:scale-110"
            title={title}
        >
            {children}
        </a>
    );
}
