import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'

export async function proxy(request: NextRequest) {
    try {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        })

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Middleware: Missing Supabase environment variables');
            return response;
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
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

        // 1. Get Session with safe destructuring
        const authResponse = await supabase.auth.getUser()
        const user = authResponse?.data?.user
        const pathname = request.nextUrl.pathname

        // Clean email for comparisons
        const cleanEmail = user?.email?.trim().toLowerCase() || ''

        // 2. Define Route Constants
        const isPublicRoute =
            pathname === '/' ||
            pathname.startsWith('/login') ||
            pathname.startsWith('/signup') ||
            pathname.startsWith('/auth')

        const isAsset =
            pathname.includes('Ondo-Logo.png') ||
            pathname.includes('logo2.jpg')

        const isPendingPage = pathname === '/pending-approval'
        const isForcePasswordPage = pathname === '/setup/update-password'
        const isSetupPage = pathname.startsWith('/dashboard/setup-profile')
        const isAdminRoute = pathname.startsWith('/admin')
        const isSettingsRoute = pathname.startsWith('/dashboard/settings')

        // 3. Early Exit for Assets
        if (isAsset) return response

        // 4. Unauthenticated users
        if (!user) {
            if (isPublicRoute) return response
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // 5. Authenticated users — redirect away from login/signup (but NOT from root /)
        if (isPublicRoute && pathname !== '/') {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // 6. Authenticated user — fetch profile for authorization checks
        const isFelix = cleanEmail === 'felixadewole16@gmail.com'
        let profile = null;

        try {
            // Fetch profile data
            const { data, error: profileError } = await supabase
                .from('administrative_officers')
                .select('is_approved, is_admin, needs_password_change')
                .eq('id', user.id)
                .maybeSingle()

            if (profileError) {
                console.warn('Middleware Profile Query Issue (likely RLS):', profileError.message);
            } else {
                profile = data;
            }
        } catch (dbErr) {
            console.error('Middleware Database Exception:', dbErr);
            // Non-blocking: continue as unprivileged user if query fails
        }

        const isOnWhitelist = !!WHITELIST_OFFICERS[cleanEmail]
        const isApproved = isFelix || isOnWhitelist || profile?.is_approved === true
        const isAdmin = isFelix || profile?.is_admin === true
        const needsPasswordChange = profile?.needs_password_change === true

        // A. Force Password Change Enforcement
        if (needsPasswordChange && !isFelix) {
            if (!isForcePasswordPage) {
                return NextResponse.redirect(new URL('/setup/update-password', request.url))
            }
            return response
        }

        // B. Already changed password — redirect away from force-change page
        if (!needsPasswordChange && isForcePasswordPage) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // C. Admin Route Access Control
        if (isAdminRoute && !isAdmin) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // D. Approval Enforcement
        if (!isApproved) {
            if (!isPendingPage && !isSetupPage && !isForcePasswordPage && !isSettingsRoute) {
                return NextResponse.redirect(new URL('/pending-approval', request.url))
            }
        } else {
            // E. Approved user on pending page → redirect away
            if (isPendingPage) {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

        return response
    } catch (err) {
        console.error('CRITICAL MIDDLEWARE ERROR:', err);
        // Fallback to avoid breaking the entire app if middleware fails
        return NextResponse.next();
    }
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