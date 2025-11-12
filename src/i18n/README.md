# 國際化 (i18n) 配置

此目錄包含應用程式的國際化配置和翻譯資源。

## 目錄結構

```
i18n/
├── config.ts          # i18n 主配置文件
├── index.ts           # 導出入口
├── locales/           # 翻譯資源
│   ├── zh-TW.json    # 繁體中文
│   ├── zh-CN.json    # 简体中文
│   └── en.json       # English
└── README.md         # 說明文檔
```

## 支援語言

- **zh-TW**: 繁體中文（預設）
- **zh-CN**: 简体中文
- **en**: English

## 使用方式

在組件中使用 `useTranslation` hook：

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <div>{t('common.search')}</div>;
}
```

## 添加新語言

1. 在 `locales/` 目錄下創建新的 JSON 文件（如 `ja.json`）
2. 複製現有語言文件的結構
3. 在 `config.ts` 中添加新語言到 resources
4. 在 `LanguageSwitcher.tsx` 中添加語言選項

## 翻譯文件結構

翻譯使用命名空間組織：

- `common`: 通用文字（搜尋、按鈕等）
- `nav`: 導航相關
- `user`: 用戶資訊
- `overview`: 帳戶概覽
- `customerService`: 客服中心
- `quickActions`: 快捷功能
- `tabs`: 標籤頁
- `inbound`: 入庫相關
- `orders`: 訂單相關
- `notifications`: 通知
- `address`: 地址管理
- `themes`: 主題名稱
