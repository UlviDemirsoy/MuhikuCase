import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
 
export default createMiddleware(routing);
 /*
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|en|es|sv|nl)/:path*']
};*/
export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',
    '/([\\w-]+)?/about/(.+)'
  ]
};