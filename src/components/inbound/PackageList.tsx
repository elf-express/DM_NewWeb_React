'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Package, MapPin, Calendar, Boxes, BadgeDollarSign, Edit } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Checkbox } from '@/src/components/ui/checkbox';
import EditItemDialog from './EditItemDialog';

interface PackageData {
  id: string;
  origin: string;
  items: number;
  weight: number;
  arrivedDate: string;
  status: string;
  products: Array<{ name: string; quantity: number; price: number }>;
}

interface PackageListProps {
  packages: PackageData[];
  selectedPackages: string[];
  onSelectPackage: (id: string) => void;
  onSelectAll: () => void;
}

export default function PackageList({
  packages,
  selectedPackages,
  onSelectPackage,
  onSelectAll
}: PackageListProps) {
  const t = useTranslations();
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);

  const isAllSelected = selectedPackages.length === packages.length && packages.length > 0;

  return (
    <>
      <Card>
        <CardContent className="p-4">
          {/* 全選 */}
          <div className="flex items-center gap-3 pb-4 border-b mb-4">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              id="select-all"
            />
            <label 
              htmlFor="select-all" 
              className="text-sm font-medium cursor-pointer"
            >
              {t('inbound.selectAll')} ({packages.length})
            </label>
          </div>

          {/* 包裹列表 */}
          <div className="space-y-3">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`transition-all cursor-pointer ${
                  selectedPackages.includes(pkg.id)
                    ? 'border-primary shadow-md'
                    : 'hover:border-primary/50 hover:shadow-sm'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* 複選框 */}
                    <Checkbox
                      checked={selectedPackages.includes(pkg.id)}
                      onCheckedChange={() => onSelectPackage(pkg.id)}
                      id={pkg.id}
                    />

                    {/* 包裹信息 */}
                    <div className="flex-1" onClick={() => onSelectPackage(pkg.id)}>
                      {/* 包裹編號和狀態 */}
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{pkg.id}</span>
                        <Badge variant="secondary" className="gap-1">
                          {t('inbound.arrived')}
                        </Badge>
                      </div>

                      {/* 來源 */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {pkg.origin}
                      </div>

                      {/* 統計信息 */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Boxes className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{pkg.items} {t('inbound.items')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BadgeDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{pkg.weight} kg</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{pkg.arrivedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* 編輯按鈕 */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPackage(pkg);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      {t('inbound.editItems')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 編輯品名彈窗 */}
      {editingPackage && (
        <EditItemDialog
          package={editingPackage}
          open={!!editingPackage}
          onClose={() => setEditingPackage(null)}
          onSave={(updatedProducts) => {
            console.log('Updated products:', updatedProducts);
            setEditingPackage(null);
          }}
        />
      )}
    </>
  );
}
