"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    X, Save, Loader2, Camera, User, Briefcase,
    MapPin, Cake, Heart, Phone, Award, FileText, CheckCircle2,
    Facebook, Twitter, Instagram, Share2, Link as LinkIcon
} from "lucide-react";
import { Officer } from "@/types/officer";
import { createClient } from "@/utils/supabase/client";
import { normalizeMDA, normalizeLGA, ONDO_LGAS, ONDO_MDAS } from "@/lib/dataConsolidation";
import { WHITELIST_OFFICERS } from "@/lib/whitelist-data";
import BirthdaySelect, { parseBirthdayValue, formatBirthdayValue, isValidBirthday } from "@/components/ui/BirthdaySelect";
import SearchableCombobox from "@/components/ui/SearchableCombobox";
import { GraduationCap } from "lucide-react";

interface EditProfileFormModalProps {
    officer: Officer;
    onSave: (updatedOfficer: Officer) => void;
    onClose: () => void;
}

interface ProfileFormValues {
    full_name: string;
    phone_number: string;
    secondary_phone_number?: string;
    current_mda: string;
    grade_level: string;
    lga: string;
    hobbies: string;
    about_me: string;
    photo_position: string;
    facebook_url?: string;
    twitter_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
    exco_portfolio?: string;
    induction_year?: string;
    professional_certificate?: string;
    professional_bodies?: string;
    portfolio_url?: string;
}

export default function EditProfileFormModal({ officer, onSave, onClose }: EditProfileFormModalProps) {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileFormValues>({
        defaultValues: {
            full_name: officer.full_name || "",
            phone_number: officer.phone_number || "",
            secondary_phone_number: officer.secondary_phone_number || "",
            current_mda: officer.current_mda || "",
            grade_level: officer.grade_level || "",
            lga: officer.lga || "",
            hobbies: officer.hobbies || "",
            about_me: officer.about_me || "",
            photo_position: officer.photo_position || "object-center",
            facebook_url: officer.facebook_url || "",
            twitter_url: officer.twitter_url || "",
            instagram_url: officer.instagram_url || "",
            linkedin_url: officer.linkedin_url || "",
            exco_portfolio: officer.exco_portfolio || "",
            induction_year: officer.induction_year || "",
            professional_certificate: officer.professional_certificate || "",
            professional_bodies: officer.professional_bodies || "",
            portfolio_url: officer.portfolio_url || "",
        }
    });

    const photo_position = watch("photo_position");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Birthday state — single string in "Month/Day" format (e.g. "May/27")
    const parsedBday = parseBirthdayValue(officer.birth_month_day || "");
    const [birthday, setBirthday] = useState(
        parsedBday.month && parsedBday.day
            ? formatBirthdayValue(parsedBday.month, parsedBday.day)
            : ""
    );
    const [birthdayError, setBirthdayError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check if the current user is an admin
    useEffect(() => {
        const checkAdmin = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const userEmail = user.email?.trim().toLowerCase() || "";
                const whitelistEntry = WHITELIST_OFFICERS[userEmail];
                if (whitelistEntry?.is_admin) {
                    setIsAdmin(true);
                    return;
                }
                const { data } = await supabase.from('administrative_officers').select('is_admin').eq('id', user.id).maybeSingle();
                if (data?.is_admin) setIsAdmin(true);
            }
        };
        checkAdmin();
    }, []);

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError("Photo must be under 2MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        setPhotoFile(file);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const getDriveViewUrl = (url: string) => {
        if (!url) return '';
        if (!url.includes('drive.google.com/open?id=')) return url;
        const id = url.split('id=')[1];
        return id ? `/api/image-proxy?id=${id}` : url;
    };

    const onSubmit = async (data: ProfileFormValues) => {
        setSaving(true);
        setError(null);
        const supabase = createClient();

        try {
            // Get the authenticated user's ID — RLS requires id = auth.uid()
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError("Session expired. Please log in again.");
                setSaving(false);
                return;
            }
            const authUid = user.id;

            let photo_url = officer.photo_url;

            if (photoFile) {
                const fileExt = photoFile.name.split('.').pop();
                const fileName = `${authUid}_${Date.now()}.${fileExt}`;
                const bucketNames = ["officer-photos", "OFFICER-PHOTOS"];
                let uploadSuccessful = false;
                let lastUploadError: any = null;

                for (const bucket of bucketNames) {
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from(bucket)
                        .upload(fileName, photoFile, { cacheControl: "3600", upsert: true });

                    if (uploadError) {
                        lastUploadError = uploadError;
                        if (uploadError.message.toLowerCase().includes("not found") || (uploadError as any).status === 404) {
                            continue;
                        }
                        break;
                    }
                    if (uploadData) {
                        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
                        photo_url = urlData.publicUrl;
                        uploadSuccessful = true;
                        break;
                    }
                }

                if (!uploadSuccessful) {
                    const errorMsg = lastUploadError?.message || "Unknown storage error";
                    setDebugInfo(JSON.stringify(lastUploadError, null, 2));
                    if (errorMsg.includes("not found")) {
                        setError("Error: Storage bucket 'officer-photos' not found. Please verify the bucket name in your Supabase storage tab.");
                    } else if (errorMsg.toLowerCase().includes("row-level security") || errorMsg.toLowerCase().includes("permission") || (lastUploadError as any).status === 403) {
                        setError("Error: Database permission denied. Your 'authenticated' role doesn't have INSERT permission for this bucket.");
                    } else {
                        setError(`Failed to upload photo: ${errorMsg}`);
                    }
                    setSaving(false);
                    return;
                }
            }

            let formattedName = data.full_name.trim();
            if (formattedName) {
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

            // Validate birthday before saving
            if (birthday && !isValidBirthday(birthday)) {
                setBirthdayError("Please select a valid month and day.");
                setSaving(false);
                return;
            }
            setBirthdayError(null);

            const updateData: Record<string, string | null | undefined> = {
                full_name: formattedName,
                phone_number: data.phone_number.trim(),
                secondary_phone_number: data.secondary_phone_number?.trim() || "",
                current_mda: normalizeMDA(data.current_mda),
                grade_level: data.grade_level.trim(),
                lga: normalizeLGA(data.lga),
                birth_month_day: birthday || (officer.birth_month_day || ""),
                hobbies: data.hobbies.trim(),
                about_me: data.about_me.trim(),
                photo_url,
                photo_position: data.photo_position,
                facebook_url: data.facebook_url?.trim() || "",
                twitter_url: data.twitter_url?.trim() || "",
                instagram_url: data.instagram_url?.trim() || "",
                linkedin_url: data.linkedin_url?.trim() || "",
                induction_year: data.induction_year?.trim() || "",
                professional_certificate: data.professional_certificate?.trim() || "",
                professional_bodies: data.professional_bodies?.trim() || "",
                portfolio_url: data.portfolio_url?.trim() || "",
            };



            // Use the officer's actual row ID from the prop — this is the known primary key
            // We try officer.id first, then auth.uid, then email as fallbacks
            const userEmail = user.email?.trim().toLowerCase() || "";
            const targetId = officer.id; // The row we're editing — always correct

            // Strategy 1: Update by officer.id (the row's actual PK)
            let { data: returnedData, error: updateError } = await supabase
                .from("administrative_officers")
                .update(updateData)
                .eq("id", targetId)
                .select();

            if (updateError) {
                // Check if it's an RLS permission error
                if (updateError.message.includes("policy") || updateError.message.includes("permission") || updateError.code === "42501") {
                    setError("Permission denied: The database blocked this update. Please check Supabase RLS policies.");
                } else {
                    setError(`Failed to save: ${updateError.message}`);
                }
                return;
            }

            // Strategy 2: If officer.id didn't work, try auth.uid
            if ((!returnedData || returnedData.length === 0) && authUid !== targetId) {
                const { data: authData, error: authError } = await supabase
                    .from("administrative_officers")
                    .update(updateData)
                    .eq("id", authUid)
                    .select();

                if (!authError && authData && authData.length > 0) {
                    returnedData = authData;
                }
            }

            // Strategy 3: Last resort — try by email
            if ((!returnedData || returnedData.length === 0) && userEmail) {
                const { data: emailData, error: emailError } = await supabase
                    .from("administrative_officers")
                    .update(updateData)
                    .ilike("email_address", userEmail)
                    .select();

                if (!emailError && emailData && emailData.length > 0) {
                    returnedData = emailData;
                }
            }

            if (!returnedData || returnedData.length === 0) {
                // RLS is blocking all updates — provide clear guidance
                setError("Permission denied: The database blocked this update. Please check Supabase RLS policies.");
                setDebugInfo(`Tried: officer.id=${targetId}, auth.uid=${authUid}, email=${userEmail}`);
                return;
            }

            setSuccess(true);
            setTimeout(() => onSave({ ...officer, ...updateData }), 1200);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(`Unexpected error: ${message}`);
        } finally {
            setSaving(false);
        }
    };

    const currentImageUrl = photoPreview || getDriveViewUrl(officer.photo_url);

    if (success) {
        return (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-sm w-full p-10 text-center animate-modal-in border border-white/60 dark:border-zinc-800">
                    <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-emerald-900/30 rounded-full mb-4">
                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-100 mb-2">Profile Updated!</h3>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Your changes have been saved successfully.</p>
                </div>
            </div>
        );
    }

    const inputClass = "w-full bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-zinc-100 outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-zinc-600";
    const labelClass = "flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5";

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
            <div
                className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-emerald-950/40 rounded-3xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] max-w-lg w-full max-h-[90vh] overflow-y-auto animate-modal-in border border-white/60 dark:border-zinc-800"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-zinc-800/80 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 z-10 cursor-pointer"
                >
                    <X size={18} />
                </button>

                <div className="relative bg-gradient-to-br from-green-700 via-emerald-600 to-green-900 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-950 pt-8 pb-6 rounded-t-3xl overflow-hidden text-center px-6">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-60 mix-blend-overlay" />
                    <h2 className="relative text-2xl font-black text-white mb-1">Update Profile</h2>
                    <p className="relative text-green-100/80 text-sm font-medium">{officer.full_name}</p>
                </div>

                <div className="flex flex-col items-center -mt-12 relative z-10 mb-6">
                    <input type="file" ref={fileInputRef} onChange={handlePhotoSelect} accept="image/*" className="hidden" />
                    <div onClick={() => fileInputRef.current?.click()} className="group relative w-32 h-32 rounded-full overflow-hidden ring-[6px] ring-white dark:ring-zinc-900 shadow-2xl bg-white dark:bg-zinc-900 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300">
                        {currentImageUrl ? (
                            <img src={currentImageUrl} alt={officer.full_name} className={`w-full h-full object-cover ${photo_position}`} />
                        ) : (
                            <div className="w-full h-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <User size={40} className="text-emerald-500" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                            <Camera size={24} className="text-white mb-1" />
                            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change Photo</span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col items-center gap-3 w-full px-12">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer">
                            <Camera size={14} /> Browse Photo to Replace
                        </button>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-center">Maximum size: 2MB. Format: JPG, PNG</p>
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
                                    onClick={() => setValue("photo_position", pos.id)}
                                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all ${photo_position === pos.id ? 'bg-white dark:bg-emerald-500 text-emerald-700 dark:text-white shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-300'}`}
                                >
                                    {pos.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
                    <div className="text-center mb-2">
                        <p className="text-xs text-slate-400 dark:text-zinc-500">Updating your official profile information</p>
                    </div>

                    <div>
                        <label className={labelClass}>
                            <User size={12} className="text-emerald-500" />
                            Full Name <span className="text-[8px] text-slate-400 font-normal ml-1">(Locked)</span>
                        </label>
                        <input type="text" {...register("full_name")} readOnly className={`${inputClass} opacity-70 cursor-not-allowed bg-slate-100/50`} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <Briefcase size={12} className="text-emerald-500" /> Current MDA
                            </label>
                            <SearchableCombobox
                                name="current_mda"
                                value={watch("current_mda")}
                                onChange={(val) => setValue("current_mda", val, { shouldValidate: true })}
                                options={ONDO_MDAS}
                                placeholder="Search MDA or type to add new..."
                                required
                            />
                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">Can&apos;t find your MDA? Type it in to add.</p>
                            {errors.current_mda && <span className="text-[10px] text-red-500 mt-1">{errors.current_mda.message}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>
                                <GraduationCap size={12} className="text-emerald-500" /> Grade Level / Retired
                            </label>
                            <select {...register("grade_level")} className={`${inputClass} appearance-none`}>
                                <option value="" className="bg-slate-900">Select Level</option>
                                {Array.from({ length: 10 }, (_, i) => String(i + 8).padStart(2, '0'))
                                    .filter(level => level !== '08' && level !== '11')
                                    .map(level => (
                                    <option key={level} value={`GL ${level}`} className="bg-slate-900">GL {level}</option>
                                ))}
                                <option value="Retired" className="bg-slate-900 text-emerald-500 font-bold">Retired</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <Briefcase size={12} className="text-emerald-500" /> ADOFOM Set (Induction Year)
                            </label>
                            <select {...register("induction_year")} className={`${inputClass} appearance-none`}>
                                <option value="" className="bg-slate-900">Select Year</option>
                                {Array.from({ length: 2026 - 1960 + 1 }, (_, i) => String(2026 - i)).map(year => (
                                    <option key={year} value={year} className="bg-slate-900">{year} Set</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>
                                <MapPin size={12} className="text-emerald-500" /> Local Government (LGA)
                            </label>
                            <select {...register("lga")} className={`${inputClass} appearance-none`}>
                                <option value="">-- Select LGA --</option>
                                {ONDO_LGAS.map(lga => (
                                    <option key={lga} value={lga}>{lga}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <Award size={12} className="text-emerald-500" /> Professional Certificate (Optional)
                            </label>
                            <input type="text" {...register("professional_certificate")} className={inputClass} placeholder="e.g. CIPM, ICAN, ACCA, COREN" />
                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">Acronyms accepted — separate with commas</p>
                        </div>
                        <div>
                            <label className={labelClass}>
                                <Briefcase size={12} className="text-emerald-500" /> Professional Bodies (Optional)
                            </label>
                            <textarea {...register("professional_bodies")} className={`${inputClass} resize-none h-20`} placeholder="e.g. Nigerian Institute of Management, Chartered Institute of Personnel Management of Nigeria" />
                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">Full body name — separate multiple with commas</p>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>
                            <LinkIcon size={12} className="text-emerald-500" /> Portfolio / Personal Website (Optional)
                        </label>
                        <input type="url" {...register("portfolio_url")} className={inputClass} placeholder="https://yourportfolio.com or LinkedIn, GitHub, etc." />
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">Link to your professional portfolio, personal site, or work profile</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <Cake size={12} className="text-emerald-500" /> Birthday
                            </label>
                            <BirthdaySelect
                                value={birthday}
                                onChange={setBirthday}
                                error={birthdayError || undefined}
                                variant="light"
                            />
                        </div>
                        <div>
                            {/* Empty space or we can put something else here, or leave Birthday full width. Let's make it full width if it's alone in the grid */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <Phone size={12} className="text-emerald-500" /> Phone Number
                            </label>
                            <input type="tel" {...register("phone_number", { required: "Phone is required" })} className={inputClass} placeholder="e.g. 2348012345678" />
                            {errors.phone_number && <span className="text-[10px] text-red-500 mt-1">{errors.phone_number.message}</span>}
                        </div>
                        <div>
                            <label className={labelClass}>
                                <Phone size={12} className="text-emerald-500" /> Sec. Phone (Optional)
                            </label>
                            <input type="tel" {...register("secondary_phone_number")} className={inputClass} placeholder="e.g. 2348012345679" />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>
                            <Heart size={12} className="text-emerald-500" /> Hobbies
                        </label>
                        <input type="text" {...register("hobbies")} className={inputClass} placeholder="Reading, Music" />
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 dark:border-zinc-800/50">
                        <p className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Share2 size={14} className="text-emerald-500" /> Social Links (Optional)
                        </p>
                        <div className="space-y-3">
                            <div>
                                <label className={labelClass}>
                                    <Facebook size={12} className="text-blue-600 dark:text-blue-400" /> Facebook Profile URL
                                </label>
                                <input type="url" {...register("facebook_url")} className={inputClass} placeholder="https://facebook.com/username" />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    <Twitter size={12} className="text-sky-500" /> X (Twitter) Profile URL
                                </label>
                                <input type="url" {...register("twitter_url")} className={inputClass} placeholder="https://x.com/username" />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    <Instagram size={12} className="text-pink-600 dark:text-pink-400" /> Instagram Profile URL
                                </label>
                                <input type="url" {...register("instagram_url")} className={inputClass} placeholder="https://instagram.com/username" />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700 dark:text-blue-500"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LinkedIn Profile URL
                                </label>
                                <input type="url" {...register("linkedin_url")} className={inputClass} placeholder="https://linkedin.com/in/username" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>
                            <FileText size={12} className="text-emerald-500" /> About Me
                        </label>
                        <textarea {...register("about_me")} className={`${inputClass} resize-none h-32`} placeholder="Tell us about yourself, your roles, and responsibilities..." />
                    </div>

                    <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800/50">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 mb-2">Notice</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                            Your <span className="font-semibold">Email</span> address is locked to your account identity. To change your registered email, please contact the Personnel Department.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm font-medium px-4 py-3 rounded-xl overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                                <X size={14} className="text-red-500" />
                                <span>{error}</span>
                            </div>
                            {debugInfo && (
                                <div className="mt-2 pt-2 border-t border-red-200/50 dark:border-red-800/50">
                                    <p className="text-[10px] font-bold text-red-400 dark:text-red-500 uppercase tracking-tighter mb-1">Technical Debug Info:</p>
                                    <pre className="text-[9px] font-mono whitespace-pre-wrap opacity-60">{debugInfo}</pre>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all text-sm cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-500 hover:to-emerald-400 shadow-md hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98] transition-all duration-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
