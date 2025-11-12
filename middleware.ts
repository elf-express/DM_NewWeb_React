import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  // 匹配所有路径，除了 api、_next/static、_next/image、favicon.ico
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
