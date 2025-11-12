import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 
  | 'default'  // 藍色系
  | 'minimal'  // 黑白簡潔
  | 'purple'   // 紫色系
  | 'green'    // 綠色系
  | 'orange'   // 橙色系
  | 'rose'     // 玫瑰紅系
  | 'cyan';    // 青色系

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
    const stored = localStorage.getItem('app-theme');
    return (stored as Theme) || 'default';
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

export const themes = {
  default: {
    name: '經典藍',
    primary: 'from-blue-500 to-indigo-600',
    icon: '🔵'
  },
  minimal: {
    name: '極簡黑白',
    primary: 'from-gray-800 to-slate-900',
    icon: '⚫'
  },
  purple: {
    name: '夢幻紫',
    primary: 'from-purple-500 to-pink-600',
    icon: '💜'
  },
  green: {
    name: '清新綠',
    primary: 'from-emerald-500 to-teal-600',
    icon: '💚'
  },
  orange: {
    name: '活力橙',
    primary: 'from-orange-500 to-amber-600',
    icon: '🧡'
  },
  rose: {
    name: '浪漫粉',
    primary: 'from-rose-500 to-pink-600',
    icon: '💗'
  },
  cyan: {
    name: '科技青',
    primary: 'from-cyan-500 to-blue-600',
    icon: '🩵'
  }
};
