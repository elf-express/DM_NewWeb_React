const fs = require('fs');
const path = require('path');

// 部署前：將生產配置複製為主配置
const prodConfig = path.join(__dirname, '../next.config.production.mjs');
const mainConfig = path.join(__dirname, '../next.config.mjs');
const backupConfig = path.join(__dirname, '../next.config.dev.mjs');

// 備份開發配置
if (fs.existsSync(mainConfig)) {
  fs.copyFileSync(mainConfig, backupConfig);
}

// 使用生產配置
fs.copyFileSync(prodConfig, mainConfig);

console.log('✅ 已切換到生產配置');
