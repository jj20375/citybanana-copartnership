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
    details: RequestDetails;
    district: string;
    due_at: string;
    ended_at: null;
    /**
     * 已報名服務商，已報名服務商列表
     */
    enrollers: Enroller[];
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
    status: number;
    user: RequestUser;
    user_id: number;
    [property: string]: any;
}

export interface RequestDetails {
    acceptedVoucherUsed: number;
    credit_card_id: string;
    datingDemandFeePercentage: string;
    duration: number;
    eachFee: number;
    eachPrice: number;
    eachProviderRemuneration: number;
    eachTransactionFee: number;
    eachVoucherUsed: number;
    fee: number;
    hourlyPrice: number;
    isCommissionPaidByProvider: string;
    isX: boolean;
    merchant: PurpleMerchant;
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

export interface PurpleMerchant {
    merchant_id: number;
    venue_id: number;
    [property: string]: any;
}

export interface Enroller {
    created_at: string;
    dating: null | Dating;
    dating_demand_id: number;
    dating_id: number | null;
    hourly_pay: number;
    id: number;
    status: number;
    travel_time: number;
    user: EnrollerUser;
    user_id: number;
    [property: string]: any;
}

export interface Dating {
    cash_receivable: number;
    created_at: string;
    cut_due_time: null;
    details: DatingDetails;
    expected_arrival_time: string;
    id: number;
    is_x: boolean;
    order_id: string;
    point_paid: number;
    refund: number;
    source_application: string;
    voucher_paid: number;
    [property: string]: any;
}

export interface DatingDetails {
    brokerCommission: number;
    credit_card_id: string;
    duration: number;
    fee: number;
    hourlyPrice: number;
    isX: boolean;
    merchant: FluffyMerchant;
    payment_id: number;
    price: number;
    providerPercentage: number;
    serviceCharge: number;
    sourceApplication: string;
    tip: number;
    total: number;
    transactionFee: number;
    transactionFeePercentage: string;
    travelTime: number;
    unit: string;
    [property: string]: any;
}

export interface FluffyMerchant {
    merchant_id: number;
    venue_id: number;
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
    /**
     * 判斷是否為首次註冊會員資料不完整會員（合作店家註冊)
     * 1 = 資料不完整
     * 再合作店家開單時 資料不完整會員 需補上暱稱與性別才能開單
     */
    newbie: number;
    occupation: PurpleOccupation[];
    passbook: null;
    photos: PurplePhoto[];
    rating_score: number;
    thumbnails: PurpleThumbnails;
    videos: null;
    [property: string]: any;
}

export interface Badge {
    id: number;
    name: string;
    pivot: BadgePivot;
    [property: string]: any;
}

export interface BadgePivot {
    badge_id: number;
    user_id: number;
    [property: string]: any;
}

export interface PurpleOccupation {
    description?: string;
    id: string;
    name: string;
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

export interface RequestUser {
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
    /**
     * 判斷是否為首次註冊會員資料不完整會員（合作店家註冊)
     * 1 = 資料不完整
     * 再合作店家開單時 資料不完整會員 需補上暱稱與性別才能開單
     */
    newbie: number;
    occupation: FluffyOccupation[];
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

export interface FluffyOccupation {
    id?: string;
    name?: string;
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
 * 即刻快閃列表 api 回應參數
 */

export interface GetRightNowActivityOrderListAPIResInterface {
    current_page: number;
    data: Datum[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: null;
    path: string;
    per_page: string;
    prev_page_url: null;
    to: number;
    total: number;
    [property: string]: any;
}

export interface Datum {
    anonymous: number;
    at_any_time: boolean;
    created_at: string;
    currency: string;
    demand_id: string;
    description: string;
    details: Details;
    district: string;
    due_at: string;
    ended_at: null | string;
    hourly_pay: number;
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
    requirement: null | string;
    source_application: string;
    started_at: null | string;
    status: number;
    user: User;
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
    eachTransactionFee?: number;
    eachVoucherUsed: number;
    fee: number;
    hourlyPrice: number;
    isCommissionPaidByProvider: string;
    isX: boolean | number;
    merchant: Merchant;
    penalty: number;
    pointPaid: number;
    pointRefunded: number;
    price: number;
    prohibitVoucherForDatingDemand: string;
    sourceApplication: string;
    total: number;
    transactionFeePercentage: string;
    unit: string;
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

export interface User {
    avatar: string;
    banana_id: string;
    cover: string;
    description: string;
    enablePayByCash: number;
    gender: string;
    id: number;
    isMyFavorite: boolean;
    matrices: string[];
    name: string;
    /**
     * 判斷是否為首次註冊會員資料不完整會員（合作店家註冊)
     * 1 = 資料不完整
     * 再合作店家開單時 資料不完整會員 需補上暱稱與性別才能開單
     */
    newbie: number;
    passbook: string;
    photos: Photo[];
    rating_score: number;
    status: number;
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
