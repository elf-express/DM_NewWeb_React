'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, Image as ImageIcon, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/utils/cn';
import { extractDataFromImage } from './ocrService';
import type { ExtractedData } from './DelegatePage';

interface ImageUploaderProps {
  onExtractComplete: (data: ExtractedData) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export default function ImageUploader({ 
  onExtractComplete, 
  isProcessing, 
  setIsProcessing 
}: ImageUploaderProps) {
  const t = useTranslations();
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(t('delegate.errorInvalidImage'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError(t('delegate.errorImageTooLarge'));
      return;
    }

    setError(null);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setImage(imageData);
      setIsProcessing(true);
      setProgress(0);

      try {
        // 執行 OCR 識別
        const extractedData = await extractDataFromImage(imageData, (prog) => {
          setProgress(prog);
        });
        
        onExtractComplete(extractedData);
        setProgress(100);
      } catch (err) {
        console.error('OCR Error:', err);
        setError(t('delegate.errorOCRFailed'));
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError(t('delegate.errorFileRead'));
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  }, [onExtractComplete, setIsProcessing, t]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleReset = () => {
    setImage(null);
    setError(null);
    setProgress(0);
    setIsProcessing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t('delegate.uploadImage')}
        </CardTitle>
        <CardDescription>
          {t('delegate.uploadImageDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 上傳區域 */}
        {!image && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragging 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50"
            )}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">{t('delegate.dragAndDrop')}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('delegate.or')} <span className="text-primary underline">{t('delegate.browseFiles')}</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('delegate.supportedFormats')}
              </p>
            </div>
          </div>
        )}

        {/* 圖片預覽 */}
        {image && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={image}
                alt="Uploaded"
                className="w-full h-auto max-h-96 object-contain bg-slate-50 dark:bg-slate-900"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 max-w-xs w-full mx-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="font-medium">{t('delegate.processing')}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {progress < 100 ? t('delegate.analyzingImage') : t('delegate.complete')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleReset}
                disabled={isProcessing}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {t('delegate.reset')}
              </Button>
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

        {/* 成功提示 */}
        {progress === 100 && !isProcessing && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">{t('delegate.extractSuccess')}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
