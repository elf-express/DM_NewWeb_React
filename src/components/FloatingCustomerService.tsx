'use client';

import { useTranslations } from 'next-intl';
import { MessageSquare, HelpCircle, Package, Settings } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export default function CustomerServiceCard() {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t('customerService.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3 rounded-2xl border p-3">
          <HelpCircle className="mt-0.5 h-4 w-4"/>
          <div className="text-sm text-muted-foreground">{t('customerService.faq')}</div>
        </div>
        <Button className="w-full gap-2">
          <MessageSquare className="h-4 w-4"/> 
          {t('customerService.onlineService')}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="gap-2">
            <Package className="h-4 w-4"/>
            {t('customerService.packageQuery')}
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4"/>
            {t('customerService.serviceSettings')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
