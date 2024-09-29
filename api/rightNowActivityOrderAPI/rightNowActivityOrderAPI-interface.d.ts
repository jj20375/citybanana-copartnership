/**
 * 取得即刻快閃單一訂單資料 api 回應參數
 */
export interface GetRightNowActivityOrderDetailAPIResInterface {
    anonymous: number;
    at_any_time: boolean;
    created_at: string;
    currency: string;
    demand_id: string;
    description: string;
    details: Details;
    district: string;
    due_at: string;
    ended_at: null;
    /**
     * 已報名服務商，已報名服務商列表
     */
    enrollers: Enroller[] | [];
    hourly_pay: number;
    id: number;
    is_x: boolean;
    location: string;
    my_enrolled_data: null;
    my_enrolled_dating: null;
    my_enrolled_status: null;
    name: string;
    paid_by: number;
    provider_accepted: number;
    provider_enrolled: number;
    provider_required: number;
    /**
     * 需求備註，特殊需求備註
     */
    requirement: null;
    source_application: string;
    started_at: null;
    status: number; // 身份驗證等級 status = 1 代表已驗證
    user: GetRightNowActivityOrderDetailAPIResInterfaceUser;
    user_id: number;
    [property: string]: any;
}

export interface Details {
    acceptedVoucherUsed: number;
    datingDemandFeePercentage: string;
    duration: number;
    eachFee: number;
    eachPrice: number;
    eachProviderRemuneration: number;
    eachVoucherUsed: number;
    fee: number;
    hourlyPrice: number;
    isCommissionPaidByProvider: string;
    isX: boolean;
    merchant: Merchant;
    penalty: number;
    pointPaid: number;
    pointRefunded: number;
    price: number;
    prohibitVoucherForDatingDemand: string;
    sourceApplication: string;
    total: number;
    transactionFeePercentage: string;
    unit: "hour" | "day";
    unitPrice: number;
    voucherPaid: number;
    voucherRefunded: number;
    voucherUsed: number;
    [property: string]: any;
}

export interface Merchant {
    merchant_id: number;
    venue_id: number;
    [property: string]: any;
}

export interface Enroller {
    created_at?: string;
    dating?: null;
    dating_demand_id?: number;
    dating_id?: null;
    hourly_pay?: number;
    id?: number;
    status?: number;
    travel_time?: number;
    user?: EnrollerUser;
    user_id?: number;
    [property: string]: any;
}

export interface EnrollerUser {
    avatar: string;
    badges: Badge[];
    banana_id: string;
    cover: string;
    description: string;
    enablePayByCash: number;
    gender: string;
    id: number;
    isMyFavorite: boolean;
    matrices: string[];
    name: string;
    passbook: null;
    photos: PurplePhoto[];
    rating_score: number;
    thumbnails: PurpleThumbnails;
    videos: null;
    [property: string]: any;
}

export interface Badge {
    id?: number;
    name?: string;
    pivot?: BadgePivot;
    [property: string]: any;
}

export interface BadgePivot {
    badge_id: number;
    user_id: number;
    [property: string]: any;
}

export interface PurplePhoto {
    id: string;
    is_erotic: number;
    sorting: number;
    url: string;
    [property: string]: any;
}

export interface PurpleThumbnails {
    avatar: PurpleAvatar;
    cover: PurpleCover;
    photos: PurplePhotos;
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

export interface PurplePhotos {
    "360x360": Purple360X360[];
    "720x720": Purple720X720[];
    [property: string]: any;
}

export interface Purple360X360 {
    id: string;
    is_erotic: number;
    sorting: number;
    url: string;
    [property: string]: any;
}

export interface Purple720X720 {
    id: string;
    is_erotic: number;
    sorting: number;
    url: string;
    [property: string]: any;
}

export interface GetRightNowActivityOrderDetailAPIResInterfaceUser {
    address: string;
    age: number;
    avatar: string;
    banana_id: string;
    banking: Banking;
    birthday: string;
    broker_id: null;
    consent: Consent[];
    cover: string;
    created_at: string;
    custom_activities: string[];
    custom_skills: string[];
    description: string;
    district: string;
    email: string;
    enablePayByCash: number;
    gender: string;
    government_cert: number;
    government_id: string;
    height: number;
    id: number;
    isMyFavorite: boolean;
    last_seen_at: string;
    locale: string;
    marketing_notification: number;
    matrices: string[];
    media: Media;
    name: string;
    occupation: Occupation[];
    online: number;
    passbook: string;
    phone: string;
    photos: FluffyPhoto[];
    promoter_id: null;
    ranking: number;
    rating_score: number;
    real_name: string;
    role: number;
    service_area: string;
    setting: Setting;
    social: Social;
    status: number;
    stealth: number;
    taboo: null;
    tags: Tag[];
    thumbnails: FluffyThumbnails;
    updated_at: string;
    valid_jwt_after: string;
    videos: null;
    wallet: Wallet;
    weight: number;
    [property: string]: any;
}

export interface Banking {
    accountId: string;
    accountName: string;
    bankCode: number;
    bankName: string;
    swift: string;
    [property: string]: any;
}

export interface Consent {
    name: string;
    time: string;
    version: string;
    [property: string]: any;
}

export interface Media {
    photos: string[];
    [property: string]: any;
}

export interface Occupation {
    id?: string;
    [property: string]: any;
}

export interface FluffyPhoto {
    id?: string;
    is_erotic?: number;
    sorting?: number;
    url?: string;
    [property: string]: any;
}

export interface Setting {
    disable_dating_demand: number;
    enableBirthday: number;
    enablePayByCash: number;
    plan: null;
    receiveDatingAcceptedSMS: number;
    [property: string]: any;
}

export interface Social {
    instagram: null;
    welcome_message: string;
    welcome_message_enabled: number;
    [property: string]: any;
}

export interface Tag {
    id: number;
    name: string;
    pivot: TagPivot;
    [property: string]: any;
}

export interface TagPivot {
    tag_id: number;
    user_id: number;
    [property: string]: any;
}

export interface FluffyThumbnails {
    avatar: FluffyAvatar;
    cover: FluffyCover;
    photos: FluffyPhotos;
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

export interface FluffyPhotos {
    "360x360": Fluffy360X360[];
    "720x720": Fluffy720X720[];
    [property: string]: any;
}

export interface Fluffy360X360 {
    id?: string;
    is_erotic?: number;
    sorting?: number;
    url?: string;
    [property: string]: any;
}

export interface Fluffy720X720 {
    id?: string;
    is_erotic?: number;
    sorting?: number;
    url?: string;
    [property: string]: any;
}

export interface Wallet {
    balance: number;
    voucher: number;
    [property: string]: any;
}

/**
 * 更改即刻快閃單服務商需求數量 api 請求參數
 */
export interface ChangeRightNowActivityProviderRequiredAPIReqInterface {
    orderID: string;
    provider_required: number;
}

/**
 * 更改服務商需求數量 api回應參數
 */
export interface ChangeRightNowActivityProviderRequiredAPIResInterface {
    message: string;
    demand: GetRightNowActivityOrderDetailAPIResInterface;
}

/**
 *
 */
