# GitHub Pages 部署指南

## 🚀 自動部署步驟

### 1️⃣ 安裝 gh-pages 套件
```bash
npm install
```

### 2️⃣ 初始化 Git 倉庫（如果還沒有）
```bash
git init
git add .
git commit -m "Initial commit"
```

### 3️⃣ 連接到遠端倉庫
```bash
git remote add origin https://github.com/elf-express/DM_NewWeb_React.git
git branch -M main
```

### 4️⃣ 推送到 GitHub
```bash
git push -u origin main
```

### 5️⃣ 部署到 GitHub Pages
```bash
npm run deploy
```

這個命令會：
- 自動建置專案 (`npm run build`)
- 將 `dist` 資料夾的內容推送到 `gh-pages` 分支
- GitHub 會自動從 `gh-pages` 分支發布網站

### 6️⃣ 在 GitHub 設置 Pages

1. 前往 https://github.com/elf-express/DM_NewWeb_React/settings/pages
2. 在 "Source" 下拉選單中選擇 `gh-pages` 分支
3. 點擊 "Save"

## 🌐 網站網址

部署成功後，您的網站將會在：
```
https://elf-express.github.io/DM_NewWeb_React/
```

## 🔄 後續更新

每次更新代碼後，只需要執行：
```bash
git add .
git commit -m "更新說明"
git push
npm run deploy
```

## ⚙️ 配置說明

- `vite.config.ts` 中的 `base: '/DM_NewWeb_React/'` 確保資源路徑正確
- `package.json` 中的 `deploy` 腳本自動化部署流程
- `.gitignore` 已配置忽略 `node_modules` 和 `dist`

## 📝 注意事項

- 首次部署可能需要幾分鐘才能生效
- 確保 GitHub 倉庫是公開的（或有 GitHub Pro 才能使用私有倉庫的 Pages）
- 每次修改主題或內容後，記得執行 `npm run deploy` 來更新線上版本
