import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Check if this is an auth callback
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // Refresh session if expired
  await supabase.auth.getSession()

  // Protected routes - redirect to login if not authenticated
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute && !isAuthRoute) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      const redirectUrl = new URL("/auth/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    const userEmail = session.user?.email
    const allowedEmail = "akk116636@gmail.com"

    if (userEmail !== allowedEmail) {
      // Redirect unauthorized users to homepage
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
