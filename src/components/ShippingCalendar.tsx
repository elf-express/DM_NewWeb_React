'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { ChevronLeft, ChevronRight, Plane, Ship, StickyNote, Plus } from 'lucide-react';

// 航班/船班數據類型
interface ShippingSchedule {
  date: string; // YYYY-MM-DD
  type: 'flight' | 'ship' | 'both' | 'none';
  note?: string;
}

// 示例數據（實際應從後端獲取）
const initialSchedules: ShippingSchedule[] = [
  { date: '2025-11-15', type: 'flight', note: '每週五空運' },
  { date: '2025-11-18', type: 'ship', note: '週一船班' },
  { date: '2025-11-22', type: 'flight' },
  { date: '2025-11-25', type: 'ship' },
  { date: '2025-11-29', type: 'both', note: '空運+海運' },
];

export default function ShippingCalendar() {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<ShippingSchedule[]>(initialSchedules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingSchedule, setEditingSchedule] = useState<ShippingSchedule | null>(null);

  // 獲取當月第一天和最後一天
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // 獲取當月第一天是星期幾（0=週日, 1=週一...）
  const startDayOfWeek = firstDay.getDay();
  
  // 計算需要顯示的天數（包括前後補齊）
  const totalDays = lastDay.getDate();
  
  // 生成日曆網格
  const calendarDays: (number | null)[] = [];
  
  // 前面補空格
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 填充當月日期
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  // 切換月份
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // 檢查某天是否有班次
  const getScheduleForDay = (day: number): ShippingSchedule | undefined => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.find(s => s.date === dateStr);
  };

  // 點擊日期打開記事對話框
  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    
    const existing = schedules.find(s => s.date === dateStr);
    if (existing) {
      // 編輯現有記事（保留班次類型，不讓客戶修改）
      setEditingSchedule(existing);
    } else {
      // 新增記事（班次類型為 none，由官方管理）
      setEditingSchedule({ date: dateStr, type: 'none', note: '' });
    }
    
    setIsDialogOpen(true);
  };

  // 保存記事
  const handleSave = () => {
    if (!editingSchedule) return;

    const existingIndex = schedules.findIndex(s => s.date === selectedDate);
    
    if (existingIndex >= 0) {
      // 更新現有記錄（保留原班次類型）
      const newSchedules = [...schedules];
      newSchedules[existingIndex] = {
        ...newSchedules[existingIndex],
        note: editingSchedule.note
      };
      setSchedules(newSchedules);
    } else {
      // 新增記錄（僅記事，無班次）
      if (editingSchedule.note?.trim()) {
        setSchedules([...schedules, editingSchedule]);
      }
    }
    
    setIsDialogOpen(false);
    setEditingSchedule(null);
  };

  // 刪除記事
  const handleDelete = () => {
    const existingIndex = schedules.findIndex(s => s.date === selectedDate);
    if (existingIndex >= 0) {
      const schedule = schedules[existingIndex];
      // 如果有班次信息，只刪除記事，保留班次
      if (schedule.type !== 'none') {
        const newSchedules = [...schedules];
        newSchedules[existingIndex] = { ...schedule, note: '' };
        setSchedules(newSchedules);
      } else {
        // 如果沒有班次，完全刪除
        setSchedules(schedules.filter(s => s.date !== selectedDate));
      }
    }
    setIsDialogOpen(false);
    setEditingSchedule(null);
  };

  // 判斷是否為今天
  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">航班船班查詢</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium min-w-[100px] text-center">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
            </div>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* 週標題 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 日曆網格 */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const schedule = getScheduleForDay(day);
            const today = isToday(day);

            return (
              <div
                key={day}
                className={`
                  relative aspect-square rounded-lg border p-1
                  ${today ? 'border-primary bg-primary/5' : 'border-border'}
                  ${schedule ? 'bg-accent/30' : 'hover:bg-accent/20'}
                  transition-colors cursor-pointer group
                `}
                title={schedule?.note || '點擊添加記事'}
                onClick={() => handleDayClick(day)}
              >
                <div className={`text-xs font-medium ${today ? 'text-primary' : ''}`}>
                  {day}
                </div>
                
                {/* 添加按鈕（懸停顯示） */}
                {!schedule && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
                
                {/* 航班/船班圖標 */}
                {schedule && schedule.type !== 'none' && (
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-0.5">
                    {(schedule.type === 'flight' || schedule.type === 'both') && (
                      <Plane className="h-3 w-3 text-blue-500" />
                    )}
                    {(schedule.type === 'ship' || schedule.type === 'both') && (
                      <Ship className="h-3 w-3 text-emerald-500" />
                    )}
                    {schedule.note && (
                      <StickyNote className="h-3 w-3 text-amber-500" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 圖例說明 */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Plane className="h-3 w-3 text-blue-500" />
            <span>空運</span>
          </div>
          <div className="flex items-center gap-1">
            <Ship className="h-3 w-3 text-emerald-500" />
            <span>海運</span>
          </div>
          <div className="flex items-center gap-1">
            <StickyNote className="h-3 w-3 text-amber-500" />
            <span>備註</span>
          </div>
        </div>
      </CardContent>

      {/* 記事對話框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加記事</DialogTitle>
            <DialogDescription>
              {selectedDate} - 為該日期添加備註
            </DialogDescription>
          </DialogHeader>
          
          {editingSchedule && (
            <div className="space-y-4 py-4">
              {/* 備註輸入 */}
              <div className="space-y-2">
                <Label>記事內容</Label>
                <Textarea
                  placeholder="輸入記事內容..."
                  value={editingSchedule.note || ''}
                  onChange={(e) => 
                    setEditingSchedule({ ...editingSchedule, note: e.target.value })
                  }
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  可記錄提醒事項、注意事項等信息
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {schedules.find(s => s.date === selectedDate)?.note && (
              <Button variant="destructive" onClick={handleDelete}>
                刪除記事
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
