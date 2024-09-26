/**
 * 使用新增信用卡開立即刻快閃單 api 請求參數
 */
export interface RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPIReqInterface {
    /**
     * 卡號，信用卡卡號
     */
    number: string;
    /**
     * 過期日期，信用卡過期日期 ex: 2909
     */
    expiration: string;
    /**
     * 安全碼，信用卡安全碼 最多3碼
     */
    cvc: string;
    /**
     * 即刻快閃單id，要付款的即刻快閃單 id
     */
    demand_id: string;
    /**
     * 預設付款卡，設定為預設付款卡
     */
    is_default: boolean;
    [property: string]: any;
}
/**
 * 使用指定信用卡開立即刻快閃單 api 請求參數
 */
export interface RightNowActivityOrderCreateByCreditCardAPIReqInterface extends Omit<RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPIReqInterface, "cvc" | "expiration" | "number"> {
    /**
     * 信用卡表id，使用現有的信用卡開單時需傳送
     */
    credit_card_id: string;
    [property: string]: any;
}

/**
 * 使用新增信用卡開立即刻快閃單 api 回應參數
 */
export interface RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPIResInterface {
    /**
     * 信用卡資料，信用卡資料
     */
    card: Card;
    message: string;
    [property: string]: any;
}

/**
 * 使用指定信用卡開立即刻快閃單 api 回應參數
 */
export interface RightNowActivityOrderCreateByCreditCardAPIResInterface extends RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPIResInterface {
    [property: string]: any;
}

/**
 * 信用卡資料，信用卡資料
 */
export interface Card {
    comment: string;
    /**
     * 安全碼，信用卡安全碼
     */
    cvc: string;
    /**
     * 過期日，信用卡過期日
     */
    expiration: string;
    /**
     * 信用卡id，信用卡表id
     */
    id: number;
    /**
     * 預設付款，是否為預設付款卡
     */
    is_default: boolean;
    /**
     * 卡號，加密過處理
     */
    number: string;
    /**
     * 狀態，信用卡狀態
     */
    status: number;
    /**
     * 使用者id，創建信用卡使用者id
     */
    user_id: number;
    [property: string]: any;
}

/**
 * 取消一般預訂單
 */
/**
 * Request
 */
export interface OrderCancelAPIResInterface {
    dating: Dating;
    message: string;
    [property: string]: any;
}

export interface Dating {
    category: Category;
    category_id: number;
    description: string;
    details: Details;
    district: string;
    ended_at: string;
    location: string;
    order_id: string;
    paid: number;
    price: number;
    provider: Provider;
    provider_comment: null;
    provider_score: number;
    started_at: string;
    status: number;
    user: User;
    [property: string]: any;
}

export interface Category {
    id: number;
    name: string;
    [property: string]: any;
}

export interface Details {
    cancelledNote: string;
    fee: number;
    serviceCharge: number;
    tip: number;
    total: number;
    [property: string]: any;
}

export interface Provider {
    avatar: string;
    banana_id: string;
    cover: string;
    id: number;
    isMyFavorite: boolean;
    name: string;
    passbook: null;
    photos: null;
    videos: null;
    [property: string]: any;
}

export interface User {
    avatar: null;
    banana_id: string;
    cover: string;
    id: number;
    isMyFavorite: boolean;
    name: string;
    passbook: null;
    photos: null;
    videos: null;
    [property: string]: any;
}
