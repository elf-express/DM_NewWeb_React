import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 開發環境不使用 basePath 和 output: export
  // 部署時會自動切換到 next.config.production.mjs
  images: {
    unoptimized: true
  },
  transpilePackages: ['lucide-react']
};

export default withNextIntl(nextConfig);
