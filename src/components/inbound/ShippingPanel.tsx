'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Package, Plane, Ship, Zap, CheckCircle2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Checkbox } from '@/src/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';
import { Label } from '@/src/components/ui/label';

interface PackageData {
  id: string;
  origin: string;
  items: number;
  weight: number;
}

interface ShippingPanelProps {
  selectedPackages: PackageData[];
  onClearSelection: () => void;
}

// 發貨方式
const shippingMethods = [
  { 
    id: 'air', 
    name: '空運', 
    icon: Plane, 
    duration: '3-5天', 
    pricePerKg: 170,
    color: 'text-blue-600'
  },
  { 
    id: 'sea', 
    name: '海運', 
    icon: Ship, 
    duration: '7-15天', 
    pricePerKg: 110,
    color: 'text-cyan-600'
  },
  { 
    id: 'express', 
    name: '快遞', 
    icon: Zap, 
    duration: '2-3天', 
    pricePerKg: 220,
    color: 'text-orange-600'
  },
];

// 增值服務
const valueServices = [
  { id: 'reinforce', name: '加固包裝', price: 50, icon: '📦', desc: '使用加厚紙箱和泡棉保護' },
  { id: 'waterproof', name: '防水袋', price: 30, icon: '💧', desc: '防水防潮保護' },
  { id: 'photo', name: '拍照驗貨', price: 20, icon: '📷', desc: '入庫時拍照記錄' },
  { id: 'insurance', name: '保險服務', price: 100, icon: '🛡️', desc: '最高賠償 NT$10,000' },
];

export default function ShippingPanel({ selectedPackages, onClearSelection }: ShippingPanelProps) {
  const t = useTranslations();
  const [shippingMethod, setShippingMethod] = useState('sea');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // 計算總重量
  const totalWeight = selectedPackages.reduce((sum, pkg) => sum + pkg.weight, 0);
  
  // 計算運費
  const shippingFee = Math.round(
    totalWeight * (shippingMethods.find(m => m.id === shippingMethod)?.pricePerKg || 0)
  );
  
  // 計算增值服務費用
  const serviceFee = selectedServices.reduce((sum, serviceId) => {
    const service = valueServices.find(s => s.id === serviceId);
    return sum + (service ? service.price * selectedPackages.length : 0);
  }, 0);

  const totalFee = shippingFee + serviceFee;

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (selectedPackages.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Package className="mx-auto h-12 w-12 opacity-20 mb-4" />
          <p className="text-sm">{t('inbound.selectPackagesToShip')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {t('inbound.shippingSettings')}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 選中的包裹 */}
        <div>
          <div className="text-sm font-medium mb-3">
            {t('inbound.selectedPackages')} ({selectedPackages.length})
          </div>
          <div className="space-y-2">
            {selectedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg p-2"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{pkg.id}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {pkg.items}件 | {pkg.weight}kg
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 發貨方式 */}
        <div>
          <div className="text-sm font-medium mb-3">{t('inbound.shippingMethod')}</div>
          <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
            <div className="space-y-2">
              {shippingMethods.map((method) => {
                const Icon = method.icon;
                const estimatedCost = Math.round(totalWeight * method.pricePerKg);
                
                return (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                      shippingMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setShippingMethod(method.id)}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${method.color}`} />
                          <span className="font-medium">{method.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({method.duration})
                          </span>
                        </div>
                        <span className="text-sm font-semibold">
                          ~NT${estimatedCost}
                        </span>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* 增值服務 */}
        <div>
          <div className="text-sm font-medium mb-3">
            {t('inbound.valueAddedServices')} ({t('common.optional')})
          </div>
          <div className="space-y-2">
            {valueServices.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              const serviceCost = service.price * selectedPackages.length;
              
              return (
                <div
                  key={service.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    id={service.id}
                    className="pointer-events-none"
                  />
                  <div className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{service.icon}</span>
                        <span className="font-medium text-sm">{service.name}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        +NT${serviceCost}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {service.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 費用明細 */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('inbound.totalWeight')}</span>
            <span className="font-medium">{totalWeight.toFixed(1)} kg</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('inbound.shippingFee')}</span>
            <span className="font-medium">NT${shippingFee}</span>
          </div>
          {serviceFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('inbound.serviceFee')}</span>
              <span className="font-medium">NT${serviceFee}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between">
            <span className="font-semibold">{t('inbound.total')}</span>
            <span className="text-lg font-bold text-primary">NT${totalFee}</span>
          </div>
        </div>

        {/* 安排出貨按鈕 */}
        <Button className="w-full gap-2" size="lg">
          <CheckCircle2 className="h-4 w-4" />
          {t('inbound.arrangeShipment')}
        </Button>
      </CardContent>
    </Card>
  );
}
