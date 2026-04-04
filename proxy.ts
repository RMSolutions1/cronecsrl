import { NextResponse, type NextRequest } from "next/server"

const SESSION_COOKIE_NAME = "cronec_session"

/**
 * Proxy (Next.js 16): convención `proxy.ts` sustituye a `middleware.ts`; runtime por defecto Node.
 * Solo comprobamos si existe la cookie de sesión para redirigir.
 * La verificación real de sesión se hace en getCurrentUser() en las páginas.
 */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAdminRoute = path.startsWith("/admin")
  const isAdminPublic = path === "/admin/login" || path === "/admin/registro" || path === "/admin/recuperar"

  const hasSessionCookie = request.cookies.has(SESSION_COOKIE_NAME)

  if (isAdminRoute && !isAdminPublic && !hasSessionCookie) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("next", path)
    return NextResponse.redirect(url)
  }

  if (hasSessionCookie && path === "/admin/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
