'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Trash2, Package } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/src/components/ui/sheet';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card } from '@/src/components/ui/card';

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface PackageData {
  id: string;
  origin: string;
  products: Product[];
}

interface EditItemDialogProps {
  package: PackageData;
  open: boolean;
  onClose: () => void;
  onSave: (products: Product[]) => void;
}

export default function EditItemDialog({
  package: pkg,
  open,
  onClose,
  onSave
}: EditItemDialogProps) {
  const t = useTranslations();
  const [products, setProducts] = useState<Product[]>(pkg.products);

  const handleAddProduct = () => {
    setProducts([...products, { name: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = (index: number, field: keyof Product, value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handleSave = () => {
    onSave(products);
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t('inbound.editItems')} - {pkg.id}
          </SheetTitle>
          <SheetDescription>
            {t('inbound.editItemsDesc')}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* 包裹資訊 */}
          <Card className="p-4 bg-secondary/50">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('inbound.origin')}:</span>
                <span className="font-medium">{pkg.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('inbound.items')}:</span>
                <span className="font-medium">{products.length}</span>
              </div>
            </div>
          </Card>

          {/* 商品列表 */}
          <div className="space-y-3">
            {products.map((product, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">
                      {t('inbound.product')} {index + 1}
                    </Label>
                    {products.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* 品名 */}
                    <div>
                      <Label htmlFor={`name-${index}`} className="text-xs text-muted-foreground">
                        {t('inbound.productName')} *
                      </Label>
                      <Input
                        id={`name-${index}`}
                        value={product.name}
                        onChange={(e) => handleUpdateProduct(index, 'name', e.target.value)}
                        placeholder={t('inbound.productNamePlaceholder')}
                        className="mt-1"
                      />
                    </div>

                    {/* 數量和單價 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`quantity-${index}`} className="text-xs text-muted-foreground">
                          {t('inbound.quantity')} *
                        </Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => handleUpdateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`price-${index}`} className="text-xs text-muted-foreground">
                          {t('inbound.unitPrice')} (NT$) *
                        </Label>
                        <Input
                          id={`price-${index}`}
                          type="number"
                          min="0"
                          value={product.price}
                          onChange={(e) => handleUpdateProduct(index, 'price', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* 小計 */}
                    <div className="text-right text-sm">
                      <span className="text-muted-foreground">{t('inbound.subtotal')}: </span>
                      <span className="font-semibold">NT${product.price * product.quantity}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 新增商品按鈕 */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleAddProduct}
          >
            <Plus className="h-4 w-4" />
            {t('inbound.addProduct')}
          </Button>

          {/* 總價 */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{t('inbound.totalValue')}</span>
              <span className="text-xl font-bold text-primary">NT${totalValue}</span>
            </div>
          </Card>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('common.save')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
