"use client";

import { useState, useRef } from "react";
import {
    X, Save, Loader2, Camera, User, Briefcase,
    MapPin, Cake, Heart, Phone, Mail, Award, FileText, CheckCircle2
} from "lucide-react";
import { Officer } from "@/types/officer";
import { supabase } from "@/lib/supabase";

interface ProfileEditFormProps {
    officer: Officer;
    onSave: (updatedOfficer: Officer) => void;
    onClose: () => void;
}

export default function ProfileEditForm({ officer, onSave, onClose }: ProfileEditFormProps) {
    const [form, setForm] = useState({
        current_mda: officer.current_mda || "",
        about_me: officer.about_me || "",
    });

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError("Photo must be under 2MB");
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        setPhotoFile(file);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const getDriveViewUrl = (url: string) => {
        if (!url) return '';
        if (!url.includes('drive.google.com/open?id=')) return url;
        const id = url.split('id=')[1];
        return id ? `/api/image-proxy?id=${id}` : url;
    };

    const handleSubmit = async () => {
        setSaving(true);
        setError(null);

        try {
            let photo_url = officer.photo_url;

            // Upload photo if changed
            if (photoFile) {
                const fileExt = photoFile.name.split('.').pop();
                const fileName = `${officer.id}_${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("officer-photos")
                    .upload(fileName, photoFile, {
                        cacheControl: "3600",
                        upsert: true,
                    });

                if (uploadError) {
                    if (uploadError.message.includes("not found") || uploadError.message.includes("Bucket")) {
                        setError("Photo storage not set up yet. Your text changes will be saved without the photo. Contact admin to create 'officer-photos' bucket.");
                    } else {
                        setError(`Failed to upload photo: ${uploadError.message}`);
                        setSaving(false);
                        return;
                    }
                } else if (uploadData) {
                    const { data: urlData } = supabase.storage
                        .from("officer-photos")
                        .getPublicUrl(uploadData.path);
                    photo_url = urlData.publicUrl;
                }
            }

            // Update the officer record
            const updateData = {
                current_mda: form.current_mda.trim(),
                about_me: form.about_me.trim(),
                photo_url,
            };

            const { error: updateError } = await supabase
                .from("administrative_officers")
                .update(updateData)
                .eq("id", officer.id);

            if (updateError) {
                setError(`Failed to save: ${updateError.message}`);
                return;
            }

            // Success
            setSuccess(true);
            setTimeout(() => {
                onSave({ ...officer, ...updateData });
            }, 1200);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(`Unexpected error: ${message}`);
        } finally {
            setSaving(false);
        }
    };

    const currentImageUrl = photoPreview || getDriveViewUrl(officer.photo_url);

    // Success state
    if (success) {
        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-sm w-full p-10 text-center animate-modal-in border border-white/60 dark:border-zinc-800">
                    <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-emerald-900/30 rounded-full mb-4">
                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-100 mb-2">Profile Updated!</h3>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">
                        Your changes have been saved successfully.
                    </p>
                </div>
            </div>
        );
    }

    const inputClass = "w-full bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-zinc-100 outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-zinc-600";
    const labelClass = "flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5";

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

            <div
                className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/40 rounded-3xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] max-w-lg w-full max-h-[90vh] overflow-y-auto animate-modal-in border border-white/60 dark:border-zinc-800"
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
                <div className="relative bg-gradient-to-br from-green-700 via-emerald-600 to-green-900 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-950 pt-8 pb-6 rounded-t-3xl overflow-hidden text-center px-6">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-60 mix-blend-overlay" />
                    <h2 className="relative text-2xl font-black text-white mb-1">Update Profile</h2>
                    <p className="relative text-green-100/80 text-sm font-medium">{officer.full_name}</p>
                </div>

                {/* Photo Upload */}
                <div className="flex justify-center -mt-12 relative z-10 mb-4">
                    <div
                        className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-900 shadow-xl bg-white dark:bg-zinc-900 group cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => fileInputRef.current?.click()}
                        title="Click to change photo"
                    >
                        {currentImageUrl ? (
                            <img
                                src={currentImageUrl}
                                alt={officer.full_name}
                                className="w-full h-full object-cover object-top"
                            />
                        ) : (
                            <div className="w-full h-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <User size={32} className="text-emerald-500" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={20} className="text-white" />
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoSelect}
                    />
                </div>

                {/* Form */}
                <div className="px-6 pb-6 space-y-4">
                    <div className="text-center mb-2">
                        <p className="text-xs text-slate-400 dark:text-zinc-500">
                            Updating your official profile information
                        </p>
                    </div>

                    {/* Current MDA */}
                    <div>
                        <label className={labelClass}>
                            <Briefcase size={12} className="text-emerald-500" />
                            Current MDA
                        </label>
                        <input
                            type="text"
                            value={form.current_mda}
                            onChange={(e) => handleChange("current_mda", e.target.value)}
                            className={inputClass}
                            placeholder="Ministry/Department/Agency"
                        />
                    </div>

                    {/* About Me */}
                    <div>
                        <label className={labelClass}>
                            <FileText size={12} className="text-emerald-500" />
                            About Me
                        </label>
                        <textarea
                            value={form.about_me}
                            onChange={(e) => handleChange("about_me", e.target.value)}
                            className={`${inputClass} resize-none h-32`}
                            placeholder="Tell us about yourself, your roles, and responsibilities..."
                        />
                    </div>

                    {/* Non-editable info notice */}
                    <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800/50">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 mb-2">Notice</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                            To update your <span className="font-semibold">Full Name</span>, <span className="font-semibold">Grade Level</span>, or <span className="font-semibold">Email</span>, please contact the Personnel Department.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm font-medium px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all text-sm cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-500 hover:to-emerald-400 shadow-md hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98] transition-all duration-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
