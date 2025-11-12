import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 導入翻譯資源
import zhTW from './locales/zh-TW.json';
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';

// i18n 配置
i18n
  .use(LanguageDetector) // 自動偵測用戶語言
  .use(initReactI18next) // 傳遞 i18n 實例給 react-i18next
  .init({
    resources: {
      'zh-TW': { translation: zhTW },
      'zh-CN': { translation: zhCN },
      'en': { translation: en }
    },
    fallbackLng: 'zh-TW', // 預設語言
    debug: false, // 生產環境關閉 debug
    interpolation: {
      escapeValue: false // React 已經處理 XSS
    },
    detection: {
      order: ['localStorage', 'navigator'], // 偵測順序
      caches: ['localStorage'] // 緩存位置
    }
  });

export default i18n;
