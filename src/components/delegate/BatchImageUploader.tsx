'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, Loader2, CheckCircle2, XCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/utils/cn';
import { extractDataFromImage } from './ocrService';
import type { OrderData } from './DelegatePage';

interface BatchImageUploaderProps {
  onOrdersExtracted: (orders: OrderData[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export default function BatchImageUploader({
  onOrdersExtracted,
  isProcessing,
  setIsProcessing,
}: BatchImageUploaderProps) {
  const t = useTranslations();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const processImages = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setProgress({ current: 0, total: files.length });

    const extractedOrders: OrderData[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length });

      try {
        // 讀取圖片
        const imageData = await readFileAsDataURL(file);
        
        // OCR 識別
        const extractedData = await extractDataFromImage(imageData, () => {});
        
        // 創建訂單
        const order: OrderData = {
          id: `order-${Date.now()}-${i}`,
          productName: extractedData.productName,
          quantity: extractedData.quantity,
          price: extractedData.price,
          trackingNumber: extractedData.trackingNumber,
          platform: extractedData.platform,
          imageUrl: imageData,
        };

        extractedOrders.push(order);
      } catch (err) {
        console.error(`處理圖片 ${file.name} 失敗:`, err);
      }
    }

    if (extractedOrders.length > 0) {
      onOrdersExtracted(extractedOrders);
    } else {
      setError(t('delegate.batchProcessFailed'));
    }

    setSelectedFiles([]);
    setIsProcessing(false);
  }, [onOrdersExtracted, setIsProcessing, t]);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      setError(t('delegate.errorNoValidImages'));
      return;
    }

    if (imageFiles.some(file => file.size > 10 * 1024 * 1024)) {
      setError(t('delegate.errorImageTooLarge'));
      return;
    }

    setError(null);
    setSelectedFiles(imageFiles);
    // 自動開始識別
    processImages(imageFiles);
  }, [t, processImages]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const handleStartProcessing = () => {
    if (selectedFiles.length > 0) {
      processImages(selectedFiles);
    }
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setError(null);
    setProgress({ current: 0, total: 0 });
  };

  return (
    <div className="space-y-4">
      {/* 上傳區域 - 科技簡潔風格 */}
      {!isProcessing && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer group",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-accent/5"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm mb-0.5">{t('delegate.clickOrDragImages')}</p>
              <p className="text-xs text-muted-foreground">
                {t('delegate.autoRecognition')}
              </p>
            </div>
            <div className="text-xs text-muted-foreground hidden sm:block">
              JPG, PNG, WebP
            </div>
          </div>
        </div>
      )}

      {/* 處理中 */}
      {isProcessing && (
        <div className="rounded-lg border bg-accent/5 p-4">
          <div className="flex items-center gap-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{t('delegate.batchProcessing')}</p>
                <span className="text-xs text-muted-foreground">
                  {progress.current}/{progress.total}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 錯誤提示 */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
          <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">{error}</div>
        </div>
      )}
    </div>
  );
}
