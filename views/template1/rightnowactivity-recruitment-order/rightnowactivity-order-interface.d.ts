import type { AreaInterface } from "@/interface/area";
import type { GetOrderDetailAPIResInterface } from "@/api/orderAPI.ts/orderAPI-interface";

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
    // enrolls 表 id 用來取得即刻快閃報名服務商對應資料
    id: string;
    // 判斷服務商是否有一般預訂單
    haveDating: boolean;
    name: string;
    // 封面圖
    cover: string;
    // 評分
    rate?: number;
    // 描述
    description?: string;
    // 報價方式 以小時或天
    unit: "hour" | "day";
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
    // 服務商被選擇狀態 status = 0 未選擇 status = 1 已選擇
    enrollerStatus: number;
    // 服務商 banana_id
    providerID?: string;
    // 一般訂單 ID
    orderID?: string;
    // 服務商評論
    comments?: RightNowActivityOrderProviderCommentInterface[] | void | null | undefined;
    // 訂單資料
    datingOrder?: void | GetRightNowActivityOrderDetailAPIResInterface.Enroller.Dating | undefined | null;
}

/**
 * 即刻快閃服務商評論資料
 */
export interface RightNowActivityOrderProviderCommentInterface {
    name: string;
    // 大頭照
    avatar: string;
    // 評分
    rate: number;
    // 內容
    content: string | null;
    // 時間
    createdAt?: string | void;
}
