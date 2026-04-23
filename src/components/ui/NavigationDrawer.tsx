"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Moon, Sun, Settings, ShieldCheck, LogOut, User,
    X, ChevronRight, Briefcase
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
import { Officer } from "@/types/officer";
import { WHITELIST_OFFICERS } from "@/lib/whitelist-data";

interface NavigationDrawerProps {
    /** Whether the logged-in user is an admin (can be passed from parent or auto-detected) */
    isAdmin?: boolean;
    /** All loaded officers (optional — if omitted, the drawer fetches its own profile) */
    officers?: Officer[];
    /** Callback when user clicks their profile card (opens ProfileModal) */
    onViewOwnProfile?: (officer: Officer) => void;
}

export default function NavigationDrawer({ isAdmin: isAdminProp, officers, onViewOwnProfile }: NavigationDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);
    const [imgError, setImgError] = useState(false);
    // Self-fetched profile (used when officers prop is not provided)
    const [selfProfile, setSelfProfile] = useState<Officer | null>(null);
    const [selfIsAdmin, setSelfIsAdmin] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const supabase = createClient();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch current auth user
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setCurrentUser({
                    id: user.id,
                    email: user.email?.trim().toLowerCase() || "",
                });
            }
        });
    }, []);

    // Self-fetch profile from Supabase when officers prop is not provided
    useEffect(() => {
        if (officers || !currentUser) return;

        async function fetchSelfProfile() {
            try {
                const { data, error } = await supabase
                    .from("administrative_officers")
                    .select("*")
                    .or(`id.eq.${currentUser!.id},email_address.ilike.${currentUser!.email}`)
                    .limit(1)
                    .maybeSingle();

                if (!error && data) {
                    setSelfProfile(data as Officer);
                    // Admin check: DB first, whitelist fallback
                    const whitelistEntry = WHITELIST_OFFICERS[currentUser!.email];
                    if (data.is_admin === true || whitelistEntry?.is_admin === true) {
                        setSelfIsAdmin(true);
                    }
                }
            } catch {
                // Silently fail — profile just won't show
            }
        }
        fetchSelfProfile();
    }, [officers, currentUser]);

    // Determine admin status: prop > self-fetched > false
    const isAdmin = isAdminProp ?? selfIsAdmin;

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen]);

    // Close on outside click (desktop dropdown)
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        // Delay to avoid immediate close from the trigger click
        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 100);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Find current user's officer profile — from officers prop or self-fetched
    const myProfile = currentUser
        ? (officers
            ? officers.find(
                  (o) =>
                      o.id === currentUser.id ||
                      o.email_address?.trim().toLowerCase() === currentUser.email
              )
            : selfProfile)
        : null;

    const getInitials = (name: string) => {
        const parts = name.trim().split(/[\s,]+/).filter(Boolean);
        if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const getDriveViewUrl = (url: string) => {
        if (!url) return "";
        if (!url.includes("drive.google.com/open?id=")) return url;
        const id = url.split("id=")[1];
        return id ? `/api/image-proxy?id=${id}` : url;
    };

    const showInitials = imgError || !myProfile?.photo_url || myProfile.photo_url === "/default-avatar.png";
    const avatarUrl = myProfile ? getDriveViewUrl(myProfile.photo_url) : "";

    const handleSignOut = async () => {
        if (!confirm("Are you sure you want to sign out?")) return;
        setIsOpen(false);
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const handleProfileClick = () => {
        if (myProfile && onViewOwnProfile) {
            setIsOpen(false);
            onViewOwnProfile(myProfile);
        }
    };

    // --- Avatar Trigger Button ---
    const triggerButton = (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center justify-center w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/20 hover:ring-emerald-400/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
            title="Menu"
            id="nav-drawer-trigger"
        >
            {myProfile && !showInitials ? (
                <img
                    src={avatarUrl}
                    alt={myProfile.full_name}
                    className={`w-full h-full object-cover ${myProfile.photo_position?.startsWith("object-") ? myProfile.photo_position : "object-center"}`}
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white text-xs font-black">
                    {myProfile ? getInitials(myProfile.full_name) : <User size={16} />}
                </div>
            )}
            {/* Online indicator dot */}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0f172a]" />
        </button>
    );

    if (!mounted) return triggerButton;

    // --- Drawer Content ---
    const drawerContent = (
        <>
            {/* Mobile: full-screen backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] sm:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Desktop: transparent overlay to catch outside clicks */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[9997] hidden sm:block"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Panel */}
            <div
                ref={panelRef}
                className={`
                    fixed z-[9999]
                    
                    /* Mobile: slide-in from right, full height */
                    inset-y-0 right-0 w-[82%] max-w-[320px]
                    sm:inset-auto sm:top-14 sm:right-4 sm:w-80 sm:rounded-2xl sm:max-h-[calc(100vh-80px)]
                    
                    bg-[#0f172a]/95 backdrop-blur-xl
                    border-l sm:border border-white/10
                    shadow-2xl shadow-black/40
                    
                    transform transition-all duration-300 ease-out
                    ${isOpen
                        ? "translate-x-0 opacity-100 scale-100"
                        : "translate-x-full sm:translate-x-0 sm:scale-95 opacity-0 pointer-events-none"
                    }
                    
                    flex flex-col overflow-hidden
                `}
            >
                {/* Mobile close button */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 sm:hidden">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Menu</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-all active:scale-90"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Profile Card */}
                <div
                    onClick={handleProfileClick}
                    className={`p-5 ${onViewOwnProfile ? 'cursor-pointer hover:bg-white/5' : ''} transition-colors`}
                >
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-[3px] ring-emerald-500/30 shadow-lg bg-zinc-800 flex-shrink-0">
                            {myProfile && !showInitials ? (
                                <img
                                    src={avatarUrl}
                                    alt={myProfile.full_name}
                                    className={`w-full h-full object-cover ${myProfile.photo_position?.startsWith("object-") ? myProfile.photo_position : "object-center"}`}
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white text-lg font-black">
                                    {myProfile ? getInitials(myProfile.full_name) : <User size={24} />}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm truncate leading-tight">
                                {myProfile?.full_name || "Loading..."}
                            </p>
                            <p className="text-emerald-400/80 text-xs font-medium truncate mt-0.5">
                                {myProfile?.current_mda || ""}
                            </p>
                            {myProfile?.grade_level && (
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1">
                                    {myProfile.grade_level}
                                </p>
                            )}
                        </div>

                        {onViewOwnProfile && (
                            <ChevronRight size={16} className="text-white/30 flex-shrink-0" />
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mx-4" />

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                    >
                        <div className="p-2 bg-white/5 group-hover:bg-indigo-500/20 rounded-lg transition-colors">
                            {theme === "dark" ? (
                                <Moon size={16} className="text-blue-400" />
                            ) : (
                                <Sun size={16} className="text-amber-400" />
                            )}
                        </div>
                        <span className="text-sm font-semibold">
                            {theme === "dark" ? "Dark Mode" : "Light Mode"}
                        </span>
                        <div className={`ml-auto w-9 h-5 rounded-full transition-colors duration-300 flex items-center px-0.5 ${theme === "dark" ? "bg-indigo-500" : "bg-amber-400"}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${theme === "dark" ? "translate-x-4" : "translate-x-0"}`} />
                        </div>
                    </button>

                    {/* Settings */}
                    <Link
                        href="/dashboard/settings"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                    >
                        <div className="p-2 bg-white/5 group-hover:bg-emerald-500/20 rounded-lg transition-colors">
                            <Settings size={16} className="text-emerald-400" />
                        </div>
                        <span className="text-sm font-semibold">Settings</span>
                    </Link>

                    {/* Admin Portal — admin only */}
                    {isAdmin && (
                        <Link
                            href="/admin/approvals"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-yellow-500/10 transition-all duration-200 group"
                        >
                            <div className="p-2 bg-yellow-500/10 group-hover:bg-yellow-500/20 rounded-lg transition-colors">
                                <ShieldCheck size={16} className="text-yellow-400" />
                            </div>
                            <span className="text-sm font-semibold">Admin Portal</span>
                            <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-yellow-500/60 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                Admin
                            </span>
                        </Link>
                    )}
                </nav>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mx-4" />

                {/* Sign Out */}
                <div className="p-3">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                    >
                        <div className="p-2 bg-red-500/10 group-hover:bg-red-500/20 rounded-lg transition-colors">
                            <LogOut size={16} className="text-red-400" />
                        </div>
                        <span className="text-sm font-semibold">Sign Out</span>
                    </button>
                </div>

                {/* Mobile bottom safe area */}
                <div className="h-2 sm:hidden" />
            </div>
        </>
    );

    return (
        <>
            {triggerButton}
            {mounted && createPortal(drawerContent, document.body)}
        </>
    );
}
