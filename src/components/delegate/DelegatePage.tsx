'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, ScanSearch, Upload } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import BatchImageUploader from './BatchImageUploader';
import OrderList from './OrderList';
import ManualAddDialog from './ManualAddDialog';

export interface OrderData {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  trackingNumber: string;
  platform: string;
  imageUrl: string;
  type: string;
}

export default function DelegatePage() {
  const t = useTranslations();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualAdd, setShowManualAdd] = useState(false);

  const handleOrdersExtracted = (newOrders: OrderData[]) => {
    setOrders(prev => [...prev, ...newOrders]);
    setIsProcessing(false);
  };

  const handleManualAdd = (orderData: Omit<OrderData, 'id' | 'imageUrl'>) => {
    const newOrder: OrderData = {
      ...orderData,
      id: `manual-${Date.now()}`,
      imageUrl: '', // 手動新增沒有圖片
    };
    setOrders(prev => [...prev, newOrder]);
    setShowManualAdd(false);
  };

  const handleUpdateOrder = (id: string, updatedData: Partial<OrderData>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updatedData } : order
    ));
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const handleBatchSubmit = () => {
    if (orders.length === 0) {
      alert(t('delegate.noOrders'));
      return;
    }

    console.log('批量提交訂單:', orders);
    alert(t('delegate.batchSubmitSuccess', { count: orders.length }));
    
    // 清空訂單列表
    setOrders([]);
  };

  const handleReset = () => {
    if (orders.length > 0 && !confirm(t('delegate.confirmClearAll'))) {
      return;
    }
    setOrders([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 頂部導航 */}
      <div className="bg-white dark:bg-slate-900 border-b sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
            <div className="flex items-center gap-2">
              <ScanSearch className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">{t('delegate.title')}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 說明卡片 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('delegate.howItWorks')}
              </CardTitle>
              <CardDescription>
                {t('delegate.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-medium">{t('delegate.step1Title')}</div>
                    <div className="text-sm text-muted-foreground">{t('delegate.step1Desc')}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-medium">{t('delegate.step2Title')}</div>
                    <div className="text-sm text-muted-foreground">{t('delegate.step2Desc')}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-medium">{t('delegate.step3Title')}</div>
                    <div className="text-sm text-muted-foreground">{t('delegate.step3Desc')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 批次上傳區 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    {t('delegate.batchUpload')}
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    {t('delegate.batchUploadDesc')}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowManualAdd(true)}
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  {t('delegate.manualAdd')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BatchImageUploader
                onOrdersExtracted={handleOrdersExtracted}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </CardContent>
          </Card>

          {/* 訂單列表 */}
          <OrderList
            orders={orders}
            onUpdateOrder={handleUpdateOrder}
            onDeleteOrder={handleDeleteOrder}
            onBatchSubmit={handleBatchSubmit}
            onReset={handleReset}
          />
        </motion.div>
      </div>

      {/* 手動新增對話框 */}
      <ManualAddDialog
        open={showManualAdd}
        onClose={() => setShowManualAdd(false)}
        onAdd={handleManualAdd}
      />
    </div>
  );
}
