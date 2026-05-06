"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import SplashScreen from "@/components/ui/SplashScreen";

export default function AuthGuardLayout({ children }: { children: React.ReactNode }) {
  // If auth cookie exists, skip loading/splash — render immediately
  const hasAuthCookie = typeof window !== 'undefined' && (() => {
    try { return document.cookie.includes('-auth-token'); } catch { return false; }
  })();
  const [loading, setLoading] = useState(!hasAuthCookie);
  const [showSplash, setShowSplash] = useState(!hasAuthCookie);
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
      setShowSplash(false); // No splash for public routes for maximum speed
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
  // We stay on splash until BOTH the auth check is done AND the splash animation finishes
  if (loading || showSplash) {
    return (
      <SplashScreen 
        message="Verifying Security Status..." 
        onComplete={() => setShowSplash(false)} 
      />
    );
  }

  return <>{children}</>;
}
