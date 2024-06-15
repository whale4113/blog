import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages } from '@/i18n/settings'

acceptLanguage.languages(languages)

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  const lang = acceptLanguage.get(request.headers.get('Accept-Language')) ?? fallbackLng

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${lang}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - _next (all internal paths)
     * - api (API routes)
     * - static (public static files)
     * - search.json (search file)
     * - favicon.ico (favicon file)
     */
    '/((?!_next|api|static|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
