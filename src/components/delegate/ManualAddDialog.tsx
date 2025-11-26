'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Plus } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';

interface ManualAddDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    productName: string;
    quantity: number;
    price: number;
    trackingNumber: string;
    platform: string;
    type: string;
  }) => void;
}

export default function ManualAddDialog({ open, onClose, onAdd }: ManualAddDialogProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 1,
    price: 0,
    trackingNumber: '',
    platform: '淘寶',
    type: '一般',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 驗證必填欄位
    if (!formData.productName || !formData.trackingNumber) {
      alert(t('delegate.errorRequired'));
      return;
    }

    onAdd(formData);

    // 重置表單
    setFormData({
      productName: '',
      quantity: 1,
      price: 0,
      trackingNumber: '',
      platform: '淘寶',
      type: '一般',
    });
  };

  const handleClose = () => {
    onClose();
    // 重置表單
    setFormData({
      productName: '',
      quantity: 1,
      price: 0,
      trackingNumber: '',
      platform: '淘寶',
      type: '一般',
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t('delegate.manualAdd')}
          </DialogTitle>
          <DialogDescription>
            {t('delegate.manualAddDesc')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 overflow-y-auto flex-1 px-4">
          {/* 商品名稱 */}
          <div className="space-y-2">
            <Label htmlFor="productName">
              {t('delegate.productName')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder={t('delegate.productNamePlaceholder')}
              required
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
              onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value.toUpperCase() })}
              placeholder={t('delegate.trackingNumberPlaceholder')}
              className="font-mono"
              required
            />
            <p className="text-xs text-muted-foreground">{t('delegate.trackingNumberHint')}</p>
          </div>

          {/* 平台 */}
          <div className="space-y-2">
            <Label htmlFor="platform">{t('delegate.platform')}</Label>
            <Input
              id="platform"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              placeholder={t('delegate.platformPlaceholder')}
            />
          </div>

          {/* 報關類別 */}
          <div className="space-y-2">
            <Label htmlFor="type">{t('delegate.type')}</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="一般"
            />
          </div>

          {/* 數量和價格 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{t('delegate.quantity')}</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">{t('delegate.price')} (¥)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* 按鈕 */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              {t('delegate.addToList')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
