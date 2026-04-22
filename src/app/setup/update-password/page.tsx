"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update the actual Auth password
      const { error: authError } = await supabase.auth.updateUser({ password });

      if (authError) {
        toast.error(authError.message);
        setLoading(false);
        return;
      }

      // 2. Flip the flag in your officers table to 'false'
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: dbError } = await supabase
          .from('administrative_officers')
          .update({ needs_password_change: false })
          .eq('id', user.id);

        if (dbError) {
          console.error("Error updating profile flag:", dbError.message);
          toast.error("Password updated, but profile status update failed. Please contact admin.");
        } else {
          toast.success("Security updated successfully! Redirecting...");
          router.push('/dashboard');
          router.refresh();
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl relative z-10 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0 rounded-t-2xl"></div>
        
        <div className="flex justify-center mb-6 text-amber-500">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
            <Lock size={40} />
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-center text-white mb-2 uppercase tracking-tight">Secure Your Account</h1>
        <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed">
          You are using a temporary password. Please set a new, permanent password to unlock the portal.
        </p>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          
          <button
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-4 rounded-xl flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Update & Proceed"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-3 opacity-30 border-t border-slate-800 pt-6">
          <img src="/logo2.jpg" alt="Logo" className="w-5 h-5 rounded-full" />
          <span className="text-white text-[9px] font-black tracking-[0.3em] uppercase">ADOFOM Portal</span>
        </div>
      </div>
    </div>
  );
}
