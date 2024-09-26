/**
 * 取得即刻快閃單一訂單資料 api 回應參數
 */
export interface GetRightNowActivityOrderDetailAPIResInterface {
    created_at: string;
    demand_id: string;
    description: string;
    district: string;
    due_at: string;
    ended_at: string;
    /**
     * 已報名服務商，已報名服務商列表
     */
    enrollers: Enroller[];
    hourly_pay: number;
    location: string;
    my_enrolled_status: boolean;
    name: string;
    provider_enrolled: number;
    provider_required: number;
    started_at: string;
    status: number;
    [property: string]: any;
}

export interface Enroller {
    created_at?: string;
    dating?: Dating;
    dating_demand_id?: number;
    dating_id?: number;
    id?: number;
    status?: number;
    user?: User;
    user_id?: number;
    [property: string]: any;
}

export interface Dating {
    id: number;
    order_id: string;
    refund: number;
    [property: string]: any;
}

export interface User {
    avatar: string;
    banana_id: string;
    cover: string;
    gender: string;
    id: number;
    isMyFavorite: boolean;
    name: string;
    passbook: null;
    photos: null;
    thumbnails: Thumbnails;
    videos: null;
    [property: string]: any;
}

export interface Thumbnails {
    avatar: Avatar;
    cover: Cover;
    photos: string[];
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
