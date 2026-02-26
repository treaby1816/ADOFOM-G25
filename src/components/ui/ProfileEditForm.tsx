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
        full_name: officer.full_name || "",
        phone_number: officer.phone_number || "",
        current_mda: officer.current_mda || "",
        grade_level: officer.grade_level || "",
        lga: officer.lga || "",
        birth_month_day: officer.birth_month_day || "",
        hobbies: officer.hobbies || "",
        about_me: officer.about_me || "",
        photo_position: officer.photo_position || "object-center",
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

                // Try lowercase bucket first, then uppercase if it fails with "not found"
                const bucketNames = ["officer-photos", "OFFICER-PHOTOS"];
                let uploadSuccessful = false;
                let lastUploadError: any = null;

                for (const bucket of bucketNames) {
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from(bucket)
                        .upload(fileName, photoFile, {
                            cacheControl: "3600",
                            upsert: true,
                        });

                    if (uploadError) {
                        lastUploadError = uploadError;
                        // If it's a "bucket not found" error, try the next casing
                        if (uploadError.message.toLowerCase().includes("not found") || (uploadError as any).status === 404) {
                            continue;
                        }
                        // For other errors (like RLS), stop and show error
                        break;
                    }

                    if (uploadData) {
                        const { data: urlData } = supabase.storage
                            .from(bucket)
                            .getPublicUrl(uploadData.path);
                        photo_url = urlData.publicUrl;
                        uploadSuccessful = true;
                        break;
                    }
                }

                if (!uploadSuccessful) {
                    console.error("Supabase Storage Error:", lastUploadError);
                    const errorMsg = lastUploadError?.message || "Unknown storage error";

                    if (errorMsg.includes("not found")) {
                        setError("Error: Storage bucket 'officer-photos' not found. Please verify the bucket name in Supabase.");
                    } else if (errorMsg.includes("row-level security") || errorMsg.includes("new row violates")) {
                        setError("Error: Permission denied. Please ensure Storage RLS policies are set to 'Authenticated' for uploads.");
                    } else {
                        setError(`Failed to upload photo: ${errorMsg}`);
                    }
                    setSaving(false);
                    return;
                }
            }

            // Standardize format: SURNAME, Other Names
            let formattedName = form.full_name.trim();
            if (formattedName) {
                // Remove existing commas to re-parse cleanly
                const cleanName = formattedName.replace(/,/g, ' ').trim();
                const parts = cleanName.split(/\s+/);
                if (parts.length > 0) {
                    const surname = parts[0].toUpperCase();
                    const otherNames = parts.slice(1).map(part =>
                        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                    ).join(' ');
                    formattedName = otherNames ? `${surname}, ${otherNames}` : surname;
                }
            }

            // Update the officer record
            const updateData = {
                full_name: formattedName,
                phone_number: form.phone_number.trim(),
                current_mda: form.current_mda.trim(),
                grade_level: form.grade_level.trim(),
                lga: form.lga.trim(),
                birth_month_day: form.birth_month_day.trim(),
                hobbies: form.hobbies.trim(),
                about_me: form.about_me.trim(),
                photo_url,
                photo_position: form.photo_position,
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
                <div className="flex flex-col items-center -mt-12 relative z-10 mb-6">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoSelect}
                        accept="image/*"
                        className="hidden"
                    />
                    <div
                        className="relative w-32 h-32 rounded-full overflow-hidden ring-[6px] ring-white dark:ring-zinc-900 shadow-2xl bg-white dark:bg-zinc-900 group cursor-pointer hover:scale-105 transition-all duration-300"
                        onClick={() => fileInputRef.current?.click()}
                        title="Click to change photo"
                    >
                        {currentImageUrl ? (
                            <img
                                src={currentImageUrl}
                                alt={officer.full_name}
                                className={`w-full h-full object-cover ${form.photo_position}`}
                            />
                        ) : (
                            <div className="w-full h-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <User size={40} className="text-emerald-500" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Camera size={24} className="text-white mb-1" />
                            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                        >
                            <Camera size={14} />
                            Upload New Profile Picture
                        </button>

                        {/* Position Selector */}
                        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-zinc-700/50 shadow-inner">
                            <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-2">Position:</span>
                            {[
                                { id: 'object-top', label: 'Top' },
                                { id: 'object-center', label: 'Center' },
                                { id: 'object-bottom', label: 'Bottom' }
                            ].map((pos) => (
                                <button
                                    key={pos.id}
                                    type="button"
                                    onClick={() => handleChange("photo_position", pos.id)}
                                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all ${form.photo_position === pos.id
                                        ? 'bg-white dark:bg-emerald-500 text-emerald-700 dark:text-white shadow-sm'
                                        : 'text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-300'
                                        }`}
                                >
                                    {pos.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="px-6 pb-6 space-y-4">
                    <div className="text-center mb-2">
                        <p className="text-xs text-slate-400 dark:text-zinc-500">
                            Updating your official profile information
                        </p>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className={labelClass}>
                            <User size={12} className="text-emerald-500" />
                            Full Name <span className="text-[8px] text-slate-400 font-normal ml-1">(Locked)</span>
                        </label>
                        <input
                            type="text"
                            value={form.full_name}
                            readOnly
                            className={`${inputClass} opacity-70 cursor-not-allowed bg-slate-100/50`}
                            placeholder="Enter full name"
                        />
                    </div>

                    {/* MDA & Grade Level */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <div>
                            <label className={labelClass}>
                                <Award size={12} className="text-emerald-500" />
                                Grade Level
                            </label>
                            <input
                                type="text"
                                value={form.grade_level}
                                onChange={(e) => handleChange("grade_level", e.target.value)}
                                className={inputClass}
                                placeholder="e.g. GL 12"
                            />
                        </div>
                    </div>

                    {/* LGA & Birthday */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <MapPin size={12} className="text-emerald-500" />
                                LGA <span className="text-[8px] text-slate-400 font-normal ml-1">(Locked)</span>
                            </label>
                            <input
                                type="text"
                                value={form.lga}
                                readOnly
                                className={`${inputClass} opacity-70 cursor-not-allowed bg-slate-100/50`}
                                placeholder="Local Government Area"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                <Cake size={12} className="text-emerald-500" />
                                Birthday <span className="text-[8px] text-slate-400 font-normal ml-1">(Locked)</span>
                            </label>
                            <input
                                type="text"
                                value={form.birth_month_day}
                                readOnly
                                className={`${inputClass} opacity-70 cursor-not-allowed bg-slate-100/50`}
                                placeholder="e.g. February 20"
                            />
                        </div>
                    </div>

                    {/* Phone & Hobbies */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <Phone size={12} className="text-emerald-500" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={form.phone_number}
                                onChange={(e) => handleChange("phone_number", e.target.value)}
                                className={inputClass}
                                placeholder="e.g. 2348012345678"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                <Heart size={12} className="text-emerald-500" />
                                Hobbies
                            </label>
                            <input
                                type="text"
                                value={form.hobbies}
                                onChange={(e) => handleChange("hobbies", e.target.value)}
                                className={inputClass}
                                placeholder="Reading, Music"
                            />
                        </div>
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
                            Your <span className="font-semibold">Email</span> address is locked to your account identity. To change your registered email, please contact the Personnel Department.
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
