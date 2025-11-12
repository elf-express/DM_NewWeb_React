// 主題常量定義
import type { Theme, ThemeConfig } from '@/types';

export const THEME_NAMES: Record<Theme, string> = {
  default: 'default',
  minimal: 'minimal',
  purple: 'purple',
  green: 'green',
  orange: 'orange',
  rose: 'rose',
  cyan: 'cyan',
} as const;

export const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  default: { name: '經典藍', primary: 'from-blue-500 to-indigo-600' },
  minimal: { name: '極簡黑白', primary: 'from-gray-700 to-gray-900' },
  purple: { name: '夢幻紫', primary: 'from-purple-500 to-pink-600' },
  green: { name: '清新綠', primary: 'from-green-500 to-emerald-600' },
  orange: { name: '活力橙', primary: 'from-orange-500 to-red-600' },
  rose: { name: '浪漫粉', primary: 'from-rose-400 to-pink-600' },
  cyan: { name: '科技青', primary: 'from-cyan-500 to-blue-600' },
};

export const DEFAULT_THEME: Theme = 'default';
