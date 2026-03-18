import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request: { headers: request.headers } })
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: { getAll() { return request.cookies.getAll() }, setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)) }, },
    })
    const { data: { user } } = await supabase.auth.getUser()

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

    // 3. APPROVAL CHECK (If logged in)
    if (user) {
        const { data: profile } = await supabase
            .from('administrative_officers')
            .select('is_approved')
            .eq('id', user.id)
            .single()

        const isPendingPage = request.nextUrl.pathname.startsWith('/pending-approval')

        // Redirect to pending if not approved and trying to access private routes
        if (!profile?.is_approved && !isPublicRoute && !isPendingPage) {
            return NextResponse.redirect(new URL('/pending-approval', request.url))
        }

        // Redirect away from pending if already approved
        if (profile?.is_approved && isPendingPage) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] }
