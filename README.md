# 🚚 ELF EXPRESS 集運管理系統

> **線上 Demo**: https://elf-express.github.io/DM_NewWeb_React/

現代化的集運管理平台

基於 Next.js 16 + TypeScript + next-intl 構建的現代化集運管理系統。，支持多主題、多語言，完全符合官方最佳實踐。

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

## 🛠️ 開發指令

```bash
# 開發模式
npm run dev
# 訪問: http://localhost:3000/zh-TW

# 類型檢查
npm run typecheck

# 構建生產版本 (使用生產配置)
npm run build

# 啟動生產服務器
npm run start

# 部署到 GitHub Pages
npm run deploy
```

## 🎨 設計系統規範

### 📐 佈局與間距

#### 容器寬度
```css
最大寬度: max-w-7xl (1280px)
容器內距: px-4 (左右各 16px)
響應式斷點: 2xl 最大 1400px
```

#### 主要間距系統
- **頁面級**: `gap-4` (16px) - 主要區塊之間
- **卡片級**: `gap-3` (12px) - 卡片內部元素
- **組件級**: `gap-2` (8px) - 小組件如按鈕內的圖標
- **頂部導航**: `py-3` (上下 12px)
- **卡片內距**: `p-4` 或 `p-6` (16px 或 24px)

#### 網格佈局
```tsx
// 三欄佈局 (桌面版)
<div className="grid gap-4 lg:grid-cols-12">
  {/* 左側主內容區 - 8 欄 */}
  <div className="lg:col-span-8 space-y-4">
  
  {/* 右側邊欄 - 4 欄 */}
  <div className="lg:col-span-4 space-y-4">
</div>
```

### 🎴 卡片設計

#### 基礎卡片結構
```tsx
<Card>
  <CardHeader>
    <CardTitle>標題</CardTitle>
  </CardHeader>
  <CardContent>
    內容區域
  </CardContent>
</Card>
```

#### 卡片樣式規範
- **背景**: 白色 `bg-white`
- **邊框**: 淺灰邊框 `border`
- **圓角**: `0.5rem` (由 CSS 變量 `--radius` 控制)
- **陰影**: 無默認陰影，使用邊框區分
- **內距**: Header `p-6`, Content `p-6 pt-0`

#### 卡片變體
1. **數據卡片** - 顯示統計數字
   - 圖標 + 標題 + 數值
   - `gap-2` 圖標間距
   
2. **表格卡片** - 包含數據表格
   - 使用 `<Table>` 組件
   - 斑馬紋效果 (自動)
   
3. **圖表卡片** - 包含可視化圖表
   - `ResponsiveContainer` 自適應
   - 高度通常 `h-[200px]` 或 `h-[300px]`

### 🎨 顏色系統

#### CSS 變量架構
所有顏色使用 HSL 格式定義在 CSS 變量中：
```css
--primary: 221.2 83.2% 53.3%;  /* 主色 */
--secondary: 210 40% 96.1%;     /* 次要色 */
--muted: 210 40% 96.1%;         /* 柔和色 */
--accent: 210 40% 96.1%;        /* 強調色 */
--destructive: 0 84.2% 60.2%;   /* 危險色 */
```

#### 7 種主題變體
1. **經典藍** (default) - 主色: `#3b82f6` (藍)
2. **極簡黑白** (minimal) - 主色: `#171717` (黑)
3. **夢幻紫** (purple) - 主色: `#a855f7` (紫)
4. **清新綠** (green) - 主色: `#22c55e` (綠)
5. **活力橙** (orange) - 主色: `#f97316` (橙)
6. **浪漫粉** (rose) - 主色: `#f43f5e` (粉)
7. **科技藍** (cyan) - 主色: `#06b6d4` (青)

#### 語義化顏色使用
- **Primary**: 主要操作按鈕、重要圖標
- **Secondary**: 次要內容區背景
- **Muted**: 次要文字、禁用狀態
- **Destructive**: 刪除、警告操作
- **Border**: 所有邊框統一使用

### 📱 響應式設計

#### 斷點系統
```js
sm: '640px'   // 手機橫屏
md: '768px'   // 平板
lg: '1024px'  // 筆電
xl: '1280px'  // 桌面
2xl: '1400px' // 大屏
```

#### 佈局適配
```tsx
// 手機: 單欄
// 桌面: 左右 8:4 分欄
<div className="grid gap-4 lg:grid-cols-12">
  <div className="lg:col-span-8">主內容</div>
  <div className="lg:col-span-4">側邊欄</div>
</div>
```

### 🔤 文字系統

#### 字體大小
- **大標題**: `text-2xl font-semibold` (24px)
- **標題**: `text-lg font-semibold` (18px)
- **小標題**: `text-sm font-medium` (14px)
- **正文**: `text-base` (16px)
- **說明文字**: `text-sm text-muted-foreground` (14px)
- **小字**: `text-xs` (12px)

#### 字重
- **Bold**: `font-bold` (700) - 很少使用
- **SemiBold**: `font-semibold` (600) - 標題、重要內容
- **Medium**: `font-medium` (500) - 次標題、標籤
- **Normal**: `font-normal` (400) - 正文

### 🎯 組件規範

#### 按鈕
```tsx
// 主要按鈕
<Button>操作</Button>

// 次要按鈕
<Button variant="outline">次要操作</Button>

// 幽靈按鈕 (僅圖標)
<Button variant="ghost" size="icon">
  <Icon className="h-5 w-5"/>
</Button>

// 帶圖標的按鈕
<Button className="gap-2">
  <Icon className="h-4 w-4"/>
  文字
</Button>
```

#### 徽章 (Badge)
```tsx
// 狀態標籤
<Badge variant="secondary">已入庫</Badge>
<Badge variant="default">處理中</Badge>
<Badge variant="destructive">待付款</Badge>
```

#### 輸入框
```tsx
// 搜索框 (帶圖標)
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"/>
  <Input className="pl-9" placeholder="搜索"/>
</div>
```

### 🎭 動畫效果

#### Framer Motion
```tsx
// 淡入動畫
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

#### 過渡效果
- **按鈕懸停**: 自動 (Tailwind)
- **卡片懸停**: 可選 `hover:shadow-lg transition-shadow`
- **動畫時長**: 通常 `0.2s` 或 `0.3s`

### 📊 圖表設計

#### Recharts 配置
```tsx
<ResponsiveContainer width="100%" height={200}>
  <AreaChart data={data}>
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={theme.primary} stopOpacity={0.3}/>
        <stop offset="95%" stopColor={theme.primary} stopOpacity={0}/>
      </linearGradient>
    </defs>
    <Area 
      type="monotone" 
      stroke={theme.primary}
      fill="url(#gradient)"
    />
  </AreaChart>
</ResponsiveContainer>
```

### 🌐 多語言考慮

#### 文字空間預留
- 英文通常比中文長 30-50%
- 使用 `truncate` 或 `line-clamp` 防止溢出
- 按鈕寬度使用 `min-w-[100px]` 確保最小寬度

### 🎯 設計原則

1. **一致性**: 所有組件使用統一的間距、顏色、圓角
2. **層次感**: 通過字重、顏色、大小建立視覺層次
3. **留白**: 充足的空白讓界面更清晰
4. **對齊**: 嚴格的網格對齊，使用 Tailwind 的 `gap` 系統
5. **可訪問性**: 顏色對比度符合 WCAG AA 標準

### 📐 關鍵尺寸速查

```
導航欄高度: auto (py-3 約 60px)
頁面左右邊距: px-4 (16px)
最大內容寬度: max-w-7xl (1280px)
卡片圓角: 0.5rem (8px)
卡片間距: gap-4 (16px)
圖標大小: 
  - 小: h-4 w-4 (16px)
  - 中: h-5 w-5 (20px)  
  - 大: h-6 w-6 (24px)
按鈕內距: px-4 py-2
輸入框高度: h-10 (40px)
```

---

## 📄 授權

MIT License

---

**Built with ❤️ using Next.js + TypeScript + next-intl**
