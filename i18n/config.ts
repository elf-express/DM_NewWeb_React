export const locales = ['zh-TW', 'zh-CN', 'en'] as const;
export const defaultLocale = 'zh-TW' as const;

export type Locale = (typeof locales)[number];

// 路径名配置 - 支持本地化 URL
export const pathnames = {
  '/': '/',
  '/about': {
    'zh-TW': '/關於',
    'zh-CN': '/关于',
    'en': '/about'
  }
} as const;
