import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request: { headers: request.headers } })
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: { getAll() { return request.cookies.getAll() }, setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)) }, },
    })

    // Refresh the session token
    await supabase.auth.getSession()

    const { data: { user } } = await supabase.auth.getUser()

    const rawEmail = user?.email || ''
    const cleanEmail = rawEmail.trim().toLowerCase()

    // ★ MASTER BYPASS: Felix gets unrestricted access to ALL pages (Case-insensitive)
    if (cleanEmail === 'felixadewole16@gmail.com') {
        return response
    }

    // 1. PUBLIC ROUTES & ASSETS
    const isPublicRoute = request.nextUrl.pathname.startsWith('/login') || 
                         request.nextUrl.pathname.startsWith('/signup') || 
                         request.nextUrl.pathname.startsWith('/auth') || 
                         request.nextUrl.pathname.includes('Ondo-Logo.png') ||
                         request.nextUrl.pathname.includes('logo2.jpg')

    // 2. AUTH CHECK
    if (!user && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. ADMIN & APPROVAL CHECK (For all other users)
    if (user && cleanEmail !== 'felixadewole16@gmail.com') {
        const isWhitelisted = !!WHITELIST_OFFICERS[cleanEmail]
        const whitelistIsAdmin = WHITELIST_OFFICERS[cleanEmail]?.is_admin === true

        const { data: profile } = await supabase
            .from('administrative_officers')
            .select('is_approved, is_admin')
            .eq('id', user.id)
            .single()

        const isPendingPage = request.nextUrl.pathname.startsWith('/pending-approval')
        const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
        const isSetupProfilePage = request.nextUrl.pathname.startsWith('/dashboard/setup-profile')

        // A. Admin Route Protection
        // Allow if DB says admin, OR if the hardcoded whitelist says admin
        const actuallyAdmin = profile?.is_admin || whitelistIsAdmin
        if (isAdminRoute && !actuallyAdmin) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // B. Approval Check
        // If they are on the whitelist, they are instantly verified. Otherwise check DB.
        const isVerified = isWhitelisted || profile?.is_approved

        // If they are not approved, they can only view public routes, the pending page, or setup profile
        if (!isVerified && !isPublicRoute && !isPendingPage && !isSetupProfilePage) {
            return NextResponse.redirect(new URL('/pending-approval', request.url))
        }

        // C. Redirect away from pending if already verified
        if (isVerified && isPendingPage) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] }
