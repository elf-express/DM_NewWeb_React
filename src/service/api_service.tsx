export interface ApiResponse<T> {
    success: boolean;
    code: string;
    message: string;
    data: T;
}

// 測試環境
const BASE_URL = 'https://newapptest.elf.com.tw';
// 正式環境
// const BASE_URL = 'https://newapp.elf.com.tw';

export const ocrImage = async <T = any>(imageDataUrl: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}/api/ocr/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl }),
    });

    if (!response.ok) {
        throw new Error(`OCR API request failed with status ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
        throw new Error(result.message || 'OCR processing failed');
    }

    return result.data;
};

// 匯出 api 物件，方便統一管理所有 API 呼叫
export const api = {
    ocrImage,
};
