"use client";

import { useState } from "react";
import { Mail, ShieldCheck, Loader2, X, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface EmailVerificationProps {
    officerEmail: string;
    officerName: string;
    onVerified: () => void;
    onClose: () => void;
}

export default function EmailVerification({
    officerEmail,
    officerName,
    onVerified,
    onClose,
}: EmailVerificationProps) {
    const [step, setStep] = useState<"confirm" | "otp">("confirm");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendOtp = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error: authError } = await supabase.auth.signInWithOtp({
                email: officerEmail,
                options: {
                    shouldCreateUser: true,
                },
            });

            if (authError) {
                setError(authError.message);
            } else {
                setStep("otp");
            }
        } catch {
            setError("Failed to send verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (otp.length !== 6) {
            setError("Please enter the 6-digit code.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email: officerEmail,
                token: otp,
                type: "email",
            });

            if (verifyError) {
                setError(verifyError.message);
            } else {
                onVerified();
            }
        } catch {
            setError("Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const maskedEmail = () => {
        const [user, domain] = officerEmail.split("@");
        if (user.length <= 2) return officerEmail;
        return `${user[0]}${"•".repeat(Math.min(user.length - 2, 6))}${user[user.length - 1]}@${domain}`;
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
                            Verify your email to edit your profile
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 py-8">
                    {step === "confirm" ? (
                        <>
                            <div className="text-center mb-6">
                                <p className="text-slate-600 dark:text-zinc-300 text-sm font-medium mb-4 leading-relaxed">
                                    To edit <span className="font-bold text-slate-800 dark:text-zinc-100">{officerName}&apos;s</span> profile,
                                    we&apos;ll send a 6-digit verification code to:
                                </p>
                                <div className="inline-flex items-center gap-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 px-5 py-3 rounded-2xl">
                                    <Mail size={18} className="text-emerald-500" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">
                                        {maskedEmail()}
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm font-medium px-4 py-3 rounded-xl mb-4">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={sendOtp}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-500 hover:to-emerald-400 shadow-md hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98] transition-all duration-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        <Mail size={18} />
                                        Send Verification Code
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <p className="text-slate-600 dark:text-zinc-300 text-sm font-medium mb-2 leading-relaxed">
                                    Enter the 6-digit code sent to <span className="font-bold">{maskedEmail()}</span>
                                </p>
                                <p className="text-xs text-slate-400 dark:text-zinc-500">
                                    Check your inbox and spam folder
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div className="flex justify-center mb-6">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                                        setOtp(val);
                                    }}
                                    placeholder="000000"
                                    className="w-48 text-center text-3xl font-black tracking-[0.5em] bg-slate-50 dark:bg-zinc-800/60 border-2 border-slate-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl px-4 py-4 outline-none transition-colors text-slate-800 dark:text-zinc-100 placeholder:text-slate-200 dark:placeholder:text-zinc-700"
                                    autoFocus
                                    maxLength={6}
                                    inputMode="numeric"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm font-medium px-4 py-3 rounded-xl mb-4">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={verifyOtp}
                                disabled={loading || otp.length !== 6}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-500 hover:to-emerald-400 shadow-md hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98] transition-all duration-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mb-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={18} />
                                        Verify & Continue
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => { setStep("confirm"); setOtp(""); setError(null); }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 font-medium transition-colors cursor-pointer"
                            >
                                <ArrowLeft size={14} />
                                Resend code
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
