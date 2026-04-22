"use client";

import { useState } from "react";
import {
    Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ChangePasswordFormProps {
    onSuccess?: () => void;
}

export default function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            setError("New password must be different from current password.");
            return;
        }

        setSaving(true);

        try {
            const supabase = createClient();

            // Step 1: Verify current password by re-authenticating
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) {
                setError("Unable to verify your identity. Please sign in again.");
                setSaving(false);
                return;
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            });

            if (signInError) {
                setError("Current password is incorrect.");
                setSaving(false);
                return;
            }

            // Step 2: Update to new password — NO email tokens, NO OTP
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                setError(updateError.message);
                setSaving(false);
                return;
            }

            // Success
            setSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            if (onSuccess) {
                setTimeout(onSuccess, 1500);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-3 pl-10 pr-12 text-sm font-medium text-slate-800 dark:text-zinc-100 outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-zinc-600";
    const labelClass = "flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5";

    if (success) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-white/60 dark:border-zinc-800 p-8 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-emerald-900/30 rounded-full mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-zinc-100 mb-2">Password Updated!</h3>
                <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">
                    Your password has been changed successfully.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-gradient-to-br from-green-700 via-emerald-600 to-green-900 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-950 px-6 py-5">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Lock size={18} />
                    Change Password
                </h3>
                <p className="text-green-100/70 text-xs font-medium mt-1">
                    Verify your current password to set a new one
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Current Password */}
                <div>
                    <label className={labelClass}>
                        <Lock size={12} className="text-emerald-500" />
                        Current Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={14} className="text-slate-400" />
                        </div>
                        <input
                            type={showCurrent ? "text" : "password"}
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={inputClass}
                            placeholder="Enter current password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                        >
                            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div>
                    <label className={labelClass}>
                        <Lock size={12} className="text-emerald-500" />
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={14} className="text-slate-400" />
                        </div>
                        <input
                            type={showNew ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={inputClass}
                            placeholder="Minimum 6 characters"
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                        >
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Confirm New Password */}
                <div>
                    <label className={labelClass}>
                        <Lock size={12} className="text-emerald-500" />
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={14} className="text-slate-400" />
                        </div>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={inputClass}
                            placeholder="Re-enter new password"
                            minLength={6}
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-500 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Submit */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-500 hover:to-emerald-400 shadow-md hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98] transition-all duration-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Lock size={16} />
                                Update Password
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
