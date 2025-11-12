'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Home, ChevronRight, Package, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import PackageList from './PackageList';
import ShippingPanel from './ShippingPanel';

// 測試數據
const arrivedPackages = [
  { 
    id: "ZX202511-002", 
    origin: "天貓-杭州倉", 
    items: 2, 
    weight: 1.1, 
    arrivedDate: "11/14",
    status: "arrived",
    products: [
      { name: "運動鞋", quantity: 1, price: 1200 },
      { name: "T恤", quantity: 1, price: 300 }
    ]
  },
  { 
    id: "ZX202511-007", 
    origin: "淘寶-廣州倉", 
    items: 3, 
    weight: 2.3, 
    arrivedDate: "11/13",
    status: "arrived",
    products: [
      { name: "手機殼", quantity: 2, price: 150 },
      { name: "充電線", quantity: 1, price: 80 }
    ]
  },
  { 
    id: "ZX202511-008", 
    origin: "京東-北京倉", 
    items: 1, 
    weight: 0.8, 
    arrivedDate: "11/12",
    status: "arrived",
    products: [
      { name: "耳機", quantity: 1, price: 800 }
    ]
  },
  { 
    id: "ZX202511-010", 
    origin: "拼多多-上海倉", 
    items: 5, 
    weight: 3.5, 
    arrivedDate: "11/11",
    status: "arrived",
    products: [
      { name: "襪子", quantity: 5, price: 50 }
    ]
  },
];

export default function InboundPage() {
  const t = useTranslations();
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPackages.length === arrivedPackages.length) {
      setSelectedPackages([]);
    } else {
      setSelectedPackages(arrivedPackages.map(pkg => pkg.id));
    }
  };

  const selectedPackageData = arrivedPackages.filter(pkg => 
    selectedPackages.includes(pkg.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 頂部導航 */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          {/* 麵包屑 */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Home className="h-4 w-4" />
            <ChevronRight className="h-4 w-4" />
            <span>{t('inbound.myInbound')}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {t('inbound.arrivedPackages')} ({arrivedPackages.length})
            </span>
          </div>

          {/* 標題和操作 */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Package className="h-6 w-6" />
              {t('inbound.arrivedPackages')}
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                {t('common.filter')}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                {t('common.sort')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 篩選 */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                {t('inbound.allPackages')} ({arrivedPackages.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                {t('inbound.pendingProcess')} (4)
              </TabsTrigger>
              <TabsTrigger value="processed">
                {t('inbound.processed')} (0)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 主內容區 */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* 左側包裹列表 */}
          <div className="lg:col-span-7">
            <PackageList
              packages={arrivedPackages}
              selectedPackages={selectedPackages}
              onSelectPackage={handleSelectPackage}
              onSelectAll={handleSelectAll}
            />
          </div>

          {/* 右側操作面板 */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              <ShippingPanel
                selectedPackages={selectedPackageData}
                onClearSelection={() => setSelectedPackages([])}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
