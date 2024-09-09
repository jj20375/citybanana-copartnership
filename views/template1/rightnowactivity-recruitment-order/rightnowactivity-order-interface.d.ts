import type { AreaInterface } from "@/interface/area";

/**
 * 即刻快閃上方區塊
 */
export interface RightNowActivityOrderDetailTopContentInterface {
    // 店家名稱
    store: string;
    // 活動時間
    startDateTime: string;
}

/**
 * 即刻快閃服務商報名卡片樣式資料
 */
export interface RightNowActivityOrderDetailProviderSigupCardInterface {
    id: number | string;
    name: string;
    // 封面圖
    cover: string;
    // 評分
    rate?: number;
    // 描述
    description?: string;
    // 報價方式 以小時或天
    unit?: "hour" | "day";
    // 身高
    height?: number;
    // 體重
    weight?: number;
    // 年齡
    age?: number;
    // 預計抵達時間
    travelTime?: number;
    // 判斷是否選擇現在為開始時間的訂單 此訂單需顯示 服務商抵達時間
    isNowTime: boolean;
    // 每小時或每天單價金額
    price: number;
    // 居住縣市
    area: AreaInterface;
    // 身份驗證是否通過
    authentication: boolean;
    // 職業
    job?: string | void;
    // 判斷是否顯示快閃皇后
    isQueen: boolean;
    // 描述
    description: string;
}

/**
 * 即刻快閃服務商評論資料
 */
export interface RightNowActivityOrderProviderCommentInterface {
    id: string | number;
    name: string;
    // 大頭照
    avatar: string;
    // 評分
    rate: number;
    // 內容
    content: string;
    // 時間
    createdAt: string;
}
