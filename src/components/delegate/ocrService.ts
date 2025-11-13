import Tesseract from 'tesseract.js';

/**
 * OCR 識別後的數據結構
 */
export interface ExtractedData {
  productName: string;
  quantity: number;
  price: number;
  trackingNumber: string;
  platform: string;
}

/**
 * 從圖片中提取數據
 */
export async function extractDataFromImage(
  imageData: string,
  onProgress?: (progress: number) => void
): Promise<ExtractedData> {
  try {
    // 使用 Tesseract.js 進行 OCR 識別
    const result = await Tesseract.recognize(
      imageData,
      'chi_sim+eng', // 使用簡體中文 + 英文
      {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(Math.round(m.progress * 100));
          }
        }
      }
    );

    const text = result.data.text;
    console.log('OCR Result:', text);

    // 解析識別出的文本
    const extractedData = parseOCRText(text);

    return extractedData;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('OCR 識別失敗');
  }
}

/**
 * 解析 OCR 文本，提取關鍵信息
 */
function parseOCRText(text: string): ExtractedData {
  console.log('開始解析文本:', text);

  // 快遞單號正則表達式（針對中通、申通、韻達等）
  const trackingPatterns = [
    // 中通快遞: 301342581579, 75620248902690, 77335248077929
    /(?:中通快遞|中通|ZTO)[\s:：]*(\d{12,15})/i,
    // 申通快遞
    /(?:申通快遞|申通|STO)[\s:：]*(\d{12,15})/i,
    // 韻達快遞: 43466863401394
    /(?:韻達快遞|韻達|YUNDA)[\s:：]*(\d{12,15})/i,
    // 順豐快遞
    /(?:順豐快遞|順豐|SF)[\s:：]*([A-Z0-9]{12,15})/i,
    // 圓通快遞
    /(?:圓通快遞|圓通|YTO)[\s:：]*(\d{12,15})/i,
    // 通用純數字單號（12-15位）
    /(?:快遞單號|物流單號|運單號)[\s:：]*(\d{12,15})/i,
    // 直接匹配12-15位純數字
    /\b(\d{12,15})\b/g,
  ];

  // 商品名稱正則（從淘寶訂單中提取）
  const productPatterns = [
    // 匹配商品描述行（通常在圖片後面，包含中文和數字）
    /([帆布袋|馬甲|按摩儀|遮陽膜|手提袋|定制|印logo|兒童|防水][^\n\r]{10,80})/,
    // 匹配"已簽收"或"運輸中"後的商品信息
    /(?:已簽收|運輸中|已發貨)[\s\n\r]+([^\n\r]{5,60})/,
    // 商品標題模式
    /(?:商品|產品|貨品)[\s:：]*([^\n\r]{5,60})/i,
  ];

  // 數量正則（x1000, x1 格式）
  const quantityPatterns = [
    /[xX×](\d+)/,  // x1000, ×1
    /(?:數量|件數)[\s:：]*(\d+)/i,
    /(\d+)\s*(?:件|個|pcs)/i,
  ];

  // 價格正則（¥2.9, ¥2.83 格式）
  const pricePatterns = [
    /[¥￥]\s*(\d+\.?\d*)/,  // ¥2.9
    /(?:單價|價格|金額|實付款|TWD)[\s:：]*[¥￥$]?\s*(\d+\.?\d*)/i,
    /TWD\s*(\d+\.?\d*)/i,
  ];

  // 平台識別
  const platformPatterns = [
    { pattern: /淘寶|taobao/i, name: '淘寶' },
    { pattern: /天貓|tmall/i, name: '天貓' },
    { pattern: /京東|jd|JD/i, name: '京東' },
    { pattern: /拼多多|pinduoduo|PDD/i, name: '拼多多' },
    { pattern: /1688|阿里巴巴/i, name: '1688' },
  ];

  let trackingNumber = '';
  let productName = '';
  let quantity = 1;
  let price = 0;
  let platform = '';

  // 提取快遞單號
  for (const pattern of trackingPatterns) {
    const match = text.match(pattern);
    if (match) {
      const candidate = match[1] || match[0];
      const cleaned = candidate.replace(/[^A-Z0-9]/gi, '').trim();
      // 快遞單號通常是12-15位純數字
      if (cleaned.length >= 12 && cleaned.length <= 15 && /^\d+$/.test(cleaned)) {
        trackingNumber = cleaned;
        console.log('找到快遞單號:', trackingNumber);
        break;
      }
    }
  }

  // 提取商品名稱
  for (const pattern of productPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let candidate = match[1].trim();
      // 清理特殊字符和多餘空格
      candidate = candidate
        .replace(/[【】\[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      // 過濾掉一些無用信息
      if (
        candidate.length >= 5 &&
        candidate.length <= 80 &&
        !candidate.includes('已簽收') &&
        !candidate.includes('運輸中') &&
        !candidate.includes('深圳市') &&
        !candidate.includes('電話')
      ) {
        productName = candidate;
        console.log('找到商品名稱:', productName);
        break;
      }
    }
  }

  // 如果沒找到商品名稱，嘗試從文本中智能提取
  if (!productName) {
    // 查找包含常見商品關鍵字的行
    const lines = text.split(/[\n\r]+/).filter(line => line.trim().length > 5);
    for (const line of lines) {
      const cleaned = line.trim();
      // 跳過狀態、地址等信息
      if (
        /帆布|馬甲|按摩|定制|手提|防水|logo|包|袋|衣|鞋|器|機|膜|套/.test(cleaned) &&
        !/(已簽收|運輸中|深圳|廣州|北京|上海|快遞|物流|電話)/.test(cleaned)
      ) {
        productName = cleaned.substring(0, 60);
        console.log('智能提取商品名稱:', productName);
        break;
      }
    }
  }

  // 提取數量
  for (const pattern of quantityPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const qty = parseInt(match[1], 10);
      if (qty > 0 && qty <= 100000) {  // 支持大批量訂單
        quantity = qty;
        console.log('找到數量:', quantity);
        break;
      }
    }
  }

  // 提取價格
  const allPriceMatches: number[] = [];
  for (const pattern of pricePatterns) {
    const matches = text.matchAll(new RegExp(pattern.source, pattern.flags + 'g'));
    for (const match of matches) {
      if (match[1]) {
        const parsedPrice = parseFloat(match[1]);
        if (parsedPrice > 0 && parsedPrice < 1000000) {
          allPriceMatches.push(parsedPrice);
        }
      }
    }
  }
  
  // 優先選擇較小的價格（通常是單價而非總價）
  if (allPriceMatches.length > 0) {
    // 排序並選擇中位數或最小值
    allPriceMatches.sort((a, b) => a - b);
    price = allPriceMatches[0]; // 選擇最小的價格作為單價
    console.log('找到價格:', price, '(從', allPriceMatches, ')');
  }

  // 識別平台
  for (const { pattern, name } of platformPatterns) {
    if (pattern.test(text)) {
      platform = name;
      console.log('識別到平台:', platform);
      break;
    }
  }

  // 如果沒識別到平台，嘗試從文本推斷
  if (!platform) {
    if (text.includes('訂單編號') && /\d{18,}/.test(text)) {
      platform = '淘寶';
    } else if (text.includes('TWD')) {
      platform = '淘寶';
    }
  }

  const result = {
    productName: productName || '未識別',
    quantity: quantity || 1,
    price: price || 0,
    trackingNumber: trackingNumber || '',
    platform: platform || '其他',
  };

  console.log('最終識別結果:', result);
  return result;
}

/**
 * 格式化追蹤號碼
 */
function formatTrackingNumber(raw: string): string {
  // 移除所有空格和特殊字符
  let cleaned = raw.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  // 限制長度
  if (cleaned.length > 30) {
    cleaned = cleaned.substring(0, 30);
  }
  
  return cleaned;
}
