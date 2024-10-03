/**
 * 取得單一訂單資料 api 回應參數
 */
export interface GetOrderDetailAPIResInterface {
    category: Category;
    category_id: number;
    closed_at: string;
    created_at: string;
    /**
     * 續約單資料
     */
    dating_extensions: DatingExtension[];
    description: string;
    details: GetOrderDetailAPIResInterfaceDetails;
    district: string;
    duration: number;
    ended_at: string;
    /**
     * 給予小費，給予過的小費額度
     */
    extra_tip: number;
    /**
     * 支付費用，會員需支付費用
     */
    gross_price: number;
    location: string;
    order_id: string;
    /**
     * 已收款項，會員已支付款項
     */
    paid: string;
    /**
     * 訂單加小費，訂單合計加小費金額
     */
    price: string;
    /**
     * 服務商資料
     */
    provider: Provider;
    provider_comment: null;
    /**
     * 服務商收益
     */
    provider_remuneration: number;
    /**
     * 服務商可預訂時段，新增服務商婉拒後，提供會員其他可預訂時間
     */
    recommend_times: RecommendTimes;
    refund: number;
    started_at: string;
    status: number;
    /**
     * 會員資料
     */
    user: User;
    user_comment: null;
    user_score: number;
    [property: string]: any;
}

export interface Category {
    id: number;
    name: string;
    [property: string]: any;
}

export interface DatingExtension {
    dating_id: number;
    details: DatingExtensionDetails;
    ended_at: string;
    started_at: string;
    status: number;
    [property: string]: any;
}

export interface DatingExtensionDetails {
    duration: number;
    fee: number;
    hourlyPrice: number;
    price: number;
    serviceCharge: number;
    tip: number;
    total: number;
    [property: string]: any;
}

export interface GetOrderDetailAPIResInterfaceDetails {
    /**
     * 時長，時數或天數
     */
    duration: number;
    /**
     * 手續費，手續費
     */
    fee: number;
    /**
     * 長單價，每小時或每天單價
     */
    hourlyPrice: number;
    /**
     * 小費加合計，加上小費後費用
     */
    price: number;
    /**
     * 訂單合計，訂單合計為加上手續費與小費
     */
    serviceCharge: number;
    /**
     * 小費，小費
     */
    tip: number;
    /**
     * 訂單總計，加上服務費與小費後費用
     */
    total: number;
    [property: string]: any;
}

/**
 * 服務商資料
 */
export interface Provider {
    avatar: string;
    banana_id: string;
    cover: string;
    gender: string;
    id: number;
    isMyFavorite: boolean;
    name: string;
    passbook: null;
    phone: string;
    photos: null;
    setting: ProviderSetting;
    thumbnails: ProviderThumbnails;
    videos: null;
    [property: string]: any;
}

export interface ProviderSetting {
    datingAfterHours: number;
    disableCityAi: number;
    disableWithdraw: boolean;
    enableCityAi: number;
    plan: Plan;
    receiveDemandNotification: number;
    [property: string]: any;
}

export interface Plan {
    expiration: string;
    id: string;
    [property: string]: any;
}

export interface ProviderThumbnails {
    avatar: PurpleAvatar;
    cover: PurpleCover;
    photos: string[];
    videos: string[];
    [property: string]: any;
}

export interface PurpleAvatar {
    "360x360": string;
    "720x720": string;
    [property: string]: any;
}

export interface PurpleCover {
    "360x360": string;
    "720x720": string;
    [property: string]: any;
}

/**
 * 服務商可預訂時段，新增服務商婉拒後，提供會員其他可預訂時間
 */
export interface RecommendTimes {
    "2024-05-23": The20240523;
    "2024-05-24": The20240524;
    [property: string]: any;
}

export interface The20240523 {
    "18:00": number[];
    "19:00": number[];
    "20:00": number[];
    "21:00": number[];
    "22:00": number[];
    [property: string]: any;
}

export interface The20240524 {
    "11:00": number[];
    "12:00": number[];
    "13:00": number[];
    "14:00": number[];
    "15:00": number[];
    "16:00": number[];
    "17:00": number[];
    "18:00": number[];
    "19:00": number[];
    "20:00": number[];
    "21:00": number[];
    [property: string]: any;
}

/**
 * 會員資料
 */
export interface User {
    avatar: string;
    banana_id: string;
    cover: string;
    gender: string;
    id: number;
    isMyFavorite: boolean;
    name: string;
    passbook: null;
    phone: string;
    photos: null;
    setting: UserSetting;
    thumbnails: UserThumbnails;
    videos: null;
    [property: string]: any;
}

export interface UserSetting {
    enableBirthday: number;
    [property: string]: any;
}

export interface UserThumbnails {
    avatar: FluffyAvatar;
    cover: FluffyCover;
    photos: string[];
    videos: string[];
    [property: string]: any;
}

export interface FluffyAvatar {
    "360x360": string;
    "720x720": string;
    [property: string]: any;
}

export interface FluffyCover {
    "360x360": string;
    "720x720": string;
    [property: string]: any;
}

/**
 * 取得一般預訂單列表 api 回應參數
 */
export interface GetOrderListAPIResInterface {
    current_page: number;
    data: Datum[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: string;
    path: string;
    per_page: string;
    prev_page_url: null;
    to: number;
    total: number;
    [property: string]: any;
}

export interface Datum {
    cash_receivable: number;
    category: Category;
    category_id: number;
    closed_at: null | string;
    created_at: string;
    currency: string;
    cut_due_time: null | string;
    dating_extensions: string[];
    description: string;
    details: Details;
    district: string;
    ended_at: null | string;
    expected_arrival_time: string;
    extra_tip: number;
    extra_tip_created_at: null;
    gross_price: number;
    is_x: boolean;
    location: string;
    order_id: string;
    paid: number;
    paid_by: number;
    point_paid: number;
    price: number;
    provider: Provider;
    provider_comment: null;
    provider_score: number;
    refund: number;
    requirement: null;
    source_application: string;
    started_at: null | string;
    status: number;
    user_comment: null;
    user_score: number;
    voucher_paid: number;
    [property: string]: any;
}

export interface Category {
    id: number;
    name: string;
    [property: string]: any;
}

export interface Details {
    brokerCommission?: number;
    cancelledNote?: string;
    credit_card_id?: number | string;
    duration: number;
    fee: number | number;
    hourlyPrice: number;
    isX?: boolean | number;
    logs?: Logs;
    merchant?: Merchant;
    payment_id?: number;
    price: number;
    providerPercentage?: number;
    refuse_new_time?: number;
    refusedBySystem: boolean;
    refusedNote: string;
    serviceCharge: number;
    sourceApplication: string;
    tip: number | null;
    total: number;
    transactionFee?: number;
    transactionFeePercentage?: string;
    travelTime?: number;
    unit: string;
    unitPrice: number;
    voucherUsed: number;
    [property: string]: any;
}

export interface Logs {
    alertDatingExtension: string;
    arrivedAt: string;
    pay_by_cash: PayByCash;
    [property: string]: any;
}

export interface PayByCash {
    time: string;
    [property: string]: any;
}

export interface Merchant {
    merchant_id: number;
    venue_id: number;
    [property: string]: any;
}

export interface Provider {
    avatar: string;
    banana_id: string;
    cover: string;
    enablePayByCash: number;
    gender: string;
    id: number;
    isMyFavorite: boolean;
    matrices: string[];
    name: string;
    newbie: number;
    passbook: null;
    photos: Photo[];
    thumbnails: Thumbnails;
    videos: null;
    [property: string]: any;
}

export interface Photo {
    id: string;
    is_erotic: number;
    sorting: number;
    url: string;
    [property: string]: any;
}

export interface Thumbnails {
    avatar: Avatar;
    cover: Cover;
    photos: Photos;
    videos: string[];
    [property: string]: any;
}

export interface Avatar {
    "360x360": string;
    "720x720": string;
    [property: string]: any;
}

export interface Cover {
    "360x360": string;
    "720x720": string;
    [property: string]: any;
}

export interface Photos {
    "360x360": The360X360[];
    "720x720": The720X720[];
    [property: string]: any;
}

export interface The360X360 {
    id: string;
    is_erotic: number;
    sorting: number;
    url: string;
    [property: string]: any;
}

export interface The720X720 {
    id: string;
    is_erotic: number;
    sorting: number;
    url: string;
    [property: string]: any;
}

export interface Link {
    active: boolean;
    label: string;
    url: null | string;
    [property: string]: any;
}
