/**
 * 取得簡訊驗證碼 api 參數
 */
export interface GetVerificationCodeAPIReqInterface {
    // 手機號碼 ex: 886955831666
    phone: string;
    // 國碼 ex: 886
    country_code: string;
    // 裝置名稱 (判斷是 app 還是 web)
    client?: string | void;
    // 重置密碼 (是否為重置密碼需求 true = 是 false = 否)
    reset_password?: boolean;
    // recaptcha token (google recaptcha v2版本 驗證 token)
    recaptchaToken: string;
}

/**
 * 取得簡訊驗證碼 api 回應參數
 */
export interface GetVerificationCodeAPIResInterfacce {
    message: string;
    phone: string;
    // 簡訊驗證加密字串
    crumb: string;
}

/**
 * 驗證簡訊驗證碼
 */
export interface VerificationSMSCodeAPIReqInterface {
    // 手機號碼 ex: 886955831666
    phone: string;
    // 國碼 ex: 886
    country_code: string;
    // 取得簡訊驗證碼時回傳密鑰值
    crumb: string;
    // 簡訊驗證碼 ex: 123456 (六位數字)
    code: string;
    // 身份 role = 0 代表消費者 role = 4 代表服務商 因應未來服務商報班系統
    role?: 0 | 4;
}

/**
 * 驗證簡訊驗證碼 api 回應
 */
export interface VerificationSMSCodeAPIResInterface {
    access_token: string;
    expires_in: number;
    message: string;
    registered: boolean;
    suspended: boolean;
    token_type: string;
    user: User;
    user_role: number;
    [property: string]: any;
}

export interface User {
    address: null;
    age: null;
    apple_user: null;
    avatar: string;
    badges: string[];
    banana_id: string;
    banking: string;
    birthday: null;
    broker_id: null;
    cover: string;
    created_at: string;
    custom_activities: string[];
    custom_skills: string[];
    description: null;
    district: null;
    email: null;
    enablePayByCash: number;
    facebook_user: null;
    gender: string;
    google_user: null;
    government_cert: null;
    height: null;
    id: number;
    line_user: null;
    locale: string;
    marketing_notification: number;
    matrices: Matrices;
    media: string[];
    name: null;
    occupation: string[];
    online: number;
    phone: string;
    photos: null;
    promotee: null;
    promoter_id: null;
    ranking: number;
    rating_score: number;
    real_name: null;
    role: number;
    service_area: null;
    setting: Setting;
    social: string[];
    status: number;
    stealth: number;
    taboo: null;
    thumbnails: Thumbnails;
    timezone: string;
    updated_at: string;
    valid_jwt_after: null;
    videos: null;
    wallet: Wallet;
    weight: null;
    [property: string]: any;
}

export interface Matrices {
    num_of_cancel: number;
    response_rate: string;
    response_time: string;
    [property: string]: any;
}

export interface Setting {
    enablePayByCash: number;
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

export interface Wallet {
    balance: number;
    [property: string]: any;
}
