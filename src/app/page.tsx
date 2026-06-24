import { createClient } from "@/utils/supabase/server";
import DashboardClient from "@/components/dashboard/DashboardClient";
import HeroSection from "@/components/dashboard/HeroSection";
import WelcomeScreen from "@/components/ui/WelcomeScreen";
import NavigationDrawer from "@/components/ui/NavigationDrawer";
import Link from "next/link";
import { normalizeLGA, normalizeMDA, formatBirthday } from "@/lib/dataConsolidation";
import { WHITELIST_OFFICERS } from "@/lib/whitelist-data";
import { Officer } from "@/types/officer";

const ITEMS_PER_PAGE = 20;

export default async function DashboardPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    const searchParams = (props.searchParams ? await props.searchParams : {}) || {};
    const supabase = await createClient();

    // 1. Auth check — always use getUser() as single source of truth
    // Never rely on cookies alone: they can linger after sign-out and cause
    // blank personalized dashboard bug on Android and Desktop.
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) console.warn("Auth error:", authError.message);

    if (!user) {
      return (
        <div className="animate-fade-in">
          <WelcomeScreen />
        </div>
      );
    }

    // 2. Extract Query Params
    const queryParam = typeof searchParams.q === 'string' ? searchParams.q : "";
    const lgaParam = typeof searchParams.lga === 'string' ? searchParams.lga : "";
    const mdaParam = typeof searchParams.mda === 'string' ? searchParams.mda : "";
    const monthParam = typeof searchParams.month === 'string' ? searchParams.month : "";
    const setParam = typeof searchParams.set === 'string' ? searchParams.set : "";
    const sortParam = typeof searchParams.sort === 'string' ? searchParams.sort : "name-asc";
    const pageParam = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;

    // 3. Parallel Global Data Fetching
    // Fix Timezone: Vercel runs in UTC, but the portal is for Nigeria (Africa/Lagos)
    const lagosTimeStr = new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" });
    const today = new Date(lagosTimeStr);
    const monthIndex = today.getMonth();
    const dayOfMonth = today.getDate();
    const MONTH_NAMES = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const fullMonthName = MONTH_NAMES[monthIndex];
    const shortMonthName = fullMonthName.substring(0, 3);
    const paddedMonth = String(monthIndex + 1).padStart(2, '0');
    const paddedDay = String(dayOfMonth).padStart(2, '0');

    const bdayOrFilter = [
      `birth_month_day.eq.${fullMonthName}/${dayOfMonth}`,
      `birth_month_day.eq.${fullMonthName}/${paddedDay}`,
      `birth_month_day.eq.${shortMonthName}/${paddedDay}`,
      `birth_month_day.eq.${paddedMonth}-${paddedDay}`,
      `birth_month_day.eq.${monthIndex + 1}-${dayOfMonth}`,
      `birth_month_day.eq.${monthIndex + 1}/${dayOfMonth}`,
      `birth_month_day.eq.${paddedMonth}/${paddedDay}`,
    ].join(',');

    const [profileResult, globalResult, bdayResult] = await Promise.all([
      user ? supabase.from("administrative_officers").select("id, is_admin, is_approved").eq("id", user.id).maybeSingle() : Promise.resolve({ data: null }),
      supabase.from("administrative_officers").select("*").eq("is_approved", true).limit(2000),
      supabase.from("administrative_officers").select("*").eq("is_approved", true).or(bdayOrFilter)
    ]);

    const allOfficers = (globalResult.data || []) as Officer[];
    const initialBirthdayOfficers = (bdayResult.data || []) as Officer[];

    // Admin Check
    let isAdmin = false;
    if (user) {
      const userEmail = user.email?.trim().toLowerCase() || '';
      const whitelistEntry = WHITELIST_OFFICERS[userEmail];
      if (profileResult.data?.is_admin === true || whitelistEntry?.is_admin === true) {
        isAdmin = true;
      }
    }

    // 4. Server-side Query for Main Grid Data
    let query = supabase.from("administrative_officers").select("*", { count: "exact" }).eq("is_approved", true);

    if (queryParam) {
      query = query.ilike("full_name", `%${queryParam}%`);
    }
    if (lgaParam) {
      query = query.ilike("lga", `%${lgaParam}%`);
    }
    if (mdaParam) {
      if (allOfficers.length > 0) {
          const matchingRawMdas = [...new Set(
            allOfficers
              .filter(o => normalizeMDA(o.current_mda) === mdaParam && o.current_mda)
              .map(o => o.current_mda)
          )];
          
          if (matchingRawMdas.length > 0) {
            query = query.in("current_mda", matchingRawMdas);
          } else {
            query = query.ilike("current_mda", `%${mdaParam}%`);
          }
      } else {
          query = query.ilike("current_mda", `%${mdaParam}%`);
      }
    }

    if (sortParam === "name-asc") query = query.order("full_name", { ascending: true });
    if (sortParam === "name-desc") query = query.order("full_name", { ascending: false });
    if (sortParam === "level-senior") query = query.order("grade_level", { ascending: false });

    if (setParam) {
      query = query.eq("induction_year", setParam);
    }

    // Ensure valid pagination
    const validPageParam = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const from = (validPageParam - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, count, error: fetchError } = await query;
    if (fetchError) console.error("Grid fetch error:", fetchError.message);
    
    let processedData = (data as Officer[] || []).map(officer => ({
      ...officer,
      lga: normalizeLGA(officer.lga),
      current_mda: normalizeMDA(officer.current_mda),
      birth_month_day: formatBirthday(officer.birth_month_day)
    }));

    if (monthParam) {
      processedData = processedData.filter(o => o.birth_month_day.startsWith(monthParam.substring(0, 3)));
    }

    const uniqueMdasCount = new Set(allOfficers.map(o => normalizeMDA(o.current_mda)).filter(mda => mda && mda !== "Unknown MDA")).size;
    const totalOfficersCount = allOfficers.length;

    return (
      <main className="min-h-screen pb-20">
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-green-950/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-[100] shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-full p-0.5 overflow-hidden shadow-md ring-2 ring-emerald-500/20 block" style={{ backgroundColor: "white" }}>
              <img src="/logo2.jpg" alt="Ondo State Logo" className="w-full h-full object-cover rounded-full bg-white hover:scale-110 transition-transform" />
            </Link>
            <Link href="/">
              <h2 className="text-lg font-bold text-white tracking-tight hidden sm:block hover:text-emerald-300 transition-colors cursor-pointer">
                ADOFOM Portal
              </h2>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <NavigationDrawer
              isAdmin={isAdmin}
              officers={allOfficers}
              filteredOfficers={processedData}
            />
          </div>
        </header>

        <HeroSection totalOfficers={totalOfficersCount} totalMdas={uniqueMdasCount} />
        
        <DashboardClient 
          initialOfficers={processedData}
          initialTotalCount={count || 0}
          allOfficers={allOfficers}
          initialBirthdayOfficers={initialBirthdayOfficers}
          isAdmin={isAdmin}
          queryParam={queryParam}
          lgaParam={lgaParam}
          mdaParam={mdaParam}
          monthParam={monthParam}
          setParam={setParam}
          sortParam={sortParam}
          pageParam={validPageParam}
        />
      </main>
    );
  } catch (error: any) {
    console.error("PAGE CRASH ERROR:", error);
    // Render a raw error output to diagnose Vercel specific issue
    return (
      <div style={{ padding: "50px", color: "red", background: "black", minHeight: "100vh" }}>
        <h1>Page Crashed During SSR!</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>{error.stack}</pre>
      </div>
    );
  }
}
