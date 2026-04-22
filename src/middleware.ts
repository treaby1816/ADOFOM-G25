import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

    const isPendingPage = pathname === '/pending-approval'
    const isForcePasswordPage = pathname === '/dashboard/force-password-change'
    const isSetupPage = pathname.startsWith('/dashboard/setup-profile')
    const isAdminRoute = pathname.startsWith('/admin')
    const isSettingsRoute = pathname.startsWith('/dashboard/settings')

    // 3. Early Exit for Assets
    if (isAsset) return response

    // 4. Unauthenticated users
    if (!user && isPublicRoute) return response
    if (!user && isPendingPage) return NextResponse.redirect(new URL('/login', request.url))
    if (!user && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 5. Authenticated users — redirect away from login/signup
    if (user && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 6. Authenticated user — fetch profile for authorization checks
    if (user) {
        const isFelix = cleanEmail === 'felixadewole16@gmail.com'

        // Fetch profile data
        const { data: profile } = await supabase
            .from('administrative_officers')
            .select('is_approved, is_admin, must_change_password')
            .eq('id', user.id)
            .maybeSingle()

        const isApproved = isFelix || profile?.is_approved === true
        const isAdmin = isFelix || profile?.is_admin === true
        const mustChangePassword = profile?.must_change_password === true

        // A. Force Password Change Enforcement
        // If user must change password, only allow the force-change page
        if (mustChangePassword && !isFelix) {
            if (!isForcePasswordPage) {
                return NextResponse.redirect(new URL('/dashboard/force-password-change', request.url))
            }
            return response
        }

        // B. Already changed password — redirect away from force-change page
        if (!mustChangePassword && isForcePasswordPage) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // C. Admin Route Access Control
        if (isAdminRoute && !isAdmin) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // D. Approval Enforcement
        if (!isApproved) {
            // Unapproved users can only access: pending-approval, setup-profile, settings, force-password-change
            if (!isPendingPage && !isSetupPage && !isForcePasswordPage && !isSettingsRoute) {
                return NextResponse.redirect(new URL('/pending-approval', request.url))
            }
        } else {
            // E. Approved user on pending page → redirect away
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