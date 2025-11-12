// 通用類型定義

export type Theme = 'default' | 'minimal' | 'purple' | 'green' | 'orange' | 'rose' | 'cyan';

export type Language = 'zh-TW' | 'zh-CN' | 'en';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export interface ThemeConfig {
  name: string;
  primary: string;
}
