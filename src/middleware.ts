import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request: { headers: request.headers } })
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: { getAll() { return request.cookies.getAll() }, setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)) }, },
    })

    // Refresh the session token
    await supabase.auth.getSession()

    const { data: { user } } = await supabase.auth.getUser()

    // ★ MASTER BYPASS: Felix gets unrestricted access to ALL pages
    if (user?.email === 'felixadewole16@gmail.com') {
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

    return response
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] }
