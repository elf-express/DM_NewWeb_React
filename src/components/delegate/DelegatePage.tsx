'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, ScanSearch, Upload, Search, Clock, Boxes, BadgeDollarSign, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import BatchImageUploader from './BatchImageUploader';
import OrderList from './OrderList';
import ManualAddDialog from './ManualAddDialog';

// 假資料 - 為了演示未入庫包裹
// 假資料 - 為了演示未入庫包裹
const initialShipments = [
  { id: "ZX202511-001", origin: "淘寶-廣州倉", items: 5, weight: 3.4, status: "待入庫", eta: "--" },
  { id: "ZX202511-002", origin: "天貓-杭州倉", items: 2, weight: 1.1, status: "已入庫", eta: "11/14" },
  { id: "ZX202511-003", origin: "拼多多-東莞倉", items: 1, weight: 0.7, status: "待合箱", eta: "--" },
  { id: "ZX202511-004", origin: "京東-北京倉", items: 3, weight: 2.1, status: "待入庫", eta: "--" },
  { id: "ZX202511-005", origin: "1688-義烏倉", items: 8, weight: 5.2, status: "待入庫", eta: "--" },
];

export interface OrderData {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  trackingNumber: string;
  platform: string;
  imageUrl: string;
  type: string;
  hasError?: boolean; // 標記是否缺少必要欄位
}

export default function DelegatePage() {
  const t = useTranslations();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [shipments, setShipments] = useState(initialShipments);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // 篩選出未入庫的包裹
  const notInboundPackages = shipments.filter(s => s.status === "待入庫");

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

    // 檢查是否有錯誤的訂單（紅色外框）
    const hasErrors = orders.some(order => order.hasError);
    if (hasErrors) {
      alert('請先修正有錯誤的訂單（紅色外框）後再提交');
      return;
    }

    // 將提交的訂單轉換為未入庫包裹格式並加入列表
    const newShipments = orders.map(order => ({
      id: order.trackingNumber || `PKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      origin: `${order.platform || '未知平台'}`,
      items: order.quantity,
      weight: 0, // 預設重量
      status: "待入庫",
      eta: "--"
    }));

    setShipments(prev => [...newShipments, ...prev]);

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

  // Quick Ship handlers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleQuickShipConfirm = () => {
    const selectedPackages = notInboundPackages.filter(pkg => selectedIds.includes(pkg.id));
    if (selectedPackages.length === 0) return;

    const totalItems = selectedPackages.reduce((sum, p) => sum + p.items, 0);
    const totalWeight = selectedPackages.reduce((sum, p) => sum + p.weight, 0);
    const now = new Date();
    const timeStr = now.toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newShipment = {
      id: `快速出貨-${timeStr}`,
      origin: '快速出貨',
      items: totalItems,
      weight: totalWeight,
      status: '待入庫',
      eta: '--',
      children: selectedPackages, // 保存被選中的包裹作為子項目
    };

    // 移除被選中的包裹，添加新的快速出貨項目
    setShipments(prev => [newShipment, ...prev.filter(pkg => !selectedIds.includes(pkg.id))]);
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handleQuickShipCancel = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
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
      <div className="mx-auto max-w-[1600px] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* 左側主要操作區 (佔 8/12) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 說明卡片 */}
            <Card>
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
            <Card>
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
          </div>

          {/* 右側未入庫包裹列表 (佔 4/12) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Boxes className="h-5 w-5" />
                        {t('overview.notInbound')}
                      </CardTitle>
                      <CardDescription>
                        {t('overview.waitingShipment')}
                      </CardDescription>
                    </div>
                    {!selectionMode && (
                      <Button variant="outline" size="sm" onClick={() => setSelectionMode(true)}>
                        快速出貨
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 搜索框 */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" placeholder={t('inbound.searchPackage')} />
                    </div>

                    {/* 包裹列表 */}
                    <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                      {notInboundPackages.map((pkg) => {
                        const isQuickShip = pkg.id.startsWith('快速出貨');
                        const isExpanded = expandedIds.includes(pkg.id);
                        const hasChildren = pkg.children && pkg.children.length > 0;

                        return (
                          <div key={pkg.id}>
                            <Card className={`hover:shadow-md transition-shadow cursor-pointer border-dashed ${isQuickShip ? 'bg-orange-50' : ''}`}>
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  {selectionMode && !isQuickShip && (
                                    <input
                                      type="checkbox"
                                      checked={selectedIds.includes(pkg.id)}
                                      onChange={() => toggleSelect(pkg.id)}
                                      className="mt-1 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      {hasChildren && (
                                        <button onClick={() => toggleExpand(pkg.id)} className="p-0 hover:bg-transparent">
                                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </button>
                                      )}
                                      <Package className="h-4 w-4 text-primary shrink-0" />
                                      <span className="font-semibold truncate">{pkg.id}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {pkg.origin}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Boxes className="h-3 w-3" />
                                        <span>{pkg.items} {t('inbound.items')}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <BadgeDollarSign className="h-3 w-3" />
                                        <span>{pkg.weight} kg</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* 展開顯示子包裹 */}
                            {isExpanded && hasChildren && (
                              <div className="ml-6 mt-2 space-y-2 border-l-2 border-orange-200 pl-3">
                                {pkg.children.map((child) => (
                                  <Card key={child.id} className="bg-white">
                                    <CardContent className="p-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Package className="h-3 w-3 text-muted-foreground shrink-0" />
                                        <span className="text-xs font-medium truncate">{child.id}</span>
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">
                                        {child.origin}
                                      </div>
                                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                                        <span>{child.items} 項</span>
                                        <span>{child.weight} kg</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {selectionMode && (
                        <div className="flex gap-2 mt-4 justify-end">
                          <Button size="sm" variant="outline" onClick={handleQuickShipCancel}>
                            取消
                          </Button>
                          <Button size="sm" onClick={handleQuickShipConfirm} disabled={selectedIds.length === 0}>
                            確定
                          </Button>
                        </div>
                      )}

                      {notInboundPackages.length === 0 && (
                        <div className="py-8 text-center text-muted-foreground">
                          <Package className="mx-auto h-10 w-10 opacity-20" />
                          <p className="mt-2 text-sm">暫無未入庫包裹</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
