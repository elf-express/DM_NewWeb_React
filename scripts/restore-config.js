const fs = require('fs');
const path = require('path');

// 部署後：恢復開發配置
const mainConfig = path.join(__dirname, '../next.config.mjs');
const backupConfig = path.join(__dirname, '../next.config.dev.mjs');

if (fs.existsSync(backupConfig)) {
  fs.copyFileSync(backupConfig, mainConfig);
  fs.unlinkSync(backupConfig);
  console.log('✅ 已恢復開發配置');
}
