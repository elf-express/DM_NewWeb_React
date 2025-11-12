import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/DM_NewWeb_React',
  images: {
    unoptimized: true
  },
  transpilePackages: ['lucide-react']
};

export default withNextIntl(nextConfig);
