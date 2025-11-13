'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Package, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import type { ExtractedData } from './DelegatePage';

interface DelegateFormProps {
  extractedData: ExtractedData | null;
  onReset: () => void;
}

export default function DelegateForm({ extractedData, onReset }: DelegateFormProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 1,
    price: 0,
    trackingNumber: '',
    platform: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // 當提取的數據更新時，自動填充表單
  useEffect(() => {
    if (extractedData) {
      setFormData({
        productName: extractedData.productName,
        quantity: extractedData.quantity,
        price: extractedData.price,
        trackingNumber: extractedData.trackingNumber,
        platform: extractedData.platform,
      });
    }
  }, [extractedData]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 驗證表單
    if (!formData.productName || !formData.trackingNumber) {
      alert(t('delegate.errorRequired'));
      return;
    }

    console.log('提交委託集貨單:', formData);
    setSubmitted(true);

    // 這裡可以添加實際的提交邏輯
    setTimeout(() => {
      alert(t('delegate.submitSuccess'));
      handleReset();
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      productName: '',
      quantity: 1,
      price: 0,
      trackingNumber: '',
      platform: '',
    });
    setSubmitted(false);
    onReset();
  };

  const isFormValid = formData.productName && formData.trackingNumber;
  const hasData = extractedData !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {t('delegate.formTitle')}
        </CardTitle>
        <CardDescription>
          {hasData ? t('delegate.formDescWithData') : t('delegate.formDescNoData')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Package className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">{t('delegate.waitingForImage')}</p>
          </div>
        )}

        {hasData && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 商品名稱 */}
            <div className="space-y-2">
              <Label htmlFor="productName">
                {t('delegate.productName')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                placeholder={t('delegate.productNamePlaceholder')}
                disabled={submitted}
              />
            </div>

            {/* 快遞單號 */}
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">
                {t('delegate.trackingNumber')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="trackingNumber"
                value={formData.trackingNumber}
                onChange={(e) => handleChange('trackingNumber', e.target.value.toUpperCase())}
                placeholder={t('delegate.trackingNumberPlaceholder')}
                disabled={submitted}
                className="font-mono"
              />
              {formData.trackingNumber && formData.trackingNumber.length < 10 && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {t('delegate.trackingNumberHint')}
                </p>
              )}
            </div>

            {/* 來源平台 */}
            <div className="space-y-2">
              <Label htmlFor="platform">
                {t('delegate.platform')}
              </Label>
              <Input
                id="platform"
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                placeholder={t('delegate.platformPlaceholder')}
                disabled={submitted}
              />
            </div>

            {/* 數量和價格 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  {t('delegate.quantity')}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                  disabled={submitted}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">
                  {t('delegate.price')} (¥)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  disabled={submitted}
                />
              </div>
            </div>

            {/* 提示信息 */}
            {extractedData && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-medium mb-1">{t('delegate.autoFilled')}</p>
                    <p className="text-xs opacity-75">{t('delegate.pleaseVerify')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 按鈕組 */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={submitted}
                className="flex-1"
              >
                {t('common.reset')}
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || submitted}
                className="flex-1"
              >
                {submitted ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {t('delegate.submitted')}
                  </>
                ) : (
                  t('delegate.submit')
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
