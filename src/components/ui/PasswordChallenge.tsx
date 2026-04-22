"use client";

import { useState } from "react";
import { Lock, ShieldCheck, Loader2, X, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface PasswordChallengeProps {
    officerEmail: string;
    officerName: string;
    onVerified: () => void;
    onClose: () => void;
}

export default function PasswordChallenge({
    officerEmail,
    officerName,
    onVerified,
    onClose,
}: PasswordChallengeProps) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleVerify = async () => {
        if (!password || password.length < 6) {
            setError("Please enter your password (min. 6 characters).");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log("Verifying password for:", officerEmail);
            const supabase = createClient();

            // Verify identity via signInWithPassword — NO OTP, NO emails
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: officerEmail,
                password,
            });

            if (signInError) {
                console.warn("Password Verification Error:", signInError);
                setError(signInError.message || "Incorrect password. Please try again.");
                setLoading(false);
                return;
            }

            console.log("Password verified successfully for:", officerEmail);
            // Password correct — allow edits
            onVerified();
        } catch (err: any) {
            console.error("Verification Catch Error:", err);
            const errorMsg = typeof err === 'object' ? (err.message || JSON.stringify(err)) : String(err);
            setError(`Verification failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleVerify();
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

            <div
                className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/40 rounded-3xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] max-w-md w-full overflow-hidden animate-modal-in border border-white/60 dark:border-zinc-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-zinc-800/80 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 z-10 cursor-pointer"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="relative bg-gradient-to-br from-green-700 via-emerald-600 to-green-900 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-950 pt-8 pb-10 rounded-t-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-60 mix-blend-overlay" />
                    <div className="relative text-center px-6">
                        <div className="inline-flex items-center justify-center p-4 bg-white/15 rounded-2xl backdrop-blur-md ring-1 ring-white/20 mb-4">
                            <ShieldCheck className="w-8 h-8 text-green-200" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-1">Identity Verification</h2>
                        <p className="text-green-100/80 text-sm font-medium">
                            Enter your password to edit your profile
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 py-8">
                    <div className="text-center mb-6">
                        <p className="text-slate-600 dark:text-zinc-300 text-sm font-medium mb-1 leading-relaxed">
                            To edit <span className="font-bold text-slate-800 dark:text-zinc-100">{officerName}&apos;s</span> profile,
                            please verify your identity:
                        </p>
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5">
                            <Lock size={12} className="text-emerald-500" />
                            Current Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={14} className="text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter your account password"
                                autoFocus
                                className="w-full bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-3 pl-10 pr-12 text-sm font-medium text-slate-800 dark:text-zinc-100 outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-zinc-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm font-medium px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleVerify}
                        disabled={loading || !password}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-500 hover:to-emerald-400 shadow-md hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98] transition-all duration-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <ShieldCheck size={18} />
                                Verify &amp; Continue
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
