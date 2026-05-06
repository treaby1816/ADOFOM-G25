"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthGuardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    // Skip security check entirely for public routes — no session needed
    const publicRoutes = ['/', '/login', '/signup', '/auth'];
    const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
    if (isPublic) {
      setLoading(false);
      return;
    }

    // Safety timeout: never hang for more than 4 seconds
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        console.warn("AuthGuard: Safety timeout reached, unblocking UI.");
        setLoading(false);
      }
    }, 4000);

    const checkSecurityFlags = async () => {
      try {
        // 1. Check Session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session, allow rendering (let middleware/login handle protection)
        if (!session) {
          if (isMounted) setLoading(false);
          return;
        }

        // 2. Fetch the 'needs_password_change' flag (maybeSingle to avoid throwing on 0 rows)
        const { data: officer, error } = await supabase
          .from('administrative_officers')
          .select('needs_password_change')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error || !officer) {
          // If profile not found, they might be a ghost user or just registered
          // We let them through unless the middleware says otherwise
          if (isMounted) setLoading(false);
          return;
        }

        const targetPath = '/setup/update-password';

        // 3. Handle Redirect Logic
        if (officer?.needs_password_change && pathname !== targetPath) {
          router.push(targetPath);
          // Keep loading true while redirecting
        } else {
          if (isMounted) setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Security Guard Exception:", err.message);
          setLoading(false); // Resolve the UI even on failure
        }
      }
    };

    checkSecurityFlags();
    return () => { 
      isMounted = false; 
      clearTimeout(safetyTimer);
    };
  }, [pathname, router, supabase]);

  // Render a professional full-screen loader
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020617]">
        <div className="relative flex items-center justify-center">
          {/* Outer glow effect */}
          <div className="absolute h-32 w-32 animate-pulse rounded-full bg-amber-500/20 blur-2xl" />
          <div className="absolute h-24 w-24 rounded-full border border-amber-500/10 shadow-[0_0_50px_rgba(245,158,11,0.1)]" />
          <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-[10px] font-black tracking-[0.4em] text-amber-500/80 uppercase">
            ADOFOM PORTAL
          </p>
          <p className="text-sm font-medium tracking-widest text-slate-400 uppercase opacity-60">
            Verifying Security Status...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
