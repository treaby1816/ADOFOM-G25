import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. Get Session
    const { data: { user } } = await supabase.auth.getUser()
    const pathname = request.nextUrl.pathname

    // Clean email for comparisons
    const cleanEmail = user?.email?.trim().toLowerCase() || ''

    // 2. Define Route Constants
    const isPublicRoute =
        pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/auth')

    const isAsset =
        pathname.includes('Ondo-Logo.png') ||
        pathname.includes('logo2.jpg')

    // 3. Early Exit for Assets and Public Routes (Unauthenticated)
    if (isAsset) return response
    if (!user && isPublicRoute) return response

    // 4. Redirect unauthenticated users to login
    if (!user && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 5. Master Bypass (Felix)
    if (cleanEmail === 'felixadewole16@gmail.com') {
        // Redirect away from pending if already logged in as superuser
        if (pathname === '/pending-approval') {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return response
    }

    // 6. Authorization Logic (Authenticated Users Only)
    if (user) {
        // Data Fetching: Check local whitelist first, then DB
        const whitelistEntry = WHITELIST_OFFICERS[cleanEmail]
        
        // Use maybeSingle to avoid 500 error on missing row
        const { data: profile } = await supabase
            .from('administrative_officers')
            .select('is_approved, is_admin')
            .eq('id', user.id)
            .maybeSingle()

        const isVerified = !!whitelistEntry || profile?.is_approved === true
        const isAdmin = !!whitelistEntry?.is_admin || profile?.is_admin === true

        // Route Protection Definitions
        const isAdminRoute = pathname.startsWith('/admin')
        const isPendingPage = pathname === '/pending-approval'
        const isSetupPage = pathname.startsWith('/dashboard/setup-profile')

        // A. Admin Access Control
        if (isAdminRoute && !isAdmin) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // B. Verification Enforcement
        if (!isVerified) {
            // Force unverified users to pending-approval (unless on public/setup routes)
            if (!isPendingPage && !isPublicRoute && !isSetupPage) {
                return NextResponse.redirect(new URL('/pending-approval', request.url))
            }
        } else {
            // C. Verified Loop Breaker: Redirect verified away from pending
            if (isPendingPage) {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}