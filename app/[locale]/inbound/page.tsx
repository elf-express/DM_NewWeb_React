import InboundPage from '@/src/components/inbound/InboundPage';

// 強制靜態生成
export const dynamic = 'force-static';

// 靜態生成所有語言版本
export function generateStaticParams() {
  return [
    { locale: 'zh-TW' },
    { locale: 'zh-CN' },
    { locale: 'en' }
  ];
}

export default function Page() {
  return <InboundPage />;
}
