'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Theme, ThemeConfig } from '@/src/types';
import { THEME_CONFIGS, DEFAULT_THEME } from '@/src/constants';

export type { Theme };

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app-theme');
      return (stored as Theme) || DEFAULT_THEME;
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    const root = document.documentElement;
    // 移除所有主題類
    root.classList.remove('theme-default', 'theme-minimal', 'theme-purple', 'theme-green', 'theme-orange', 'theme-rose', 'theme-cyan');
    // 添加當前主題類
    root.classList.add(`theme-${theme}`);
    // 保存到 localStorage
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const themes: Record<Theme, ThemeConfig & { icon?: string }> = {
  default: { ...THEME_CONFIGS.default, icon: '🔵' },
  minimal: { ...THEME_CONFIGS.minimal, icon: '⚫' },
  purple: { ...THEME_CONFIGS.purple, icon: '💜' },
  green: { ...THEME_CONFIGS.green, icon: '💚' },
  orange: { ...THEME_CONFIGS.orange, icon: '🧡' },
  rose: { ...THEME_CONFIGS.rose, icon: '💗' },
  cyan: { ...THEME_CONFIGS.cyan, icon: '🩵' }
};
