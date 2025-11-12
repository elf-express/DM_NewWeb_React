# 🚚 ELF EXPRESS 集運管理系統

> **線上 Demo**: https://elf-express.github.io/DM_NewWeb_React/

現代化的集運管理儀表板，採用 React + TypeScript + Vite 構建，支持多主題、多語言，完全符合官方最佳實踐。

## ✨ 主要特性

### 🎨 7 種主題風格
- 🔵 **經典藍** - 專業穩重
- ⚫ **極簡黑白** - 簡約現代
- 💜 **夢幻紫** - 優雅夢幻
- 💚 **清新綠** - 活力清新
- 🧡 **活力橙** - 熱情活力
- 💗 **浪漫粉** - 溫柔浪漫
- 🩵 **科技青** - 科技感十足

### 🌍 多語言支持
- 🇹🇼 繁體中文（預設）
- 🇨🇳 简體中文
- 🇺🇸 English

### 📊 功能完整
✅ 帳戶概覽統計 ✅ 包裹入庫管理 ✅ 訂單追蹤查詢  
✅ 客服中心 ✅ 快捷操作面板 ✅ 實時數據圖表

## 🏗️ 技術棧

**核心**: React 19 + TypeScript 4.5 + Vite 5  
**UI**: Tailwind CSS + shadcn/ui + Framer Motion  
**功能**: i18next + Recharts + Lucide React

## 📁 項目架構

```
src/
├── components/      # UI組件（ui/common/Dashboard）
├── contexts/       # React Context（主題管理）
├── i18n/          # 國際化配置和翻譯資源
├── types/         # TypeScript 類型定義
├── constants/     # 常量配置（主題/語言）
├── utils/         # 工具函數
└── styles/        # 全局樣式
```

✅ 完全符合 React/TypeScript/Vite/i18next 官方標準  
✅ 完整的路徑別名配置（`@/`）  
✅ 模組化設計，易於擴展

## 🚀 快速開始

```bash
# 安裝依賴
npm install --legacy-peer-deps

# 開發模式
npm run dev  # http://localhost:5173/DM_NewWeb_React/

# 建置
npm run build

# 部署
npm run deploy
```

## 🌐 部署到 GitHub Pages

### 1. 配置並部署
```bash
git config user.name "你的用戶名"
git config user.email "你的郵箱"
npm run deploy
```

### 2. 啟用 GitHub Pages
GitHub 專案 → Settings → Pages → Source 選擇 `gh-pages` → Save

等待 1-2 分鐘後訪問: `https://[用戶名].github.io/[專案名]/`

## 🎯 路徑別名

```typescript
@/              → src/
@/components/   → src/components/
@/types/        → src/types/
@/constants/    → src/constants/
@/utils/        → src/utils/
@/i18n/         → src/i18n/
@/contexts/     → src/contexts/
@/styles/       → src/styles/
```

## 🌍 多語言使用

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return <h1>{t('common.search')}</h1>;
  
  // 切換語言
  i18n.changeLanguage('zh-CN');
}
```

## 🎨 主題系統

點擊導航欄的調色盤圖標切換主題，設置會自動保存到 localStorage。

### 自定義主題

1. 在 `src/styles/globals.css` 定義CSS變量
2. 在 `src/constants/themes.ts` 添加配置
3. 在 `ThemeContext` 中註冊主題

## 📦 添加功能模組

```bash
mkdir -p src/features/my-feature/{components,hooks,types}
touch src/features/my-feature/index.tsx
```

## 🔧 環境要求

- Node.js >= 16.0.1
- npm >= 7.0.0

## 📝 腳本命令

| 命令 | 說明 |
|------|------|
| `npm run dev` | 開發模式 |
| `npm run build` | 建置生產版本 |
| `npm run preview` | 預覽生產版本 |
| `npm run deploy` | 部署到 GitHub Pages |
| `npm run typecheck` | TypeScript 類型檢查 |

## 📄 授權

MIT License

---

**Built with ❤️ using React + TypeScript + Vite**
