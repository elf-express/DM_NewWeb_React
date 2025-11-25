'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Package, Edit2, Trash2, Check, X, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Badge } from '@/src/components/ui/badge';
import type { OrderData } from './DelegatePage';

interface OrderListProps {
  orders: OrderData[];
  onUpdateOrder: (id: string, data: Partial<OrderData>) => void;
  onDeleteOrder: (id: string) => void;
  onBatchSubmit: () => void;
  onReset: () => void;
}

export default function OrderList({
  orders,
  onUpdateOrder,
  onDeleteOrder,
  onBatchSubmit,
  onReset,
}: OrderListProps) {
  const t = useTranslations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<OrderData>>({});

  const handleStartEdit = (order: OrderData) => {
    setEditingId(order.id);
    setEditForm(order);
    setExpandedId(order.id);
  };

  const handleSaveEdit = () => {
    if (editingId && editForm) {
      onUpdateOrder(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <Package className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-sm">{t('delegate.noOrdersYet')}</p>
          <p className="text-xs mt-1">{t('delegate.uploadImagesToStart')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 訂單統計 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('delegate.orderList')} ({orders.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onReset} size="sm">
                {t('delegate.clearAll')}
              </Button>
              <Button onClick={onBatchSubmit} size="sm">
                <Send className="h-4 w-4 mr-2" />
                {t('delegate.batchSubmit')} ({orders.length})
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 訂單列表 */}
      <div className="space-y-4">
        {orders.map((order, index) => {
          const isEditing = editingId === order.id;
          const isExpanded = expandedId === order.id;

          return (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* 訂單信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {order.platform}
                          </Badge>
                        </div>
                        <h3 className="font-medium truncate">{order.productName}</h3>
                      </div>
                      {/* 操作按鈕 - 確保始終可見 */}
                      {!isEditing && (
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(order)}
                            title={t('delegate.edit')}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteOrder(order.id)}
                            className="text-destructive hover:text-destructive"
                            title={t('delegate.delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* 簡要信息 */}
                    {!isExpanded && !isEditing && (
                      <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
                        <div>
                          <span className="text-muted-foreground">{t('delegate.trackingNumber')}:</span>
                          <span className="font-medium text-foreground">{order.trackingNumber || t('delegate.notRecognized')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('delegate.quantity')}:</span>
                          <span className="font-medium text-foreground">{order.quantity ?? '-'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('delegate.price')}:</span>
                          <span className="font-medium text-foreground">¥{order.price ?? '-'}</span>
                        </div>
                      </div>
                    )}

                    {/* 展開按鈕 */}
                    {!isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(order.id)}
                        className="mt-2 w-full"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            {t('delegate.collapse')}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            {t('delegate.viewDetails')}
                          </>
                        )}
                      </Button>
                    )}

                    {/* 詳細信息（展開時） */}
                    {isExpanded && !isEditing && (
                      <div className="mt-4 space-y-3 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t('delegate.trackingNumber')}:</span>
                            <p className="font-mono font-medium mt-1">{order.trackingNumber || '-'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('delegate.platform')}:</span>
                            <p className="font-medium mt-1">{order.platform}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('delegate.quantity')}:</span>
                            <p className="font-medium mt-1">{order.quantity ?? '-'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('delegate.price')}:</span>
                            <p className="font-medium mt-1">¥{order.price ?? '-'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('delegate.type')}:</span>
                            <p className="font-medium mt-1">{order.type ?? '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 編輯表單 */}
                    {isEditing && (
                      <div className="mt-4 space-y-3 pt-4 border-t">
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <Label className="text-xs">{t('delegate.productName')}</Label>
                            <Input
                              value={editForm.productName || ''}
                              onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t('delegate.trackingNumber')}</Label>
                            <Input
                              value={editForm.trackingNumber || ''}
                              onChange={(e) => setEditForm({ ...editForm, trackingNumber: e.target.value.toUpperCase() })}
                              className="font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs">{t('delegate.platform')}</Label>
                              <Input
                                value={editForm.platform || ''}
                                onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">{t('delegate.quantity')}</Label>
                              <Input
                                type="number"
                                value={editForm.quantity || 1}
                                onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 1 })}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">{t('delegate.price')} (¥)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={editForm.price || 0}
                                onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit} className="flex-1">
                            <Check className="h-4 w-4 mr-1" />
                            {t('common.save')}
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit} className="flex-1">
                            <X className="h-4 w-4 mr-1" />
                            {t('common.cancel')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
