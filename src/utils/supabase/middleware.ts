import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/auth/callback', '/pending-approval', '/reset-password', '/about', '/privacy-policy']
  
  // Also allow static PWA assets
  const isPwaAsset = request.nextUrl.pathname.match(/\.(webmanifest|json|js|png|ico|svg|jpg)$/) || request.nextUrl.pathname.startsWith('/icons/');
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname) || isPwaAsset;

  if (!user && !isPublicPath) {
    // Redirect to login only if accessing a protected route
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If the user is logged in, and they try to go to the login page, redirect them to the directory
  if (user && request.nextUrl.pathname === '/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
  }

  // FORCE PROFILE SETUP: If user has 'needs_setup' metadata, force them to the setup page
  if (user && user.user_metadata?.needs_setup === true) {
      if (request.nextUrl.pathname !== '/dashboard/setup-profile' && 
          !request.nextUrl.pathname.startsWith('/_next') && 
          !request.nextUrl.pathname.includes('api/auth')) {
          const url = request.nextUrl.clone()
          url.pathname = '/dashboard/setup-profile'
          return NextResponse.redirect(url)
      }
  }

  // MASTER BYPASS: If user has 'is_approved' badge, they skip the pending trap
  if (user && user.user_metadata?.is_approved === true) {
      if (request.nextUrl.pathname === '/pending-approval') {
          const url = request.nextUrl.clone()
          url.pathname = '/'
          return NextResponse.redirect(url)
      }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
