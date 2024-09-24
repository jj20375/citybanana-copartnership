import type { AreaInterface } from "@/interface/area";
// 現金開立即刻快閃單 api 請求參數
export interface RightNowActivityOrderCreateByCashAPIReqInterface {
    provider_required: number; // 服務商需求數量
    unit: "hour" | "day"; // 計價單位 hour = 時數 | day = 天數
    hourly_pay: number; // 單位單價 每小時或每天單價
    district: AreaInterface; // iso 3166 區域代碼
    location: string; // 會面地點
    due_at: string; // 招募截止時間
    started_at?: null | string | void; // 活動開始時間
    duration: number; // 活動時長 時數或天數
    description: string; // 活動描述
    pay_voucher: 0 | 1; // 是否使用折抵金
    merchant_code?: string | void; // 店家代號
    venue_code?: string | null | void; // 店家桌號代號
    requirement?: string; // 特殊需求備註
    is_x: boolean; // 是否為 x 網站開立訂單
}
// 現金開立即刻快閃單 api 請求參數
export interface RightNowActivityOrderCreateByOtherAPIReqInterface extends RightNowActivityOrderCreateByCashAPIReqInterface {
    [property: string]: any;
}

/**
 * 現金開立即刻快閃單 api 回應成功參數
 */
export interface RightNowActivityOrderCreateByCashAPIResInterface {
    /**
     * 即刻快閃單，即刻快閃單資訊
     */
    demand: Demand;
    message: string;
    [property: string]: any;
}
/**
 * 非現金開立即刻快閃單 api 回應成功參數
 */
export interface RightNowActivityOrderCreateByOtherAPIResInterface extends RightNowActivityOrderCreateByCashAPIResInterface {
    [property: string]: any;
}

/**
 * 即刻快閃單，即刻快閃單資訊
 */
export interface Demand {
    anonymous: number;
    /**
     * 動態即刻快閃，此值為 true時 代表動態即刻快閃 服務商提供抵達時間
     */
    at_any_time: boolean;
    /**
     * 創建時間，創建開單時間
     */
    created_at: string;
    /**
     * 即刻快閃id，即刻快閃單 id
     */
    demand_id: string;
    /**
     * 活動描述，活動描述
     */
    description: string;
    details: Details;
    /**
     * 區域，iso 3166. 城市區域代碼
     */
    district: string;
    /**
     * 招募時間，招募截止時間
     */
    due_at: string;
    /**
     * 結束時間，活動結束時間
     */
    ended_at: string;
    /**
     * 時長單價，每小時或每天單價
     */
    hourly_pay: number;
    /**
     * x網站來源，判斷是否為 x 網站來源開單
     */
    is_x: boolean;
    /**
     * 地點，會面地點
     */
    location: string;
    my_enrolled_data: null;
    my_enrolled_dating: null;
    my_enrolled_status: null;
    /**
     * 活動名稱，活動名稱
     */
    name: string;
    /**
     * 付款方式，paid_by = 1 代表現金付款
     */
    paid_by: number;
    /**
     * 服務商需求，服務商需求數量
     */
    provider_required: number;
    /**
     * 特殊需求，特殊需求備註
     */
    requirement: null;
    /**
     * 系統裝置，用來判斷開端裝置來源
     */
    source_application: string;
    /**
     * 開始時間，活動開始時間
     */
    started_at: string;
    /**
     * 狀態，即刻快閃狀態
     */
    status: number;
    /**
     * 使用者id，開單使用者 id
     */
    user_id: number;
    [property: string]: any;
}

/**
 * 即刻快閃單詳情
 */
export interface Details {
    acceptedVoucherUsed: number;
    datingDemandFeePercentage: string;
    /**
     * 時常，時數或天數
     */
    duration: number;
    eachFee: number;
    eachPrice: number;
    /**
     * 服務商收益，服務商可獲得報酬
     */
    eachProviderRemuneration: number;
    eachVoucherUsed: number;
    /**
     * 手續費，手續費
     */
    fee: number;
    /**
     * 時常單價，每小或每天單價
     */
    hourlyPrice: number;
    isCommissionPaidByProvider: string;
    /**
     * x網站來源，判斷是否為 x 網站來源開單
     */
    isX: number;
    /**
     * 店家資料
     */
    merchant: Merchant;
    penalty: number;
    pointPaid: number;
    pointRefunded: number;
    /**
     * 價格，服務雙需求數量*(單價*時長) 金額
     */
    price: number;
    prohibitVoucherForDatingDemand: string;
    /**
     * 系統裝置，用來判斷開端裝置來源
     */
    sourceApplication: string;
    /**
     * 總計，總訂單價格加上手續費
     */
    total: number;
    transactionFeePercentage: string;
    /**
     * 計價單位，hour=小時 day=天數
     */
    unit: string;
    /**
     * 服務商價格，每位服務商總價
     */
    unitPrice: number;
    voucherPaid: number;
    voucherRefunded: number;
    voucherUsed: number;
    [property: string]: any;
}

/**
 * 店家資料
 */
export interface Merchant {
    /**
     * 店家id，店家表id
     */
    merchant_id: number;
    /**
     * 桌號id，店家關聯桌號id
     */
    venue_id: number;
    [property: string]: any;
}
