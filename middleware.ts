import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './core/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // TEMP: Skip i18n middleware in development single-locale mode for performance
  if (process.env.NODE_ENV === 'development' && routing.locales.length === 1) {
    return NextResponse.next();
  }

  // Skip middleware for static assets and common bot requests
  const pathname = request.nextUrl.pathname;

  // Skip for common crawlers/bots that don't need locale handling
  const userAgent = request.headers.get('user-agent') || '';
  const isBot =
    /bot|crawler|spider|crawling|facebookexternalhit|Twitterbot|LinkedInBot/i.test(
      userAgent
    );

  // For bots, skip locale redirect logic - serve default locale
  if (isBot) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // More restrictive matcher - only match actual page routes
  // Excludes: api, _next, _vercel, static files, and common bot endpoints
  matcher: ['/((?!api|_next|_vercel|monitoring|healthcheck|.*\\..*).*)']
};
